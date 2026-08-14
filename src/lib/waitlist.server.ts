import {
  createCipheriv,
  createHmac,
  randomBytes,
  randomUUID,
} from "node:crypto";
import { isIP } from "node:net";
import {
  MongoClient,
  MongoServerError,
  type Collection,
  type Db,
  type Document,
} from "mongodb";

const EMAIL_MAX_LENGTH = 254;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const REQUEST_LIMIT_PER_WINDOW = 5;
const EMAIL_LOCAL_PATTERN = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/iu;
const DOMAIN_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/iu;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/u;

type EncryptedEmail = {
  ciphertext: string;
  iv: string;
  authTag: string;
  keyVersion: 1;
};

type RegistrationSource = "landing" | "offpay_migration";

type WaitlistDocument = {
  emailHash: string;
  emailEncrypted: EncryptedEmail;
  registeredAt: Date;
  schemaVersion: 1;
  source: RegistrationSource;
};

type ReadableWaitlistDocument = {
  email: string;
  registeredAt: Date;
  schemaVersion: 1;
  source: RegistrationSource;
  status: "registered";
};

type IpLimitDocument = {
  _id: string;
  requestId: string;
  nextAllowedAt: Date;
  expiresAt: Date;
  updatedAt: Date;
};

type RequestLimitDocument = {
  _id: string;
  requestCount: number;
  windowStartedAt: Date;
  expiresAt: Date;
  updatedAt: Date;
};

type WaitlistCollections = {
  registrations: Collection<WaitlistDocument>;
  readableRegistrations: Collection<ReadableWaitlistDocument>;
  ipLimits: Collection<IpLimitDocument>;
  requestLimits: Collection<RequestLimitDocument>;
};

export type RegistrationResult =
  | { status: "accepted"; retryAfterSeconds: number }
  | { status: "already_registered" }
  | { status: "rate_limited"; retryAfterSeconds: number };

export type RequestLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

const registrationValidator: Document = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "emailHash",
      "emailEncrypted",
      "registeredAt",
      "schemaVersion",
      "source",
    ],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "objectId" },
      emailHash: { bsonType: "string", pattern: "^[a-f0-9]{64}$" },
      emailEncrypted: {
        bsonType: "object",
        required: ["ciphertext", "iv", "authTag", "keyVersion"],
        additionalProperties: false,
        properties: {
          ciphertext: { bsonType: "string", minLength: 4, maxLength: 512 },
          iv: { bsonType: "string", minLength: 16, maxLength: 24 },
          authTag: { bsonType: "string", minLength: 20, maxLength: 32 },
          keyVersion: { bsonType: "int", enum: [1] },
        },
      },
      registeredAt: { bsonType: "date" },
      schemaVersion: { bsonType: "int", enum: [1] },
      source: {
        bsonType: "string",
        enum: ["landing", "offpay_migration"],
      },
    },
  },
};

const ipLimitValidator: Document = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "_id",
      "requestId",
      "nextAllowedAt",
      "expiresAt",
      "updatedAt",
    ],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "string", pattern: "^[a-f0-9]{64}$" },
      requestId: {
        bsonType: "string",
        pattern: "^[a-f0-9-]{36}$",
      },
      nextAllowedAt: { bsonType: "date" },
      expiresAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" },
    },
  },
};

const requestLimitValidator: Document = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "_id",
      "requestCount",
      "windowStartedAt",
      "expiresAt",
      "updatedAt",
    ],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "string", pattern: "^[a-f0-9]{64}$" },
      requestCount: {
        bsonType: "int",
        minimum: 1,
        maximum: REQUEST_LIMIT_PER_WINDOW,
      },
      windowStartedAt: { bsonType: "date" },
      expiresAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" },
    },
  },
};

const readableRegistrationValidator: Document = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "email",
      "registeredAt",
      "schemaVersion",
      "source",
      "status",
    ],
    additionalProperties: false,
    properties: {
      _id: { bsonType: "objectId" },
      email: { bsonType: "string", minLength: 5, maxLength: 254 },
      registeredAt: { bsonType: "date" },
      schemaVersion: { bsonType: "int", enum: [1] },
      source: {
        bsonType: "string",
        enum: ["landing", "offpay_migration"],
      },
      status: { bsonType: "string", enum: ["registered"] },
    },
  },
};

let clientPromise: Promise<MongoClient> | undefined;
let collectionsPromise: Promise<WaitlistCollections> | undefined;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function hmacSecret(): string {
  const secret = requiredEnv("WAITLIST_HMAC_SECRET");
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("WAITLIST_HMAC_SECRET must contain at least 32 bytes");
  }
  return secret;
}

function encryptionKey(): Buffer {
  const key = Buffer.from(requiredEnv("WAITLIST_ENCRYPTION_KEY"), "base64");
  if (key.length !== 32) {
    throw new Error("WAITLIST_ENCRYPTION_KEY must decode to 32 bytes");
  }
  return key;
}

function mongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = new MongoClient(requiredEnv("MONGODB_URI"), {
      appName: "perpal-waitlist",
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5_000,
      tls: true,
    })
      .connect()
      .catch((error) => {
        clientPromise = undefined;
        throw error;
      });
  }
  return clientPromise;
}

function hasMongoCode(error: unknown, code: number): boolean {
  return error instanceof MongoServerError && error.code === code;
}

async function validatedCollection<T extends Document>(
  db: Db,
  name: string,
  validator: Document,
): Promise<Collection<T>> {
  const exists = await db.listCollections({ name }, { nameOnly: true }).hasNext();

  if (!exists) {
    try {
      await db.createCollection<T>(name, {
        validator,
        validationAction: "error",
        validationLevel: "strict",
      });
    } catch (error) {
      // Another cold instance may have created it after the existence check.
      if (!hasMongoCode(error, 48)) throw error;
    }
  }

  return db.collection<T>(name);
}

async function collections(): Promise<WaitlistCollections> {
  if (!collectionsPromise) {
    collectionsPromise = (async () => {
      const client = await mongoClient();
      const db = client.db(requiredEnv("MONGODB_DB"));
      const registrations = await validatedCollection<WaitlistDocument>(
        db,
        "waitlist_registrations",
        registrationValidator,
      );
      const readableRegistrations =
        await validatedCollection<ReadableWaitlistDocument>(
          db,
          "waitlist_readable_registrations",
          readableRegistrationValidator,
        );
      const ipLimits = await validatedCollection<IpLimitDocument>(
        db,
        "waitlist_ip_limits",
        ipLimitValidator,
      );
      const requestLimits = await validatedCollection<RequestLimitDocument>(
        db,
        "waitlist_ip_request_limits",
        requestLimitValidator,
      );

      await Promise.all([
        registrations.createIndex(
          { emailHash: 1 },
          { name: "unique_email_hash", unique: true },
        ),
        readableRegistrations.createIndex(
          { email: 1 },
          { name: "unique_readable_email", unique: true },
        ),
        ipLimits.createIndex(
          { expiresAt: 1 },
          { expireAfterSeconds: 0, name: "expire_ip_limits" },
        ),
        requestLimits.createIndex(
          { expiresAt: 1 },
          { expireAfterSeconds: 0, name: "expire_request_limits" },
        ),
      ]);

      return {
        registrations,
        readableRegistrations,
        ipLimits,
        requestLimits,
      };
    })().catch((error) => {
      collectionsPromise = undefined;
      throw error;
    });
  }

  return collectionsPromise;
}

function keyedHash(kind: "email" | "ip", value: string): string {
  return createHmac("sha256", hmacSecret())
    .update(`${kind}\0${value}`, "utf8")
    .digest("hex");
}

function encryptEmail(email: string): EncryptedEmail {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(email, "utf8"),
    cipher.final(),
  ]);

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    keyVersion: 1,
  };
}

export function parseWaitlistPayload(value: unknown): string | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const keys = Object.keys(value);
  if (keys.length !== 1 || keys[0] !== "email") return null;

  const email = (value as { email?: unknown }).email;
  if (typeof email !== "string" || email.length > EMAIL_MAX_LENGTH) return null;

  const normalized = email.trim().normalize("NFKC").toLowerCase();
  const parts = normalized.split("@");
  const local = parts[0] ?? "";
  const domain = parts[1] ?? "";
  const labels = domain.split(".");
  if (
    normalized.length === 0 ||
    normalized.length > EMAIL_MAX_LENGTH ||
    CONTROL_CHARACTER_PATTERN.test(normalized) ||
    parts.length !== 2 ||
    local.length > 64 ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..") ||
    domain.length > 253 ||
    !EMAIL_LOCAL_PATTERN.test(local) ||
    labels.length < 2 ||
    !labels.every((label) => DOMAIN_LABEL_PATTERN.test(label))
  ) {
    return null;
  }

  return normalized;
}

function expandIpv6(value: string): string[] {
  let address = value.toLowerCase();
  const embeddedIpv4 = address.match(/(\d+\.\d+\.\d+\.\d+)$/u)?.[1];

  if (embeddedIpv4) {
    const bytes = embeddedIpv4.split(".").map(Number);
    const first = ((bytes[0] << 8) | bytes[1]).toString(16);
    const second = ((bytes[2] << 8) | bytes[3]).toString(16);
    address = `${address.slice(0, -embeddedIpv4.length)}${first}:${second}`;
  }

  const [left = "", right = ""] = address.split("::");
  const leftGroups = left ? left.split(":") : [];
  const rightGroups = right ? right.split(":") : [];
  const fill = address.includes("::")
    ? Array(8 - leftGroups.length - rightGroups.length).fill("0")
    : [];

  return [...leftGroups, ...fill, ...rightGroups].map((group) =>
    group.padStart(4, "0"),
  );
}

export function normalizeClientIp(headerValue: string | null): string | null {
  const candidate = headerValue?.split(",", 1)[0]?.trim();
  if (!candidate) return null;

  const mappedIpv4 = candidate.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/iu)?.[1];
  if (mappedIpv4 && isIP(mappedIpv4) === 4) return mappedIpv4;

  const version = isIP(candidate);
  if (version === 4) return candidate;
  if (version !== 6) return null;

  const groups = expandIpv6(candidate);
  return `${groups.slice(0, 4).join(":")}::/64`;
}

export async function getWaitlistCount(): Promise<number> {
  const { registrations } = await collections();
  return registrations.countDocuments({});
}

export async function checkWaitlistRequestLimit(
  normalizedIp: string,
): Promise<RequestLimitResult> {
  const { requestLimits } = await collections();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + RATE_LIMIT_WINDOW_MS);
  const ipHash = keyedHash("ip", normalizedIp);

  try {
    const current = await requestLimits.findOneAndUpdate(
      {
        _id: ipHash,
        $or: [
          { expiresAt: { $lte: now } },
          { requestCount: { $lt: REQUEST_LIMIT_PER_WINDOW } },
        ],
      },
      [
        {
          $set: {
            requestCount: {
              $cond: [
                { $lte: [{ $ifNull: ["$expiresAt", new Date(0)] }, now] },
                1,
                { $add: [{ $ifNull: ["$requestCount", 0] }, 1] },
              ],
            },
            windowStartedAt: {
              $cond: [
                { $lte: [{ $ifNull: ["$expiresAt", new Date(0)] }, now] },
                now,
                "$windowStartedAt",
              ],
            },
            expiresAt: {
              $cond: [
                { $lte: [{ $ifNull: ["$expiresAt", new Date(0)] }, now] },
                expiresAt,
                "$expiresAt",
              ],
            },
            updatedAt: now,
          },
        },
      ],
      { includeResultMetadata: false, returnDocument: "after", upsert: true },
    );

    if (current && current.requestCount <= REQUEST_LIMIT_PER_WINDOW) {
      return { allowed: true };
    }
  } catch (error) {
    // An upsert collision means another request filled the fixed window first.
    if (!hasMongoCode(error, 11000)) throw error;
  }

  const activeLimit = await requestLimits.findOne(
    { _id: ipHash },
    { projection: { expiresAt: 1 } },
  );
  const remaining = activeLimit
    ? activeLimit.expiresAt.getTime() - now.getTime()
    : 1_000;

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil(remaining / 1_000)),
  };
}

async function acquireIpSlot(
  ipLimits: Collection<IpLimitDocument>,
  ipHash: string,
  now: Date,
  requestId: string,
): Promise<RegistrationResult> {
  const nextAllowedAt = new Date(now.getTime() + RATE_LIMIT_WINDOW_MS);

  try {
    const acquired = await ipLimits.findOneAndUpdate(
      {
        _id: ipHash,
        $or: [
          { nextAllowedAt: { $lte: now } },
          { nextAllowedAt: { $exists: false } },
        ],
      },
      {
        $set: {
          requestId,
          nextAllowedAt,
          expiresAt: nextAllowedAt,
          updatedAt: now,
        },
      },
      { includeResultMetadata: false, returnDocument: "after", upsert: true },
    );

    if (acquired?.requestId === requestId) {
      return {
        status: "accepted",
        retryAfterSeconds: RATE_LIMIT_WINDOW_MS / 1_000,
      };
    }
  } catch (error) {
    // The unique _id collision is the atomic signal that an unexpired slot exists.
    if (!hasMongoCode(error, 11000)) throw error;
  }

  const activeLimit = await ipLimits.findOne(
    { _id: ipHash },
    { projection: { nextAllowedAt: 1 } },
  );
  const remaining = activeLimit
    ? activeLimit.nextAllowedAt.getTime() - now.getTime()
    : 1_000;

  return {
    status: "rate_limited",
    retryAfterSeconds: Math.max(1, Math.ceil(remaining / 1_000)),
  };
}

export async function registerWaitlist(
  email: string,
  normalizedIp: string,
): Promise<RegistrationResult> {
  const { registrations, readableRegistrations, ipLimits } =
    await collections();
  const now = new Date();
  const requestId = randomUUID();
  const ipHash = keyedHash("ip", normalizedIp);
  const slot = await acquireIpSlot(ipLimits, ipHash, now, requestId);

  if (slot.status === "rate_limited") return slot;

  const emailHash = keyedHash("email", email);
  const encryptedRegistration: WaitlistDocument = {
    emailHash,
    emailEncrypted: encryptEmail(email),
    registeredAt: now,
    schemaVersion: 1,
    source: "landing",
  };
  const readableRegistration: ReadableWaitlistDocument = {
    email,
    registeredAt: now,
    schemaVersion: 1,
    source: "landing",
    status: "registered",
  };
  let alreadyRegistered = false;

  try {
    try {
      const result = await registrations.updateOne(
        { emailHash },
        { $setOnInsert: encryptedRegistration },
        { upsert: true },
      );
      alreadyRegistered = result.upsertedCount === 0;
    } catch (error) {
      // A concurrent request may win the unique-email insert first.
      if (!hasMongoCode(error, 11000)) throw error;
      alreadyRegistered = true;
    }

    try {
      await readableRegistrations.updateOne(
        { email },
        { $setOnInsert: readableRegistration },
        { upsert: true },
      );
    } catch (error) {
      if (!hasMongoCode(error, 11000)) throw error;
    }
  } catch (error) {
    // A failed write is not a successful registration and must not spend an hour.
    await ipLimits.deleteOne({ _id: ipHash, requestId }).catch(() => undefined);
    throw error;
  }

  if (alreadyRegistered) {
    await ipLimits.deleteOne({ _id: ipHash, requestId });
    return { status: "already_registered" };
  }

  return {
    status: "accepted",
    retryAfterSeconds: RATE_LIMIT_WINDOW_MS / 1_000,
  };
}

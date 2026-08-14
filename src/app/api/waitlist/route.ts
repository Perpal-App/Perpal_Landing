import {
  getWaitlistCount,
  normalizeClientIp,
  parseWaitlistPayload,
  registerWaitlist,
} from "@/lib/waitlist.server";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4_096;
const JSON_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
} as const;

function json(body: object, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

function allowedOrigin(request: Request): boolean {
  const configured = process.env.WAITLIST_ALLOWED_ORIGIN?.trim();
  if (!configured) throw new Error("Missing WAITLIST_ALLOWED_ORIGIN");

  const expectedUrl = new URL(configured);
  if (
    process.env.NODE_ENV === "production" &&
    (expectedUrl.protocol !== "https:" ||
      ["localhost", "127.0.0.1", "[::1]"].includes(expectedUrl.hostname))
  ) {
    throw new Error("WAITLIST_ALLOWED_ORIGIN must be a public HTTPS origin");
  }

  const expected = expectedUrl.origin;
  const supplied = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  return (
    supplied === expected &&
    (fetchSite === null || fetchSite === "same-origin")
  );
}

function clientIp(request: Request): string | null {
  const headerName = process.env.WAITLIST_IP_HEADER?.trim().toLowerCase();
  if (!headerName || !/^[a-z0-9-]+$/u.test(headerName)) {
    throw new Error("Missing or invalid WAITLIST_IP_HEADER");
  }

  return normalizeClientIp(request.headers.get(headerName));
}

export async function GET(): Promise<Response> {
  try {
    const count = await getWaitlistCount();
    return json({ ok: true, count }, 200, {
      "Cache-Control": "public, max-age=30, stale-while-revalidate=300",
    });
  } catch (error) {
    console.error("[waitlist] count unavailable", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return json({ ok: false }, 200);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    if (!allowedOrigin(request)) return json({ ok: false }, 403);

    const contentType = request.headers.get("content-type")?.split(";", 1)[0];
    if (contentType !== "application/json") {
      return json({ ok: false, error: "invalid_request" }, 415);
    }

    const declaredLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return json({ ok: false, error: "invalid_request" }, 413);
    }

    const normalizedIp = clientIp(request);
    if (!normalizedIp) return json({ ok: false }, 403);

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ ok: false, error: "invalid_request" }, 413);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return json({ ok: false, error: "invalid_request" }, 400);
    }

    const email = parseWaitlistPayload(payload);
    if (!email) {
      console.warn("[waitlist] registration rejected", {
        reason: "invalid_email",
      });
      return json({ ok: false, error: "invalid_email" }, 200);
    }

    const result = await registerWaitlist(email, normalizedIp);
    if (result.status === "rate_limited") {
      console.warn("[waitlist] registration rate-limited", {
        retryAfterSeconds: result.retryAfterSeconds,
      });
      return json(
        {
          ok: false,
          error: "rate_limited",
          retryAfterSeconds: result.retryAfterSeconds,
        },
        200,
        { "Retry-After": String(result.retryAfterSeconds) },
      );
    }

    console.info("[waitlist] registration accepted", {
      outcome: result.status,
      cooldownSeconds: result.retryAfterSeconds,
    });
    return json(
      {
        ok: true,
        status: "registered",
        retryAfterSeconds: result.retryAfterSeconds,
      },
      200,
    );
  } catch (error) {
    // Log only the error class: messages can contain database or network details.
    console.error("[waitlist] registration unavailable", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return json({ ok: false, error: "unavailable" }, 200);
  }
}

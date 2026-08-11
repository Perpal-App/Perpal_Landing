import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Perpal — Private Perps. Learn, then trade.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const markData = readFileSync(
  join(process.cwd(), "public", "brand", "perpal-mark-black.png"),
).toString("base64");

/* Satori cannot read the fingerprinted WOFF2 that next/font emits, so the card
   is fed the original binaries straight off disk. Lexend is absent on purpose:
   it ships as a variable font, which satori fails to parse, so the supporting
   line borrows Poppins rather than falling back to a system face. */
const font = (file: string) =>
  readFileSync(join(process.cwd(), "public", "fonts", file));

const fonts = [
  { name: "Poppins", data: font("poppins/Poppins-Regular.ttf"), weight: 400 },
  { name: "Poppins", data: font("poppins/Poppins-Medium.ttf"), weight: 500 },
  { name: "Durer", data: font("Durer-Font/Durer.ttf"), weight: 400 },
] as const;

/**
 * Share card.
 *
 * Set in the site's own faces: Dürer for the headline, Poppins for the wordmark,
 * supporting line and meta.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#FFFFFF",
          position: "relative",
        }}
      >
        {/* The sky, matching the page's field. Satori has no blur, so this is
            the construction reduced to what it can render: two wide radials at
            low alpha over white. */}
        <div
          style={{
            position: "absolute",
            left: "-10%",
            top: "-40%",
            width: "120%",
            height: "120%",
            background:
              "radial-gradient(closest-side, #A9D6F6 0%, rgba(169,214,246,0.55) 45%, rgba(169,214,246,0) 78%)",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-15%",
            bottom: "-60%",
            width: "130%",
            height: "110%",
            background:
              "radial-gradient(closest-side, rgba(139,121,212,0.45) 0%, rgba(196,184,242,0.38) 34%, rgba(169,214,246,0.28) 60%, rgba(255,255,255,0) 82%)",
            opacity: 0.85,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={`data:image/png;base64,${markData}`}
            alt=""
            width={52}
            height={52}
          />
          <div
            style={{
              fontFamily: "Poppins",
              fontSize: 30,
              color: "#0F1720",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Perpal
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Durer",
              fontSize: 108,
              lineHeight: 1,
              letterSpacing: -2.5,
              color: "#0F1720",
            }}
          >
            Private Perps. Learn, then trade.
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#4C5A68",
              maxWidth: 820,
            }}
          >
            Bite-sized perps lessons are planned. Umbra can obscure wallet
            links—not trades.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Poppins",
            gap: 16,
            fontSize: 22,
            color: "#6F8090",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>Solana mainnet</span>
          <span>·</span>
          <span>Android prototype</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.map((f) => ({ ...f, data: Buffer.from(f.data) })),
    },
  );
}

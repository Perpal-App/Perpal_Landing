import type { NextConfig } from "next";

const production = process.env.NODE_ENV === "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${production ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${production ? "" : " ws:"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(production ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  },
  ...(production
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    /* 75 is the default and carries every image on the page. 90 exists for one:
       the markets screenshot in the closing panel, which is a near-black UI with
       1px hairlines, small type and coloured badges — the content a lossy encoder
       spends its error budget on first. At 75 the price column goes soft and the
       dark rows flatten into each other, which reads as a washed-out screenshot
       rather than as compression.

       The list is an allowlist rather than a suggestion: since Next 16 a `quality`
       prop outside it is silently coerced to the nearest entry, so a value asked
       for in a component and not named here does nothing at all. */
    qualities: [75, 90],
  },
};

export default nextConfig;

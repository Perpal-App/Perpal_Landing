import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

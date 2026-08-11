import localFont from "next/font/local";

/**
 * The site's entire type system. Three families, no exceptions.
 *
 * Every face is self-hosted through `next/font/local`, which fingerprints the
 * files, emits the `@font-face` rules, preloads them, and generates a
 * metric-matched fallback so nothing shifts while they load. Each loader
 * exposes a CSS variable rather than a class, and `globals.css` maps those
 * variables onto the `--font-*` theme tokens the components actually use
 * (`font-logo`, `font-display`, `font-hand`, `font-ui`, `font-sans`).
 *
 * Sources are WOFF2 converted from the originals in `public/fonts`, which cuts
 * the type payload from roughly 456KB to 213KB.
 *
 *   Dürer    — the wordmark, display type, and the handwritten asides.
 *   Poppins  — UI meta, labels, numeric readouts.
 *   Lexend   — body copy, subtext, and anything else that is read.
 */

/** UI meta and labels. Every file here is preloaded, so unused weights are
    dead bytes on first paint rather than a convenience. 600 exists for the
    button label, which is the one place the interface raises its voice. */
export const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "../fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-600.woff2", weight: "600", style: "normal" },
  ],
});

/** Wordmark, display, handwritten voice. One weight, so nothing asks for bold. */
export const durer = localFont({
  variable: "--font-durer",
  display: "swap",
  src: "../fonts/durer.woff2",
  weight: "400",
  style: "normal",
});

/** Everything that is read. One variable file covers the whole weight axis. */
export const lexend = localFont({
  variable: "--font-lexend",
  display: "swap",
  src: "../fonts/lexend-variable.woff2",
  weight: "100 900",
  style: "normal",
});

/** Every family's variable class, for the root element. */
export const fontVariables = [poppins.variable, durer.variable, lexend.variable]
  .join(" ")
  .trim();

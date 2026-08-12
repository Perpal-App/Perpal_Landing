import { cn } from "@/lib/cn";

/**
 * The Perpal monogram.
 *
 * The source asset is a white glyph on transparency, so it is applied as a
 * CSS mask rather than an <img>. The mark then takes its colour from
 * `currentColor`, which lets it tint on hover, invert on dark surfaces,
 * and avoids a separate image decode before first paint.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block bg-current", className)}
      style={{
        WebkitMaskImage: "url(/brand/perpal-mark.png)",
        maskImage: "url(/brand/perpal-mark.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    />
  );
}

/**
 * "Perpal" set in the brand face, Dürer, at a semibold weight.
 *
 * Dürer ships one light weight and the document turns off
 * `font-synthesis-weight`, so a `font-semibold` utility here would render
 * nothing. The weight comes from a hairline stroke on the glyph outlines
 * instead. Two reasons to prefer that over re-enabling synthesis: it thickens
 * the stems evenly rather than smearing them the way an engine's synthetic bold
 * does, and it renders identically in every browser, which is the bar for a
 * wordmark.
 *
 * The width is in `em` so it holds at any size. Dürer's stems are around
 * 0.06em; a centred stroke adds its full width to the stem, so 0.02em lands
 * near the 1.35x a semibold cut would be. Advance widths are untouched, so
 * nothing reflows.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn("font-logo select-none", className)}
      /* `lineHeight` is here rather than in a `leading-none` class because
         tailwind-merge treats any `text-{size}` as conflicting with `leading-*`
         — v4 size utilities set both — so the caller's size class would strip
         it and quietly restore a 1.33 line box. */
      style={{ lineHeight: 1, WebkitTextStroke: "0.02em currentColor" }}
    >
      Perpal
    </span>
  );
}

export function Logo({
  className,
  markClassName,
  wordClassName,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  /* Sizes come from measuring the two halves rather than matching numbers.
     The mark's glyph fills 52.2% of its PNG box vertically, and Dürer's cap
     height is 0.666em, so a 32px mark box (16.7px of glyph) sits level with
     24px text (16.0px of cap) — the 1:1 glyph-to-cap lockup.

     No gap either: the same PNG carries 16.8% of transparent margin on its
     right edge, which is the optical space the lockup needs. A gap utility here
     would stack on top of that one.

     The mark is nudged up because `leading-none` centres the line box, not the
     cap band: Dürer's ascender and descender total 1.134em, so its caps sit
     ~1.9px above the centre of a 24px line. Without this the mark reads low. */
  return (
    <span className={cn("flex items-center", className)}>
      {/* No accessible name of its own. `Wordmark` renders the real string "Perpal",
          which is the name, and the lockup carries no affordance beyond it — so
          anything about what it *does* belongs to whatever wraps it. The nav wraps it
          in a link to the top of the page and labels that link "Perpal home"; the
          footer does not wrap it at all, and used to inherit a screen-reader
          announcement of "Perpal, Perpal home" on a signature that goes nowhere. */}
      <Mark className={cn("size-8 -translate-y-[6%]", markClassName)} />
      <Wordmark className={cn("text-2xl", wordClassName)} />
    </span>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A soft raised pill, built for the lesson subjects in `Product`.
 *
 * It renders an `li` because that is what it is — one item in a list of terms —
 * and it lives here rather than inline in the section so the treatment is defined
 * once and the section stays a description of its content.
 *
 * Not white. A flat white chip on the `sky` panel reads as a hole punched in the
 * fill, and the palette has nothing light and complementary to swap in: every tone
 * in it is cool, so no light fill can out-contrast white against a blue ground.
 * The definition has to come from the form instead.
 *
 * So the fill is `grape-ink`, the palest step of the brand's violet ramp, with a
 * whisper of a gradient from `paper` at the top. Violet against blue is a hue
 * shift rather than a value shift, which is what keeps it quiet, and being lighter
 * than the panel is what makes it sit above rather than sink into it — the same
 * relationship the reference has between its chip and its ground.
 *
 * `shadow-bulge` does the rest, and it is reused rather than reinvented: it is
 * already a lit top edge, a violet-tinted inset shade along the bottom, and a soft
 * cast below. That is exactly the extruded rim in the reference, and its inset
 * colour is grape, so it belongs on a violet chip.
 *
 * Nothing here is dark. The rim is a tint of the fill's own family and the only
 * near-black is the label, which needs to be: `ink` on `grape-ink` measures 15.6:1.
 *
 * The label is centred, which matters more than it sounds: once `PillCloud` lets a
 * pill grow to fill its half of the row, the space a short term does not need has to
 * fall either side of the word instead of piling up to its right.
 *
 * Two size steps, then a third. The last one is a container step rather than a
 * breakpoint, matched to the width at which the terms pair up, so a pill only gets
 * taller and its label larger once it has a full half-row to hold. Horizontal
 * padding stops at that point: past it the pill's width comes from `flex-grow`, so
 * `px` no longer decides how much room sits beside the label.
 */
export function Pill({
  children,
  className,
  style,
}: {
  children: ReactNode;
  /** Arrangement — row inset, growth — set by `PillCloud`. */
  className?: string;
  /** The row inset custom properties, set by `PillCloud`. */
  style?: CSSProperties;
}) {
  return (
    <li
      style={style}
      className={cn(
        "rounded-full bg-linear-to-b from-paper to-grape-ink px-6 py-4 text-center text-base font-medium text-ink shadow-bulge sm:px-8 sm:py-5 sm:text-lg @3xl:py-6 @3xl:text-xl",
        className,
      )}
    >
      {children}
    </li>
  );
}

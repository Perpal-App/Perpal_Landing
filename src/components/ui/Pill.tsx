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
 * Type and padding are one utility, `pill-size`, and one continuous ramp rather than
 * a ladder of steps. The arithmetic and the reasons live on it in globals.css; what
 * matters here is why the size is not written as classes at all.
 *
 * It is measured in `cqi`, against the list this pill wraps in, because the list is
 * what decides how much room the label has. `PillCloud` makes the same argument at
 * length: this panel is 62% of a row at `lg` and the whole of it once the grid
 * stacks, so it is wider at a 1000px window than at 1280px, and a `sm:` step was
 * answering a question about the viewport that nobody had asked. A pill is a little
 * over a third of the list at every width, so a share of the list is a share of the
 * pill.
 *
 * Stepping it also showed at the seams. Five breakpoints across a range this wide
 * means five places where a pill jumps a size and its label reflows, and the label
 * reflowing is the visible part — a term that sat on one line at 511px of list took
 * two at 512px.
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
        "pill-size rounded-full bg-linear-to-b from-paper to-grape-ink text-center font-medium text-ink shadow-bulge",
        className,
      )}
    >
      {children}
    </li>
  );
}

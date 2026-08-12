import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A platform badge: the platform's mark, then a small line of state over the
 * platform's name.
 *
 * Cut out of the panel rather than dropped on it. There is no fill at rest, so the
 * ember ramp runs straight through the badge and the ink hairline is the whole
 * object — which is the reason this is not a `Button`. `Button` fills, and the
 * filled object in this panel is the waitlist action. Two filled objects in one
 * corner and the panel would have no primary action at all.
 *
 * The pair is symmetric — one size, one hairline, one sentence, differing only in
 * the mark and the platform word — because the state they report is the same
 * state. There is nothing to download on either platform yet, so neither badge is
 * a link and neither pretends to be: no `href`, no press, no pointer cursor, no
 * focus stop. The words carry it, and the action underneath them is the thing that
 * goes somewhere.
 *
 * They do still answer the pointer, which is worth being straight about since they
 * are not interactive: hovering an inert badge is feedback that it is an object,
 * not a promise of navigation. The cut-out fills with light rather than inverting
 * to ink — a white wash over the panel, which is the same operation the panel's own
 * gradient performs as it thins ember toward the right, so a hovered badge reads as
 * more light landing on the one surface instead of a black object appearing on it.
 * This page is daylight the whole way down: `ink` is type, hairlines and the focus
 * ring here, never a field. And because the wash carries no hue, the badge never
 * picks up a second colour.
 *
 * Label and mark stay `ink` throughout — 6.6:1 on ember at rest, about 10:1 on the
 * wash, so the state can only improve the number. No travel either, because the
 * badge is part of the panel rather than an object floating above it.
 *
 * `min-h-14` clears the 44px touch floor with room, and it is a minimum so the two
 * lines can never be clipped if the label scales. Width belongs to the call site:
 * on its own the badge is shrink-to-fit, and as a grid item it stretches to its
 * track, which is how the pair in `Access` ends up one size. `justify-center` is
 * what makes that stretch read as intentional rather than as a ragged gap after
 * the shorter platform word.
 *
 * When a store listing exists, this component takes an `href` and becomes an
 * anchor. The hover state it would want is already here.
 */
export function StoreBadge({
  mark,
  verb,
  platform,
  className,
}: {
  /** The platform's own mark, sized by the call site. */
  mark: ReactNode;
  /** The small first line: the half-sentence `platform` finishes. */
  verb: string;
  /** The large second line. */
  platform: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border px-5 py-3 text-ink",
        "border-ink/70 transition-colors duration-200 ease-swift hover:border-ink hover:bg-paper/40",
        className,
      )}
    >
      {mark}
      <span className="flex flex-col items-start">
        {/* Sentence case, not the `label` utility. An uppercase letterspaced
            eyebrow is for naming a field or a state; this is the first half of a
            sentence the next line finishes. */}
        <span className="font-ui text-xs leading-none font-medium tracking-[-0.005em]">
          {verb}
        </span>
        <span className="mt-1.5 font-ui text-lg leading-none font-semibold tracking-[-0.02em]">
          {platform}
        </span>
      </span>
    </span>
  );
}

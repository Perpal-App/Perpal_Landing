/**
 * The four cords out of the device, and the cards on the end of them.
 *
 * Why it is a fan rather than a bracket, why the cords are curves and why they are
 * `lilac-deep` are all recorded in `HowItWorks`, which owns the argument. This file owns the
 * arithmetic, and there is one thing to know about it: the drawing and the list have to agree
 * on four numbers, so each one is written here and again in a Tailwind class.
 *
 *   ROW     the card's height          `--fan-row`
 *   PITCH   the gap between cards      `--fan-pitch`
 *   REACH   the cord's gutter          `--fan-reach`
 *   BRIDGE  the device's column gap    `--fan-bridge`, which the cords cross to reach
 *                                      the phone, and which `HowItWorks` sets as its
 *                                      own `gap-x`
 *
 * They are custom properties rather than fixed classes because the diagram now runs
 * at every width rather than only from `lg`, so each has three values:
 *
 *          row       pitch         reach      bridge
 *   base   1.75rem   1.96875rem    4rem       0.5rem
 *   sm     2rem      2.25rem       4rem       1rem
 *   lg     4rem      4.5rem        4.5rem     1.5rem
 *
 * Reach and bridge together are the cord's whole horizontal run. Below `lg`, 4rem of
 * reach moves the nodes inward so the outgoing cords stay proportional without being
 * cut; desktop adds the final half-rem. The curve still has room to leave the device
 * horizontally and arrive horizontally, which is the shape it is drawn as.
 *
 * The run is bought from the label, one pixel for one pixel, since both come out of
 * the same column — `--fan-inset` below is the reach plus everything else between the
 * column and the label, and `fan-label` divides what is left. That is the trade to
 * make consciously if either ever moves again.
 *
 * A fifth number joins them, `--fan-inset`, which is not the drawing's — it is the
 * width between the node column and the label inside it, and `fan-label` divides by
 * it to find a size that keeps the longest step on one line. It is here because it is
 * the sum of three things this file sets: the reach above, the card's padding and the
 * step number with its gap.
 *
 * The one invariant, and the only thing that can silently break this: `row / pitch`
 * must stay at 8/9 in every column of that table. `preserveAspectRatio="none"` means
 * the viewBox is stretched rather than fitted, so a cord does not arrive at a pixel —
 * it arrives at a *fraction* of the list's height, fixed by ROW and PITCH at the top
 * of this file. A card whose height and gap drift from that ratio is met off its own
 * middle, and the outer two cords show it first. The odd-looking pitches are what
 * that ratio produces — 2.53125rem is the exact ninth-eighths of 2.25rem — and they
 * are worth keeping ugly rather than rounding to something tidy that misses.
 *
 * The nodes are deliberately small below `lg` and the device column deliberately
 * large, and the two are the same decision: they divide one row, so every millimetre
 * the device gains is a millimetre the labels lose. The device's share only rises at
 * `sm` because at 320px the longest label already needs two lines inside 87px, and
 * taking more from it would need a third.
 *
 * What gives on a narrow plate is the label, not the geometry: it wraps to two lines
 * inside a fixed row height. A content-height card is the one thing the drawing
 * cannot survive.
 *
 * The viewBox is written in those pixel units and stretched rather than fitted
 * (`preserveAspectRatio="none"` with a non-scaling stroke), so a card whose height changed
 * would still be met at its own middle as long as ROW and PITCH keep their ratio.
 *
 * No hooks and no interaction: this was briefly a client island where a card could be pulled
 * and let go on a spring, and that is removed. What is left is a drawing, so it renders on
 * the server. The one moving part is the light running down each cord, which is a CSS
 * animation on a dash — `linear`, because continuous motion that eases reads as breathing
 * rather than as travel, and it fades out at both ends of its cycle so the reduced-motion
 * collapse leaves nothing sitting on the wire.
 */

const ROW = 64;
const PITCH = 72;
const REACH = 72;
const BRIDGE = 24;
const WIDTH = REACH + BRIDGE;

/** How far apart the cords leave the device: a ribbon, not a single point. */
const SPREAD = 10;

/* Both handles at half the run, so every cord leaves the device horizontally and arrives
   horizontally — the shape a patch cord takes in a node editor, which is the one place this
   language is native rather than borrowed. */
function cord(fromY: number, toY: number) {
  const bend = WIDTH / 2;
  return `M0 ${fromY}C${bend} ${fromY} ${WIDTH - bend} ${toY} ${WIDTH} ${toY}`;
}

function layout(count: number) {
  const height = count * ROW + (count - 1) * PITCH;
  const middle = height / 2;
  const offset = ((count - 1) / 2) * SPREAD;

  return {
    height,
    /* The port: a short capsule on the device's edge, because a cord has to come from
       somewhere. The four leave from four heights inside it, so they read as a ribbon
       separating rather than as one line splitting. */
    port: `M0 ${middle - offset}V${middle + offset}`,
    cords: Array.from({ length: count }, (_, index) =>
      cord(middle - offset + index * SPREAD, index * (ROW + PITCH) + ROW / 2),
    ),
  };
}

export function TradeFan({ steps }: { steps: readonly string[] }) {
  const fan = layout(steps.length);

  return (
    /* Nothing in the fan is selectable: there is nothing here worth copying that is not also
       in the paragraph above the diagram. */
    <ol className="@container relative flex flex-col select-none gap-[var(--fan-pitch)] pl-[var(--fan-reach)] [--fan-bridge:0.5rem] [--fan-inset:90px] [--fan-pitch:1.96875rem] [--fan-reach:4rem] [--fan-row:1.75rem] sm:[--fan-bridge:1rem] sm:[--fan-inset:86px] sm:[--fan-pitch:2.25rem] sm:[--fan-reach:4rem] sm:[--fan-row:2rem] lg:[--fan-bridge:1.5rem] lg:[--fan-inset:100px] lg:[--fan-pitch:4.5rem] lg:[--fan-reach:4.5rem] lg:[--fan-row:4rem]">
      {/* The box is set from the same three variables the list is, so one drawing
          serves every width. `preserveAspectRatio="none"` is what makes that work:
          the viewBox is written in the desktop pixel units above and then stretched
          to whatever box this ends up with, so the cords do not need to be redrawn
          for a narrower plate — they simply arrive at the same fractions of a
          shorter, narrower box. */}
      <svg
        aria-hidden
        viewBox={`0 0 ${WIDTH} ${fan.height}`}
        preserveAspectRatio="none"
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        /* Six pixels wider than the gutter it spans, so every cord finishes just
           inside the card rather than exactly on its edge. Stopping on the edge is
           what left the join looking open: the card's corner radius pulls the painted
           edge inward at the very height the cord arrives at, so a cord that ends at
           the box's edge ends short of the ink. Running it under the card removes the
           question, and the cards paint over it — see the `relative` on them. */
        className="pointer-events-none absolute inset-y-0 left-[calc(-1*var(--fan-bridge))] h-full w-[calc(var(--fan-reach)_+_var(--fan-bridge)_+_6px)] overflow-visible"
      >
        <path d={fan.port} stroke="var(--color-lilac-deep)" />

        {fan.cords.map((path) => (
          <path key={path} d={path} stroke="var(--color-lilac-deep)" />
        ))}

        {/* The light on the wire, one lighter dash per cord, staggered. Normalised against
            `pathLength: 1`, so four cords of four different lengths travel at one speed. */}
        {fan.cords.map((path, index) => (
          <path
            key={path}
            d={path}
            stroke="var(--color-lilac)"
            strokeDasharray="0.16 0.84"
            pathLength={1}
            style={{ animationDelay: `${index * 0.55}s` }}
            className="animate-[cable-beam_2600ms_linear_infinite]"
          />
        ))}
      </svg>

      {steps.map((step, index) => (
        <li key={step} className="flex items-center">
          {/* `paper`, because the plate is tinted: a card has to be a step away from its
              ground, and `surface` on `tide` is two pale fields 1.16:1 apart.

              `w-fit` from `sm` up, so a node is the size of its own name. Stretched to the
              column it held 300px of label in 760px of card, which is a row and not a
              node — but that argument is about a wide plate, and it inverts on a narrow
              one. See the note on the width below. */}
          {/* `min-h` and `max-w-full` below `lg`, an exact `h-16` at it.
     
              The fixed height and the nowrapped label are requirements of the
              drawing, not of the node: the cords are aimed at `ROW / 2`, so a card
              whose height moved would be met off-centre. But the cords only exist
              from `lg`, and below it those two rules had nothing to protect and a
              cost to pay — "Review & confirm the order" is a 276px card against the
              244px this plate has at a 320px viewport, so the node ran past the edge
              and `overflow-hidden` cut it off without a scrollbar to say so.
     
              So the constraint is scoped to where the cords are. Below `lg` the card
              caps at the column and the label wraps inside it; at `lg` it is exactly
              64px again and the geometry holds.
     
              The height is fixed at every width now, not just at `lg`, because the
              cords exist at every width and they are aimed at `--fan-row / 2`. What
              gives instead is the label, which wraps to two lines inside that height
              on a narrow plate. A content-height card would have been the one thing
              the drawing cannot survive. */}
          <div className="relative flex h-[var(--fan-row)] w-fit shrink-0 items-center gap-1 rounded-2xl bg-paper px-1.5 sm:gap-1.5 sm:px-2.5 lg:gap-3 lg:px-5">
            {/* Hidden from assistive technology: the `<ol>` already counts. Boxed to a fixed
                width so a `1` and a `4` start their labels at the same place. */}
            <span
              aria-hidden
              className="w-2.5 shrink-0 font-ui text-[0.5rem] font-semibold text-muted sm:w-3 sm:text-[0.625rem] lg:w-4 lg:text-base"
            >
              {index + 1}
            </span>
            {/* One line at every width, and the size solved backwards from that rule
                rather than stepped by breakpoint — see `fan-label` in globals.css,
                which also carries the warning about what breaks if a step is renamed.
                There is no `text-balance` any more: nothing wraps, so there are never
                two lines to balance. */}
            <span className="fan-label font-ui font-medium text-ink">{step}</span>
          </div>

          {/* This flexes to the plate edge at every width. The left overlap hides its
              rounded cap under the card; the right margin gives the plate padding back. */}
          <span
            aria-hidden
            className="-ml-1 -mr-7 h-[3px] flex-1 rounded-full bg-lilac-deep sm:-mr-9"
          />
        </li>
      ))}
    </ol>
  );
}

/**
 * The four cords out of the device, and the cards on the end of them.
 *
 * Why it is a fan rather than a bracket, why the cords are curves and why they are
 * `lilac-deep` are all recorded in `HowItWorks`, which owns the argument. This file owns the
 * arithmetic, and there is one thing to know about it: the drawing and the list have to agree
 * on four numbers, so each one is written here and again in a Tailwind class.
 *
 *   ROW     the card's height          `sm:h-16`
 *   PITCH   the gap between cards      `lg:gap-[4.5rem]`
 *   REACH   the cord's gutter          `lg:pl-18`
 *   BRIDGE  the plate's column gap     `lg:gap-x-6`, which the cords cross to reach
 *                                      the phone
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
    <ol className="relative mt-10 flex flex-col gap-3 select-none lg:mt-0 lg:gap-[4.5rem] lg:pl-18">
      <svg
        aria-hidden
        viewBox={`0 0 ${WIDTH} ${fan.height}`}
        preserveAspectRatio="none"
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ left: -BRIDGE, width: WIDTH }}
        className="pointer-events-none absolute inset-y-0 hidden overflow-visible lg:block"
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

              `w-fit`, so a node is the size of its own name. Stretched to the column it held
              300px of label in 760px of card, which is a row and not a node. The height is
              fixed and the label cannot wrap, because the cords are drawn against this row
              height. */}
          <div className="flex h-14 w-fit shrink-0 items-center gap-3 rounded-2xl bg-paper px-4 sm:h-16 sm:px-5">
            {/* Hidden from assistive technology: the `<ol>` already counts. Boxed to a fixed
                width so a `1` and a `4` start their labels at the same place. */}
            <span
              aria-hidden
              className="w-4 font-ui text-sm font-semibold text-muted sm:text-base"
            >
              {index + 1}
            </span>
            <span className="font-ui text-base leading-none font-medium whitespace-nowrap text-ink sm:text-lg lg:text-xl">
              {step}
            </span>
          </div>

          {/* The cord carrying on out of the card, to the plate's own edge and no further. A
              flex child, so its length is whatever the plate has left after the card and no
              width is written down — which is also why each one ends flush while starting at
              a different place. The negative margin is the plate's padding, given back so the
              cord reaches the edge that is painted rather than the one that is measured. */}
          <span
            aria-hidden
            className="hidden h-[3px] flex-1 rounded-full bg-lilac-deep lg:-mr-9 lg:block"
          />
        </li>
      ))}
    </ol>
  );
}

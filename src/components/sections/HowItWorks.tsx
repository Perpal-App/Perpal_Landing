import Image from "next/image";
import { how } from "@/lib/content";
import { Lift } from "@/components/motion/Lift";
import { LessonPanel } from "@/components/sections/LessonPanel";
import { TradeFan } from "@/components/sections/TradeFan";

/**
 * How it works: the mechanics, after the argument and before the reassurance.
 *
 * The order is the reader's. `Product` says what the app is and `About` says why it
 * exists; the question that follows both is what actually happens when you use it, and
 * it has to be answered before either the reassurance or the FAQ.
 *
 * Two plates, because there are two answers rather than two halves of one. The left plate
 * is a sequence — four things that happen in one order — and the right is a lesson, which
 * is not a sequence but a thing to do. A split inside a single plate would say they were
 * parts of a whole.
 *
 * `tide` and `haze` tell them apart by field rather than by a heading you have to read
 * first, and the left one is `tide` for the reason that token was added: this section
 * used to own it, then lost it when the wrapper it was painted on went away, and the
 * plate spent a while as `paper` — which on a `paper` matte is not a plate at all. Its
 * edges were the only thing distinguishing it, and it has no edges. Every other pale
 * field on this page is a step of the same blue, so a fourth one could only differ from
 * its neighbours by being slightly lighter or darker than them, which reads as a
 * printing error. `tide` is the hue shift, held at low chroma so it never starts looking
 * like a status colour next to `long`. It stays a field here and nothing else.
 *
 * The plates are not equal — 6fr against 5fr, because the left one has a device standing
 * in it and the lesson panel is a heading, a line and a chart.
 *
 * That ratio is tight, and the number worth knowing before touching this: the left plate
 * needs 694px of content width for the device, the cables' run and a card as wide as
 * "Withdraw through Umbra", and 6fr of an `xl` viewport is 606px. The composition only
 * clears its own width from about 1440px up; between `xl` and there, the widest card
 * runs into the plate's padding and the clip takes the difference. It was briefly 2fr/1fr
 * to buy that room and is back on instruction, because the market panel needs the width
 * more than the fourth card needs the last few pixels.
 *
 * They sit side by side from `xl` and stack below it, which is a recomposition rather
 * than a shrink — the device keeps its cables, and the chart gets wider than it ever is
 * at desktop.
 *
 * ---
 *
 * The signature is the device with the workflow wired out of it.
 *
 * The phone leads, on the left, at the size of a subject rather than a garnish, and four
 * cords leave a port on its edge — one to each of the things you do with it, each running
 * on through its own card and out to the edge of the plate.
 *
 * This is a fan, and an earlier version of this panel argued at length for a chain — each
 * step connecting to the next, because steps happen in one order. That argument was right
 * about the steps and wrong about what the drawing is for. A chain draws the sequence and
 * leaves the device as an illustration beside it; a fan draws the sentence that actually
 * matters here, which is that all four of these happen on this one phone, in your hand,
 * with the keys on it. The order has not gone anywhere — it is a real `<ol>`, the labels
 * read in the order they happen, and each carries its ordinal.
 *
 * It is also not a bracket. A trunk with square elbows is what every diagram tool draws
 * by default and it had two problems here: at a hairline it disappeared into the field,
 * and at three pixels it read as plumbing. These are cubic curves instead, leaving the
 * device horizontally and arriving horizontally — the shape a patch cord takes in a node
 * editor, which is the one place this language is native rather than borrowed. The four
 * leave from four heights inside a 30px port, so they read as a ribbon separating rather
 * than as one line splitting, and the port itself is drawn: a short capsule on the
 * device's edge, because a cord has to come from somewhere.
 *
 * The cords and their cards live in `TradeFan`. The argument for the drawing is here; the
 * four numbers the drawing and the list have to agree on are there, with no hooks and no
 * interaction — the one moving part is the light travelling down each cord.
 *
 * `lilac-deep` at three pixels, and both halves of that are a change of mind. The line
 * was `ink/25` at one pixel, which was the right answer while it was structure — a
 * hairline in the ink family, deferring to the type. As a cable it is not structure, it
 * is the drawing, so it takes the field's own purple: the violet in the page's weather,
 * one step off the hero's gradient, and deliberately not `grape`, which is the action
 * colour and belongs to buttons. On `tide` it measures 2.85:1, under the 3:1 a meaningful
 * graphic would need — carried here because the ordinals and the labels state everything
 * the cables restate, so nothing is only in the line.
 *
 * On the far side of each card the cord carries on to the plate's edge. A cord that
 * stopped dead at a card would say the card is a terminus, and these four are points on a
 * loop you run again. They all end flush and each starts at its own card's edge, so the
 * four lengths differ — which is what keeps four parallel lines from reading as a ruled
 * table.
 *
 * The phone shows whole, on instruction, at the width it already had. It was cropped at
 * 77% of its height against the plate's bottom edge for a while, which bought a shorter
 * panel and cost the two order buttons at the foot of the screen. Uncropped it is 570px
 * tall against 260px of labels, so the wire leaves the middle of a device that is more
 * than twice the height of what it feeds — which is the proportion the reference layout
 * has, and the reason the device reads as the subject rather than as one column of two.
 *
 * The block takes the whole plate rather than the 46rem it used to cap at. That cap kept
 * a sane measure while the nodes held paragraphs; a one-line label has no measure to
 * protect, so the cap was only leaving a third of the panel empty at any width where the
 * section has not yet split into two columns.
 *
 * Below `lg` the phone moves above the cards and the cables go with it. The threshold is
 * measured, not chosen: the composition needs 694px of plate and a `md` viewport gives it
 * 688. The cards also step down a size on the way, because a 20px label with no wrap is
 * 326px of card and a 375px plate has 299.
 *
 * ---
 *
 * Motion is the arrival `Lift` the panels around it use, at two depths — the copy
 * travels 20px and the artefacts 12, so the thread and the chart settle just after the
 * plates they sit on. Both plates take the same depths because they are peers. The lesson
 * panel's chart drawing itself belongs to the same arrival and is described in that file.
 */

/* The footer's dot field, brought up onto this plate: the same 10px pitch and the same
   white specks, so the two surfaces are wearing one texture rather than two.

   What changes is which edge it gathers on. In the footer it is dense along the bottom
   and gone two thirds up, because that is the foot of the page and the dots are also
   there to break the banding in the deepest part of the gradient. Here the plate is flat
   `tide` with nothing to band, and the space that needs filling is the right — the strip
   the cords run out into once the cards have had their width. So it fades leftward
   instead, and is gone before it reaches the diagram.

   White at 0.7 rather than the footer's 0.55: on a dark purple ramp a white speck at half
   strength is plenty, and on a pale teal it is nothing at all. */
const DOTS =
  "radial-gradient(circle, rgba(255,255,255,0.7) 1px, rgba(255,255,255,0) 1px)";

/* Dense on the right edge, gone by 45% in — which is about where the cards begin at the
   widths this plate is two columns at. */
const DOT_MASK =
  "linear-gradient(to left, #000 0%, rgba(0,0,0,0.5) 16%, rgba(0,0,0,0) 45%)";

export function HowItWorks() {
  const { trade, lesson } = how;

  return (
    <section
      id="how"
      data-parallax
      className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3"
      /* Clears the fixed nav when an anchor jump lands here. */
      style={{ scrollMarginTop: "6rem" }}
    >
      <Lift className="grid gap-2.5 sm:gap-3 xl:grid-cols-[6fr_5fr]">
        {/* The device and its wiring. Nothing bleeds off this plate any more, so the clip
            is only insurance for the corner radius. */}
        <div className="relative isolate overflow-hidden rounded-2xl bg-tide px-7 py-9 sm:px-9 sm:py-11">
          {/* Behind everything: `isolate` on the plate keeps the negative layer from
              sliding under the page, and a negative index still paints over the plate's
              own fill. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage: DOTS,
              backgroundSize: "10px 10px",
              maskImage: DOT_MASK,
              WebkitMaskImage: DOT_MASK,
            }}
          />
          {/* Both plates open with an `h2`, because with the section heading gone there
              is no level above them to hang off — each plate is its own topic, and the
              page's outline runs the hero's `h1` straight into these two. */}
          <h2
            data-lift="20"
            className="panel-title text-ink [--panel-title-size:var(--text-3xl)]"
          >
            {trade.title}
          </h2>

          {/* One paragraph, the plate's full width, no cap. `text-wrap: pretty` is on
              every `p` from the base layer, so the last line keeps its own company. */}
          <p data-lift="20" className="mt-5 text-lead text-ink/80">
            {trade.lede}
          </p>

          {/* A grid at every width now, rather than a stack that became one at `lg`.
              The device keeps a share of the row instead of a fixed column below `lg`,
              so the wiring has somewhere to run on a phone — 34% leaves the nodes two
              thirds, which is what they need once their labels are allowed two lines.
     
              `gap-x` is written twice, here and as `--fan-bridge` in `TradeFan`, and
              has to stay in step: the cords are drawn across this gap to reach the
              device, so the value is the drawing's as much as the layout's. That is
              the same bargain the other three fan numbers already make. */}
          <div
            data-lift="12"
            className="mt-10 grid grid-cols-[minmax(0,36%)_minmax(0,1fr)] items-center gap-x-2 sm:grid-cols-[min(44%,17rem)_minmax(0,1fr)] sm:gap-x-4 lg:gap-x-6"
          >
            {/* The source: the whole render, at its own aspect, filling its column. */}
            <figure className="relative w-full">
              <Image
                src="/assets/app/trade.png"
                alt={trade.shotAlt}
                width={903}
                height={1894}
                quality={90}
                /* 272px is the ceiling from `sm` up, since the column caps there;
                   below it the column is 36% of the viewport. */
                sizes="(min-width: 640px) 272px, 36vw"
                className="block h-auto w-full drop-shadow-2xl"
              />
            </figure>

            {/* The pitch is wide at `lg` and up, where four cards have a 570px device to
                keep company with and a tight stack would sit in the middle of it like a
                paragraph. Tight below that, where the cables are gone and this is a
                list. */}
            <TradeFan steps={trade.steps} />
          </div>
        </div>

        {/* The market. Column, because the panel inside it takes whatever height is
            left once the copy has had its share — which is how this plate matches the
            thread beside it without a fixed height anywhere. */}
        {/* Back on `haze` pending a field of its own. `lilac` and `sky` are `Product`'s,
            `haze` is `About`'s, `tide` is the plate across the gap, and the remaining pale
            steps are within 1.1:1 of each other — so a field unique to this section means
            a new token, which is a decision to take rather than assume. */}
        <div className="flex flex-col rounded-2xl bg-haze px-7 py-9 sm:px-9 sm:py-11">
          <h2
            data-lift="20"
            className="panel-title text-ink [--panel-title-size:var(--text-3xl)]"
          >
            {lesson.title}
          </h2>

          {/* Matched to the panel beside it: same step, same tone. One sentence, so it
              keeps a measure instead of running the width — this plate has the market
              below it filling that width already. */}
          <p data-lift="20" className="mt-5 max-w-[54ch] text-lead text-ink/80">
            {lesson.body}
          </p>

          <div data-lift="12" className="mt-10 flex flex-1 flex-col">
            <LessonPanel />
          </div>
        </div>
      </Lift>
    </section>
  );
}

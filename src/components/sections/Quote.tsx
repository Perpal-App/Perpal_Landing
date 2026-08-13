import { quote } from "@/lib/content";
import { Lift } from "@/components/motion/Lift";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The quote: three lines, centred on a plate.
 *
 * It comes after the ask because it is not part of the argument — the page has already
 * made its case and asked. This is what the reader leaves with, and copy that has to
 * carry that much cannot be sharing a panel with anything else.
 *
 * The field is `paper-dim`, the palest step in the palette, so the plate reads as
 * almost the same white as the matte it sits on. The border is `line-strong` rather
 * than `line` because at this value the edge is the only thing telling the card from
 * the page, and the hairline was too close to the fill to do it — a border described
 * as load-bearing has to actually be visible. A fine grid inside it and a dot at each
 * corner finish the idea: a specimen plate fixed to the page, which is the one object
 * a quotation belongs on. The grid is `line` at a fraction of its strength, so it
 * registers as texture and never as a table.
 *
 * Centred, and this is the screen that earns it. There is one object on the plate and
 * it is a statement with no competing element — no eyebrow, no action — which is the
 * case the rule against centring everything explicitly leaves open.
 *
 * Dürer, at the `d2` display step: 36px at a phone's width, 80px at a desktop's. This
 * is the only place on the page besides the hero and the wordmark where the display
 * face appears, and a quotation is exactly what it is for. `d2` and not `d1`: the hero
 * owns the largest step, and a quotation matching it would be arguing with the
 * headline. `display-bold` supplies the weight — Dürer ships one light cut, so the
 * bold is a stroke on the outlines; the reasoning is on the utility.
 *
 * The step sits on the `blockquote` rather than on the paragraph, so every `em` further
 * in — the lines' side room, the marks themselves — resolves against the quotation's own
 * size instead of the browser's 16px default. That is what keeps the marks proportional
 * to the words at every viewport without a single breakpoint.
 *
 * Three lines, and they are authored rather than wrapped. The plate is full-bleed and
 * the step is fluid, so the number of lines a centred quotation takes would otherwise
 * be an outcome of two moving measurements; the breaks live in `content.ts` so it is a
 * fact instead. Each line is its own block, and the line boxes stack on `d2`'s own
 * leading with no paragraph gap, so the two clauses read as one three-line block
 * rather than as two stanzas. That leading is 1.06 rather than the 0.92 this step
 * carried while nothing set more than one line on it — the working is in `@theme`,
 * where it belongs, since Dürer's descenders are a property of the face and not of
 * this screen.
 *
 * The longest line measures about 15.5em once its side room is counted. Against the
 * plate's inner width that fits from roughly an 850px viewport upward, with the margin
 * widening as the viewport grows, so `max-w-full` is a backstop rather than a working
 * constraint at any desktop size. Below that a line clamps and rewraps, which is the
 * same graceful failure the phone already relies on — never an overflow.
 *
 * On a phone the authored lines wrap again and the block runs to about six. That is
 * the honest answer rather than a failure: 107 characters cannot be three lines at
 * 360px without dropping the display face to body size, which it is not for. The
 * hierarchy is unchanged — it is still the only thing on the plate.
 *
 * Reduced motion and no-JavaScript leave the copy at full contrast, which `Reveal`
 * handles by never starting.
 */

/* A 32px grid at a fraction of the hairline's strength. Two linear gradients rather
   than an asset: at this weight a shipped texture would be larger than the CSS and
   would still band on a wide panel. */
const GRID = [
  "linear-gradient(to right, var(--color-line) 1px, transparent 1px)",
  "linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
].join(", ");

/**
 * One quote mark, used at both ends of the quotation.
 *
 * Drawn rather than set. The glyphs it replaces were Poppins' own marks, and a text
 * mark can only ever be the shape its face ships — this pair is the shape the design
 * asked for, so it arrives as outlines. Inline rather than an `<img>` for two reasons
 * that both matter here: it takes its colour from the palette instead of baking a hex
 * into an asset, and at this size a request for two paths would cost more than the
 * paths themselves.
 *
 * The same glyph at both ends, tails down, which is how the pair is conventionally
 * drawn when the marks are set as objects rather than as punctuation. Nothing is
 * mirrored.
 *
 * `0.7em` of the quotation's own step. The glyph fills about three quarters of its
 * square, which puts its ink near seven tenths of Dürer's cap height — the ratio the
 * reference sets.
 *
 * Out of flow, and anchored to its own line rather than to the quotation as a whole.
 * That distinction is the whole of it, and it took two wrong answers to find.
 *
 * Set inline, a mark joins its line's centring, so it pushed the words it was supposed
 * to be framing off the axis the other lines sat on. Moved to the corners of the block
 * instead, the pair became perfectly symmetrical about the centre — and still wrong,
 * because a block is only as wide as its widest line. Every line narrower than that one
 * is inset from both edges by half the difference, so the mark on a short line ended up
 * that much further from the words than the mark on the long one. The gaps were equal to
 * the block and unequal to the text, which is the version anyone actually looks at.
 *
 * So each mark now pins to the line it belongs to. The mark-bearing lines carry 0.8em of
 * room on both sides — symmetric, so the words stay on the same axis as the middle line —
 * and the mark occupies that room at whichever end is its own. 0.8em of room holding a
 * 0.7em mark, less the glyph's own margin inside its square, leaves about 0.15em of
 * visible gap. Identical at both ends, and it stays identical however the lines are
 * rewritten, because nothing about it depends on their relative lengths any more.
 *
 * `aria-hidden`, because `blockquote` already tells a screen reader this is a
 * quotation.
 */
function Mark({ closing = false }: { closing?: boolean }) {
  return (
    <svg
      viewBox="0 0 150 150"
      aria-hidden
      focusable="false"
      className={`absolute size-[0.7em] fill-line-strong ${
        closing ? "right-0 bottom-0" : "top-0 left-0"
      }`}
    >
      <path d="m49.8 19.6h-23.8c-8.3 0-16 6.8-16 16.1v23.8c0 8.3 6.1 16.1 15.4 16.5h25v-1h3.9l-4.1 0.1c0.1 11.2 1.2 32.8-25.8 40.3-2.4 0.6-3.9 2.2-4.9 3.8-2.8 4.8 0.4 11.4 6.9 11.2 4.6-0.1 31.9-5.8 37.9-32.4 1.4-5.2 1.8-11.4 1.8-15.8v-46.2c0-8.3-7.4-16.6-16.3-16.4z" />
      <path d="m124.5 19.6h-24.7c-7.8 0-15.8 6.8-15.8 16.1v23.4c0.4 8.3 6.8 15.9 15.8 16.1h24.3l0.1 0.1c0 11.6 0.9 32.5-24.1 39.7-2.5 0.4-4.2 1.1-6.3 3.8-3.1 4.8 0.1 12.4 7.8 11.6 5.3-0.4 35.2-8.1 37.9-39.4 0.2-2.3 0.5-6.2 0.5-9v-46.3c0-7.7-6.4-15.8-15.5-16.1z" />
    </svg>
  );
}

export function Quote() {
  return (
    <section data-parallax className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3">
      {/* The plate is the `Lift` root, so the quotation settles on arrival like
          every other panel. Only the quotation moves — the grid, the border and
          the four corner dots stay put, because they are what the plate is
          measured against and a specimen card whose registration marks drift is
          not registered to anything. */}
      <Lift className="relative isolate overflow-hidden rounded-2xl border border-line-strong bg-paper-dim px-6 py-14 text-center sm:px-14 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{ backgroundImage: GRID, backgroundSize: "32px 32px" }}
        />

        {/* Four dots, one per corner, inset on the same 4px base the spacing uses.
            They are what make the plate read as fixed to the page rather than
            floating on it — the reason a specimen card has them at all. */}
        {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map(
          (corner) => (
            <span
              key={corner}
              aria-hidden
              className={`pointer-events-none absolute ${corner} size-1 rounded-full bg-line-strong`}
            />
          ),
        )}

        {/* The band crosses this quotation a word at a time, not a character at a
            time. `About` is prose and wants the finer band — no single word should
            become the subject of a paragraph. Nineteen words that have been weighed
            individually want the opposite: each one arriving is the point.

            The window is set here rather than inherited because the defaults are
            sized for a tall reading column. `bottom bottom` sits about ninety pixels
            after `top 82%` for a block only three lines deep, so the whole reveal
            used to be spent in less than one wheel movement — which is what made it
            look switched on rather than read. Entering at 90% and finishing when the
            block is a little above centre spreads it across roughly 560px of scroll,
            about thirty per word, and the quotation is still fully on screen when the
            last word lands.

            This replaces a `min-h-[65svh]` runway that bought the same distance by
            making the element taller. That worked, but it padded the plate with empty
            space to serve the animation; the trigger window is the honest place for a
            motion decision, and the plate goes back to the height its content needs.

            Ending on `center 40%` rather than the default's `bottom 60%` because this
            block is short enough to hold in one glance: finishing when it is a little
            above centre lands the last word where the eye already is. Nothing is
            passed for `scrub` — tracking the scroll exactly is the default now, and
            the reasoning for that lives on the prop. */}
        <Reveal unit="words" start="top 90%" end="center 40%">
          <blockquote data-lift="12" className="text-d2">
            <p className="display-bold font-display text-ink">
              {quote.lines.map((line, i) => {
                const opens = i === 0;
                const closes = i === quote.lines.length - 1;

                /* Only the lines that carry a mark shrink to their own text and
                   reserve room for it. The middle line needs neither, and inherits
                   its centring from the plate. */
                return (
                  <span
                    key={line}
                    className={
                      opens || closes
                        ? "relative mx-auto block w-fit max-w-full px-[0.8em]"
                        : "block"
                    }
                  >
                    {opens && <Mark />}
                    <span data-reveal-text>{line}</span>
                    {closes && <Mark closing />}
                  </span>
                );
              })}
            </p>
          </blockquote>
        </Reveal>
      </Lift>
    </section>
  );
}

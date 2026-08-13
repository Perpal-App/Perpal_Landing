import { faq } from "@/lib/content";
import { Lift } from "@/components/motion/Lift";

/**
 * FAQ: the small print, given the same care as the promise.
 *
 * It sits between the reassurance and the ask, which is the only place it belongs. A reader
 * who has come this far has decided whether they want this; what stops them now is a
 * question, and the answer has to arrive before the button does. Below the ask it would be a
 * footer nobody scrolls to.
 *
 * The field is `surface`, the palest cool step in the palette. Flat and quiet on purpose:
 * `About` has the haze and the mesh, `Product` the lilac and the device, `HowItWorks` the
 * tide, `Privacy` the deep sky and the lock, `Access` the ember. This is the section that
 * answers questions, and the field's job is to stay out of the way of prose. It is also the
 * quietest beat before the warm panel, so the ember still arrives as a change of temperature.
 *
 * Centred title over left-aligned rows, and that tension is the composition. Prose cannot be
 * centred without making the reader hunt for the start of every line, so the signpost is
 * centred and everything you actually read is not.
 *
 * ---
 *
 * The rows are native `<details>`, one per question, and that is the whole interaction: a
 * disclosure widget the browser already knows how to open, focus, announce and toggle from
 * the keyboard. There is no JavaScript in this section. The `+` becomes a `−` because the
 * vertical half of it scales to nothing under `group-open`, which is a transform on one
 * pseudo-free element rather than two icons swapped.
 *
 * The open and close are animated from the element rather than by a script measuring it: the
 * `details::details-content` rule in `globals.css` transitions the row's height, and carries
 * the note on why that is the only route that eases a *closing* row as well as an opening
 * one. A measured max-height would need JavaScript here and would be wrong the moment the
 * type reflowed. Where the pseudo-element is not supported the row still opens, immediately,
 * and the answer's own `@starting-style` fade still runs — nothing is lost but the easing.
 *
 * Rows run the full width of the plate; the answer inside them does not. At the widths this
 * plate reaches, a full-width paragraph is a 200-character line, so it caps at 78 characters
 * — the reference this was drawn from lets its answers run the whole row, and that is the one
 * place the reference loses to the reading measure.
 *
 * One motion idea beyond that, the same one its neighbours use: `Lift` on the panel's own
 * arrival, at the two depths the other panels use.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3"
      /* Clears the fixed nav when an anchor jump lands here. */
      style={{ scrollMarginTop: "6rem" }}
    >
      <Lift className="rounded-2xl bg-surface px-8 py-11 sm:px-11 sm:py-14">
        <h2 className="panel-title text-center text-ink" data-lift="20">
          {faq.title}
        </h2>

        <div data-lift="12" className="mt-10 flex flex-col gap-2.5 sm:mt-12">
          {faq.items.map((item) => (
            <details
              key={item.question}
              /* `group`, so the summary's marker can read the open state without a class
                 being toggled on it by anything. */
              className="group rounded-2xl bg-paper px-6 py-5 ring-1 ring-line-strong/60 sm:px-7"
            >
              <summary
                /* The default triangle goes, and the whole row becomes the target: a
                   question is a line of text, and asking the reader to hit a 36px circle
                   beside it would be a worse control than the one the browser gave us.
                   Both markers have to be named — `list-none` for the standard one and the
                   webkit pseudo-element for Safari's. */
                className="flex cursor-pointer list-none items-center justify-between gap-6 font-ui text-base font-semibold text-ink [&::-webkit-details-marker]:hidden"
              >
                {item.question}

                {/* A plus that becomes a minus. Two bars in one box, and the upright one
                    collapses on open — `scale-y-0` rather than a rotation, so the horizontal
                    bar never moves and the eye reads a state change rather than a spin. */}
                <span
                  aria-hidden
                  className="relative grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-line-strong transition-colors duration-200 ease-swift group-hover:ring-ink/30"
                >
                  <span className="absolute h-[1.5px] w-3.5 rounded-full bg-ink" />
                  <span className="absolute h-3.5 w-[1.5px] rounded-full bg-ink transition-transform duration-200 ease-swift group-open:scale-y-0" />
                </span>
              </summary>

              <p className="mt-3 max-w-[78ch] text-sm leading-relaxed text-muted transition-[opacity,translate] duration-300 ease-swift starting:translate-y-1 starting:opacity-0">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Lift>
    </section>
  );
}

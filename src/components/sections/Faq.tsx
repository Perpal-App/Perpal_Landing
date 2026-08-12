import { faq } from "@/lib/content";
import { Lift } from "@/components/motion/Lift";

/**
 * FAQ: the small print, given the same care as the promise.
 *
 * It sits between the reassurance and the ask, which is the only place it belongs. A
 * reader who has come this far has decided whether they want this; what stops them
 * now is a question, and the answer has to arrive before the button does. Below the
 * ask it would be a footer nobody scrolls to.
 *
 * The field is `surface`, the palest cool step in the palette. Flat and quiet on
 * purpose: `About` has the haze and the mesh, `Product` the lilac and the device,
 * `HowItWorks` the tide, `Privacy` the deep sky and the lock, `Access` the ember. This
 * is the section that answers
 * questions, and the field's job is to stay out of the way of prose. It is also the
 * quietest beat before the warm panel, so the ember still arrives as a change of
 * temperature.
 *
 * Centred title, and the only centred thing here when the rows land: a signpost you
 * read once, over a column you read line by line. Prose cannot be centred without
 * making the reader hunt for the start of every line, and the tension between those
 * two alignments is what will keep a section this plain from reading as a default.
 *
 * The questions themselves are not written yet, on instruction. The panel holds the
 * title, the field and the height the rows will need. When they arrive they belong in
 * `content.ts` and in a native `<details>` per row — keyboard support, expanded state
 * and toggle for free, and no interaction JavaScript in this section at all.
 *
 * One motion idea, the same one its neighbours use: `Lift` on the panel's own
 * arrival.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3"
      /* Clears the fixed nav when an anchor jump lands here. */
      style={{ scrollMarginTop: "6rem" }}
    >
      <Lift className="min-h-[22rem] rounded-2xl bg-surface px-8 py-11 sm:px-11 sm:py-14 lg:min-h-[26rem]">
        <h2 className="panel-title text-center text-ink" data-lift="20">
          {faq.title}
        </h2>
      </Lift>
    </section>
  );
}

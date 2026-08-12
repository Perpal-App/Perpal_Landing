import { how } from "@/lib/content";
import { Lift } from "@/components/motion/Lift";

/**
 * How it works: the mechanics, after the argument and before the questions.
 *
 * The order is the reader's. `Product` says what the app is and `About` says why it
 * exists; the question that follows both is what actually happens when you use it, and
 * it has to be answered before either the reassurance or the FAQ, which between them
 * catch what is left over.
 *
 * The field is `tide`, and it is new — see the token, where the reason is sequence
 * rather than taste. Every other cool field on this page is a step of the same blue,
 * so a fifth pale section could only differ from its neighbours by being a shade
 * lighter or darker, which reads as a misprint. Shifting hue instead reads as a new
 * movement, and this section arriving in a different temperature is what stops the
 * run of panels from reading as one long panel.
 *
 * The heading is anchored top-left rather than centred, unlike `Privacy` below it. Two
 * adjacent sections with a centred title and a pale field would be the same layout
 * twice, and a sequence reads from a corner: whatever the steps turn out to be, they
 * will run down or across from this heading rather than radiate from the middle of
 * the panel.
 *
 * Empty on instruction. The steps are not written, so nothing is drawn — no cards
 * holding placeholder text, no numbered frames waiting for copy. What the panel does
 * carry is the room they will need: the same 22rem, 26rem from `lg`, as the closing
 * panel, so the three panels at the foot of the page already share a height.
 *
 * Motion is the arrival `Lift` its neighbours use, on the heading for now, so the
 * section joins the page's one scroll gesture rather than acquiring its own later.
 */
export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3"
      /* Clears the fixed nav when an anchor jump lands here. */
      style={{ scrollMarginTop: "6rem" }}
    >
      <Lift className="min-h-[22rem] rounded-2xl bg-tide px-8 py-11 sm:px-11 sm:py-14 lg:min-h-[26rem]">
        <h2 className="panel-title text-ink" data-lift="20">
          {how.title}
        </h2>
      </Lift>
    </section>
  );
}

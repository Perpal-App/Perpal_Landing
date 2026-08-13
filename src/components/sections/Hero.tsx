import { cta, hero } from "@/lib/content";
import { Backdrop } from "@/components/chrome/Backdrop";
import { Button } from "@/components/ui/Button";
import { UmbraLogo } from "@/components/brandlogos/Umbra";
import { MaskedLines } from "@/components/motion/MaskedLines";

/**
 * Hero.
 *
 * Centred, because the screen has exactly one action and the clearing behind it
 * is radial — a device with a centre needs a centre to sit in.
 *
 * The section owns the weather. `Backdrop` paints it but is scoped here rather
 * than to the document, so the gradient is the hero's stage and the sections
 * below it stand on paper. `isolate` is what makes that safe: it gives the
 * section its own stacking context, so the field's negative z-index stays
 * behind this content instead of falling behind the page itself.
 *
 * The headline rises line by line out of its own clip; the copy under it does not
 * move. One thing on this screen animates, and it is the thing the screen is for.
 *
 * Both are plain text in the markup either way. The headline's start state is a CSS
 * rule that only exists when motion is allowed, and the document's `<noscript>` block
 * restores it — so the message never depends on an animation completing.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col items-center justify-center px-gutter pt-32 pb-24 text-center sm:pt-36"
    >
      <Backdrop />

      {/* Each line rises out of its own clip. `immediate` rather than scroll-triggered,
          because this is the top of the page and there is nothing to scroll to it — and
          delayed until the opening card has left the viewport entirely, at 3.2s. Two earlier
          numbers were wrong for instructive reasons: with no delay it finished arriving while
          the card was still over the top of it, and at 2.6s it played against the page's own
          fade and looked like nothing was happening. The number is one line of the timeline
          in `globals.css`. */}
      <MaskedLines
        as="h1"
        lines={hero.headline}
        immediate
        delay={3.25}
        className="font-display text-d1 font-normal text-ink"
      />

      {/* One clause per line, split on the copy's own full stop, so the lede
          never leaves an orphaned "and" hanging off the first row. Each clause
          is its own block and balances internally, which is what keeps the
          fallback tidy at a narrow measure where a clause has to wrap. */}
      <p className="mt-7 max-w-[38ch] text-balance text-lead text-muted sm:max-w-2xl">
        <span className="block">{hero.lede.lesson}</span>
        {/* Umbra is named by its own lockup rather than by five letters of
            Lexend: it is the one outside party in the sentence, and a reader
            who already trusts it should be able to recognise it at a glance.
            Ink against the muted line, because a proper noun carries a proper
            noun's emphasis. The space before the mark is non-breaking: a logo
            cut from its preposition reads as a missing word. */}
        <span className="block">
          {hero.lede.funding.before}&nbsp;
          <UmbraLogo label={hero.lede.funding.brand} className="text-ink" />{" "}
          {hero.lede.funding.after}
        </span>
      </p>

      {/* Glass, because it is the one element sitting directly on the live
          field and it can sample it. Raised and still: the page's only action
          should look pressable without needing to move to prove it. */}
      <div className="mt-10">
        <Button href={cta.href} variant="glass">
          {cta.label}
        </Button>
      </div>
    </section>
  );
}

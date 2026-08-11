import { cta, hero } from "@/lib/content";
import { Backdrop } from "@/components/chrome/Backdrop";
import { Button } from "@/components/ui/Button";
import { UmbraLogo } from "@/components/brandlogos/Umbra";

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
 * The headline and supporting copy render as plain HTML so the primary message
 * never depends on animation completing.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col items-center justify-center px-gutter pt-32 pb-24 text-center sm:pt-36"
    >
      <Backdrop />

      <h1 className="font-display text-d1 font-normal text-ink">
        {hero.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

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

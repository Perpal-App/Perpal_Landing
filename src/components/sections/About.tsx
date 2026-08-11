import { about } from "@/lib/content";
import { Mark } from "@/components/ui/Logo";

/**
 * About.
 *
 * The hero makes a promise; this section answers the question that follows it,
 * in one centred column and as briefly as the argument allows: the gap, the
 * answer, then the scope.
 *
 * The heading is deliberately the smallest type here. It is a question, not a
 * claim, so it announces the section and gets out of the way — which is what
 * lets the prose be the thing you read and the last line be the thing you
 * remember. That last line is the signature: stating the narrowness outright is
 * the whole point, since it is what makes the app worth trusting.
 *
 * Centred even though the hero is centred too, because this is a single short
 * address to the reader with no competing element to place. Every block is kept
 * to three lines at a real measure; a centred column any longer makes the reader
 * hunt for the start of each line.
 *
 * No motion. The section is four short blocks of text, and the argument is the
 * content — there is nothing here worth staging, and nothing that should be
 * invisible until a script arrives.
 *
 * The surface is one flat field of `haze`, the palest step of the sky the hero
 * paints, set in the same inset rounded window the backdrop uses so the page
 * reads as canvases stacked on a white matte. Flat, deliberately: the hero owns
 * the weather, and a second gradient here would make the first one ordinary.
 */
export function About() {
  return (
    <section id="about" className="relative px-2.5 sm:px-3">
      <div className="rounded-2xl bg-haze py-16 sm:py-20">
        <div className="shell">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title text-ink">{about.title}</h2>

            {/* The measure sits on the element that carries `text-lead`, so
                `ch` resolves against the type it is actually measuring. */}
            <div className="mx-auto mt-7 max-w-[46ch] space-y-5 text-lead text-muted">
              {about.body.map((paragraph) => (
                <p key={paragraph} className="text-balance">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* A pause, not an ornament: the mark holds the beat between the
                argument and the scope that closes it. The nudge is optical —
                the source PNG carries 16.8% of transparent margin on its right
                edge, which is the gap the wordmark lockup relies on, so a
                centred mark would otherwise sit half that margin left of the
                column's axis. */}
            <Mark className="mx-auto mt-8 size-5 translate-x-[8.4%] text-sky-deep/60" />

            <p className="mx-auto mt-6 max-w-[52ch] text-balance font-ui text-base font-medium tracking-[-0.01em] text-ink">
              {about.scope}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

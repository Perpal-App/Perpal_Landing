import { about } from "@/lib/content";
import { Mark } from "@/components/ui/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { AboutMesh } from "@/components/sections/AboutMesh";

/**
 * About.
 *
 * The hero makes a promise; this section answers the question that follows it,
 * in one centred column and as briefly as the argument allows: the gap, the
 * answer, then the scope.
 *
 * The heading is not the largest type here — the prose runs to 22px against its
 * 20px, on the product owner's call. It holds its place as a heading on case,
 * weight and letterspacing instead: uppercase Poppins 600 against Lexend at
 * regular reads as a label for the block below it rather than as part of it.
 *
 * The last line is the signature. Stating the narrowness outright is what makes
 * the app worth trusting, and it carries that on face, weight and colour rather
 * than on size.
 *
 * Centred even though the hero is centred too, because this is a single short
 * address to the reader with no competing element to place. Every block is kept
 * to three lines at a real measure; a centred column any longer makes the reader
 * hunt for the start of each line.
 *
 * One motion idea, in two parts that share a cause: everything here is tied to
 * scroll position rather than played on arrival. A band of characters fades in as
 * the copy rises — see `Reveal` — and the objects around it fall and tilt as the
 * section passes. Scroll back and both reverse. They are not two effects
 * competing: they are the same gesture at two depths, which is why the objects
 * travel a hundred pixels and the type does not move at all.
 *
 * Only the two paragraphs are in that band. The heading, the mark and the closing
 * line are fixed points, and the argument between them is what moves — a heading
 * that has to assemble itself is a heading you cannot use to find your place, and
 * a two-line stamp is too short to be worth crossing.
 *
 * Nothing that has to be read waits on a script. `Reveal` splits the text after
 * mount and sets the hidden state at runtime, so the server sends plain
 * paragraphs and reduced motion leaves them exactly as they are.
 *
 * The surface is one flat field of `haze`, the palest step of the sky the hero
 * paints, set in the same inset rounded window the backdrop uses so the page
 * reads as canvases stacked on a white matte. Flat, deliberately: the hero owns
 * the weather, and a second gradient here would make the first one ordinary.
 */
export function About() {
  return (
    <section id="about" className="relative px-2.5 sm:px-3">
      {/* `overflow-hidden` is what lets an object in the mesh run off the panel
          and be cut by its radius. */}
      {/* Tall for the amount of copy it holds, on purpose: the height is what
          gives the mesh four vertical bands a side to sit in, and what keeps the
          objects from crowding the column they frame.

          `transform-gpu` is a performance fix, not a visual one. This panel
          clips eight independently transformed images against a rounded
          rectangle; without its own compositing layer the browser re-applies
          that rounded clip against the page on every scrolled frame, which is
          the kind of cost that shows up as scroll jitter exactly when the
          section comes into view. Promoted, the clip is the layer's own and is
          resolved once. */}
      <div className="relative transform-gpu overflow-hidden rounded-2xl bg-haze py-28 sm:py-36 lg:py-44">
        <AboutMesh />

        {/* `relative` is load-bearing: the mesh is positioned, and a positioned
            element paints over static in-flow content no matter what order the
            DOM is in. This puts the reading column back on top. */}
        <div className="relative shell">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="section-title text-ink">{about.title}</h2>

            {/* `ink`, not `muted`, and a step up the scale: this is the section
                speaking, and it is the only prose on the page that has to hold a
                reader who has not decided anything yet.

                `text-balance` rather than written-in line breaks. The reveal
                works per character, so it does not need the copy to declare
                where lines end — which leaves the browser free to even out the
                rag at whatever width it is actually given. */}
            <div className="mx-auto mt-8 max-w-[44ch] space-y-6 text-lead-lg text-ink">
              {about.body.map((paragraph) => (
                <p key={paragraph} className="text-balance" data-reveal-text>
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
            <Mark className="mx-auto mt-8 size-10 translate-x-[8.4%] text-sky-deep/60" />

            {/* A step below the prose and two below the heading, so the stamp
                cannot be mistaken for either. Its own two lines, so the break
                stays between the markets and the venue at every width. */}
            <p className="mt-6 font-ui text-sm font-medium tracking-[-0.01em] text-ink">
              <span className="block">{about.scope.what}</span>
              <span className="block">{about.scope.where}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { Mark } from "@/components/ui/Logo";
import { Lift } from "@/components/motion/Lift";

/**
 * Privacy: the closing card, and the page's last image rather than its last argument.
 *
 * It comes after the ask because it is not an argument. The waitlist button stays the
 * last object on the page you can act on; this is what the reader is left looking at.
 *
 * No copy, on instruction — the heading and the sentence are written and parked in
 * `content.ts`, and the card holds the field, the emblem and the centred room they
 * will sit in. Which means the mark is currently carrying the panel on its own, and
 * the emboss can afford to be quiet in a way it could not if type were sitting on it.
 *
 * Centred, and here that is earned rather than default: one emblem, one statement to
 * come, no second element to place and nothing to scan. Every other panel puts its
 * content in a corner because every other panel has something else in it.
 *
 * The field is `sky-deep` graded into `sky` — the page's own blue, and the first
 * mid-tone cool field on it. Every other cool panel is a pale step of one hue, so
 * the way to make a seventh panel new was a change of register rather than another
 * shade: deeper, and read against the warm panel above it as the page's exhale. It
 * also bookends the hero, whose field is the same weather. One hue thinning, like
 * the ember ramp, not two hues meeting.
 *
 * When the copy lands it is ink, which is what the register costs and pays for: white
 * on `sky-deep` measures 2.6:1 and is simply not available here, while ink holds 7:1
 * at the deep end of the ramp and 11.7:1 at the pale one, and `ink/80` holds 5:1 and
 * 8.3:1. Type will sit over the emblem's light fill, which only lifts the local
 * field, so those are floors rather than estimates.
 *
 * The signature is the lock, and the lock is the wordmark's own mark: the shackle and
 * body are drawn geometry, the Perpal monogram sits inside the body where a keyhole
 * would be. It is embossed rather than illustrated — white at 15% for the body, 30%
 * for the shackle stroke — so it reads as the surface being shaped rather than as a
 * picture placed on it. A padlock is the most generic image in software; making it
 * out of the product's own mark is what stops it being stock art.
 *
 * The dots are the only texture, masked to a soft patch high on the right so they
 * read as a perforation in the surface rather than as a pattern laid over it. They
 * are also the accessory nearest the chopping block: they exist to keep the deep
 * corner from going flat, and if they ever compete with the emboss they should go.
 *
 * Motion is the arrival `Lift` the panels above use. The lock takes 40px of it — the
 * deep layer, as in the closing panel — and the copy will take 12px, so the type
 * crosses the emblem as the card arrives rather than the whole card sliding up as one
 * board.
 */

/* A 1px dot on a 12px pitch. `rgba(255,255,255,0)` rather than `transparent` for the
   second stop, for the reason recorded in `Backdrop`: `transparent` is transparent
   black, and interpolating to it drags the ramp through grey. Here the stops share a
   position so nothing interpolates, but the rule is the rule. */
const DOTS =
  "radial-gradient(circle, rgba(255,255,255,0.5) 1px, rgba(255,255,255,0) 1px)";

/* Soft patch, high and right. 18rem is a radius rather than a size, so the fade is
   the same width at every viewport while its centre moves with the card. */
const DOT_MASK =
  "radial-gradient(18rem at 78% 18%, #000 0%, rgba(0,0,0,0) 100%)";

export function Privacy() {
  return (
    <section id="privacy" className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3">
      {/* Taller than the panels above it: this one has to hold an emblem at a size
          that reads, with the copy to come centred inside that height rather than
          stacked above it. `isolate` keeps the two decorative layers' negative index
          inside the card, and `overflow-hidden` crops the emboss to the radius. */}
      <Lift className="relative isolate flex min-h-[24rem] items-center justify-center overflow-hidden rounded-2xl bg-linear-to-b from-sky-deep to-sky px-8 py-16 sm:px-11 lg:min-h-[30rem]">
        {/* The lock. Sized against the card's height so it scales with the panel
            rather than with the viewport, and centred on both axes: the drawn
            geometry fills its box exactly, so the box is the lock. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 grid place-items-center"
          data-lift="40"
        >
          <div className="relative aspect-[15/16] h-[80%]">
            {/* Shackle first, then the body over it, so the arch disappears behind
                the case the way a real one does — its legs run 20 units past the
                body's top edge and are simply covered.

                The arc is a true semicircle: a 136-unit chord on a 68 radius. The
                30-unit stroke is centred on that path, which is what puts the outer
                edge of the shackle exactly on the top of the viewBox. */}
            <svg
              viewBox="0 0 300 320"
              fill="none"
              className="absolute inset-0 size-full"
            >
              <path
                d="M82 103V83a68 68 0 0 1 136 0v20"
                stroke="currentColor"
                strokeWidth="30"
                strokeLinecap="round"
                className="text-paper/30"
              />
              <rect
                x="16"
                y="96"
                width="268"
                height="224"
                rx="60"
                className="fill-paper/15"
              />
            </svg>

            {/* The monogram, where a keyhole goes. 65% of the body's height, which
                is the width the mask's glyph needs to read at this scale.

                One translate, not two: centring wants -50% and the mark's own PNG
                carries more transparent margin on its right than its left, which
                pulls a centred box visibly left — the same 8.4% correction `About`
                applies. They are combined into a single value because
                `tailwind-merge` treats two `translate-x` utilities as a conflict and
                would drop one of them. */}
            <Mark className="absolute top-[65%] left-1/2 aspect-square w-[77%] -translate-x-[41.6%] -translate-y-1/2 text-paper/25" />
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: DOTS,
            backgroundSize: "12px 12px",
            maskImage: DOT_MASK,
            WebkitMaskImage: DOT_MASK,
          }}
        />
      </Lift>
    </section>
  );
}

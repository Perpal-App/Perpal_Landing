import { privacy } from "@/lib/content";
import { Mark } from "@/components/ui/Logo";
import { Lift } from "@/components/motion/Lift";

/**
 * Privacy: the closing card, and the page's last image rather than its last argument.
 *
 * It sits between the mechanics and the questions, ahead of the FAQ rather than after
 * it. That is the order the doubt arrives in: this answers the thing a reader was never
 * going to type into a search box, so it belongs where it can pre-empt the questions
 * instead of trailing them, and the FAQ is left holding whatever survives it.
 *
 * Two blocks of type, and the pairing is the page's: the heading takes `panel-title`,
 * which is Poppins at 600 and the same step every other panel heading uses, and the
 * sentence takes Lexend — the utility face for the thing you navigate by, the reading
 * face for the thing you read. Nothing here is Dürer: the display face carries the hero
 * and the wordmark, and a closing statement that borrowed it would be competing with
 * the top of the page.
 *
 * The sentence sets at `text-base` rather than at `text-lead`, and that is the price of
 * putting it inside the lock. `text-lead` is a vw-driven clamp that reaches 22px, where
 * this 130-character sentence needs about 480px of measure to hold three lines — wider
 * than the lock's case at any card height short of absurd. The lock is sized from the
 * card's height and the type was sized from the viewport's width, so the two were never
 * proportional and the copy outgrew the emblem at every wide viewport. 16px is what
 * fits. It costs nothing that matters: `dusk` on `sky-deep` measures 5.7:1 at any size,
 * and the gap to a 44px heading gets wider rather than narrower, so the hierarchy the
 * panel had is stronger for it.
 *
 * Centred, and here that is earned rather than default: one emblem, one statement to
 * come, no second element to place and nothing to scan. Every other panel puts its
 * content in a corner because every other panel has something else in it.
 *
 * The field is `sky-deep` graded into `sky` — the page's own blue, and the first
 * mid-tone cool field on it. Every other cool panel is a pale step of one hue, so
 * the way to make a seventh panel new was a change of register rather than another
 * shade: deeper. It lands between `tide` above and `surface` below, both pale, so the
 * depth is the whole of what separates it from its neighbours — and it is the page's
 * exhale before the ember arrives two panels later. It also bookends the hero, whose
 * field is the same weather. One hue thinning, like the ember ramp, not two hues
 * meeting.
 *
 * The copy is `dusk`, not `ink`, and the difference is the whole argument for that
 * token. A mid-tone field leaves no room at the light end — white measures 2.6:1 here
 * and is unavailable at any size — so the type has to be dark, and `ink` being a cool
 * near-black reads as black on blue. `dusk` is the same depth in the brand's violet:
 * 5.7:1 on `sky-deep`, 9.6:1 on `sky`, and higher again where both lines cross the
 * lock's white face, which only lifts the local field.
 *
 * Both blocks carry it at full strength, heading and sentence alike. An alpha step
 * would put the sentence under the floor at the deep end of the ramp, so the hierarchy
 * is size and weight — 44px of Poppins 600 against 16px of Lexend at regular — which
 * is where it should have been anyway.
 *
 * The signature is the lock, and the lock is the wordmark's own mark: case and arch
 * are drawn geometry, the Perpal monogram is engraved where a keyhole goes. A padlock
 * is the most generic image in software; building it out of the product's own mark is
 * what stops it being stock art.
 *
 * It is embossed rather than illustrated, and it is all one colour: paper, at three
 * strengths down a vertical ramp. Nothing in it is ink. An ink stop at the foot held
 * the shape against the pale end of the field, but ink is a cool near-black, so at any
 * useful strength over blue it turned the lock blue-grey — a shadow rather than a
 * highlight. White throughout reads as light landing on a raised surface, which is
 * what this is, and the ramp from 52% at the crown to 22% at the foot is the direction
 * that light comes from. The foot is deliberately the weakest part: the field is
 * palest there and a white emboss has least room, which is also how a real one fades.
 *
 * The monogram is the brightest thing in the lock rather than the darkest, for the
 * same reason. No outline either: a stroke heavy enough to see turns the emboss into a
 * drawing of a padlock.
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
          that reads, with the copy inside it. The height steps three times rather
          than twice because the emblem's width is derived from it while the heading's
          width is derived from the viewport — the band between 640px and 1024px needed
          its own step or the heading outgrew the case it sits in.

          `isolate` keeps the two decorative layers' negative index inside the card, and
          `overflow-hidden` crops the emboss to the radius. */}
      <Lift className="relative isolate min-h-[26rem] overflow-hidden rounded-2xl bg-linear-to-b from-sky-deep to-sky px-8 py-16 sm:min-h-[32rem] sm:px-11 lg:min-h-[34rem]">
        {/* One box holds the emblem and the copy, and that is the whole of the fix for
            the copy escaping the lock.

            They used to be siblings: the lock absolutely positioned and sized from the
            card's height, the copy an in-flow block capped at `62ch`. Two independent
            measurements of the same thing, so they only agreed by luck — and they did
            not, because `ch` grows with a vw-driven type step while the lock does not
            grow at all. At any desktop width the sentence was about twice the width of
            the case it was supposed to sit in.

            Sharing one box makes the relationship structural. The drawing fills the box
            exactly, so the box *is* the lock, and every number below is read off the
            viewBox: the case spans 5.33% to 94.67% horizontally and starts at 30%
            vertically. The copy is positioned in those terms, so it cannot leave the
            case however the panel is resized.

            `h-[90%]` leaves the shackle a little air under the card's top edge, as the
            reference does. `max-w-full` is the phone: once the box would be wider than
            the card, width takes over from height and the aspect ratio shrinks it. */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative aspect-[15/16] h-[90%] max-w-full">
            <div
              aria-hidden
              data-lift="40"
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <svg
                viewBox="0 0 300 320"
                className="absolute inset-0 size-full"
                fill="none"
              >
                <defs>
                  {/* One colour at three strengths, top to bottom. Paper only — see
                      the note above for why the ink stop that used to sit at the foot
                      had to go. The token supplies the colour, so this is not a hex
                      value hiding in a component. */}
                  <linearGradient id="lock-face" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-paper)"
                      stopOpacity="0.52"
                    />
                    <stop
                      offset="52%"
                      stopColor="var(--color-paper)"
                      stopOpacity="0.34"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-paper)"
                      stopOpacity="0.22"
                    />
                  </linearGradient>
                </defs>

                {/* One path, two subpaths, one fill. That is the fix for the shackle
                    showing through the case: a translucent body drawn over a
                    translucent arch stacks its alpha, so the legs and their caps read
                    as brighter shapes inside the body. Filled as a single region
                    instead, the whole lock is one flat 44% of paper and there is
                    nothing to overlap.

                    Case first, then the arch as a closed ring whose legs stop exactly
                    on the case's top edge at y=96. Fill only, no stroke: an outline at
                    a weight that reads on a shape this size draws a hard line around
                    every contour, and the emboss is meant to be the surface lifting
                    rather than a diagram of a padlock. Without one, the coincident
                    edges at y=96 vanish into the single filled region.

                    Geometry: case 268x224 on a 44 radius, so its flat top spans x
                    60..240. The arch is a 62-radius centreline with a 28-unit wall —
                    outer 76, inner 48 — centred at (150, 76), which puts its outer
                    crown exactly on the top of the viewBox and its legs at x 74..102
                    and 198..226. Those sit 14 units inside the flat top, which is the
                    correction the old drawing needed: at a 60 radius with a wider
                    arch, the legs landed on the case's corner curves and hung over
                    them. */}
                <path
                  d="M60 96H240A44 44 0 0 1 284 140V276A44 44 0 0 1 240 320H60A44 44 0 0 1 16 276V140A44 44 0 0 1 60 96Z
                     M74 96V76A76 76 0 0 1 226 76V96H198V76A48 48 0 0 0 102 76V96Z"
                  fill="url(#lock-face)"
                />
              </svg>

              {/* The monogram, lit rather than engraved: paper at 45%, which is
                  brighter than the 34% the case carries behind it, so it reads as the
                  one part of the face the light picks out. Not brighter than that,
                  because the sentence crosses it — the mark is what the type sits on,
                  and the type is what the panel is for. The keyhole's job on a padlock,
                  done with the product's own mark.

                  Placement is measured, not judged. The glyph's alpha bounding box in
                  the 500px source sits at 18.0% from the left and 16.8% from the right,
                  24.6% from the top and 23.2% from the bottom — so its centre is at
                  50.6% and 50.7% of the box, and centring the box leaves the glyph 0.6%
                  right and 0.7% low. The two translate values carry that correction.
                  The previous drawing borrowed `About`'s 8.4% nudge, which belongs to
                  the wordmark lockup rather than to the mark on its own, and it is why
                  the monogram sat visibly right of centre.

                  77% of the box width puts the glyph at 151 x 121 units inside a 268 x
                  224 case: a little over half its width and height. */}
              <Mark className="absolute top-[65%] left-1/2 aspect-square w-[77%] -translate-x-[50.6%] -translate-y-[50.7%] text-paper/45" />
            </div>

            {/* The copy, in the case's own coordinates.

                `top-[30%] bottom-0` is the case exactly — its top edge is y=96 of a
                320-unit viewBox — so `justify-center` centres the block on the case
                rather than on the card. That is the alignment error the reference makes
                obvious: centred on the card, the block sat a third of the way up into
                the shackle, which is the one part of the lock that cannot hold type.

                `inset-x-[9%]` is the case's 5.33% edge plus a margin of about the same
                again, so the longest line stops short of the side walls instead of
                running into them. The heading is the constraint on that number, not the
                sentence: "Built for privacy" is around 7.9em of Poppins 600, which at
                the 44px top of the step wants roughly 350px, and the measure has to
                clear it or the two words split.

                Both keep `text-balance`. The problem in a centred block is uneven line
                lengths, which is the case balance is for, and written breaks would be
                correct at exactly one width. */}
            <div
              data-lift="12"
              className="absolute inset-x-[9%] top-[30%] bottom-0 flex flex-col items-center justify-center gap-4 text-center"
            >
              <h2 className="panel-title text-dusk">{privacy.title}</h2>
              <p className="text-balance text-base text-dusk">{privacy.body}</p>
            </div>
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

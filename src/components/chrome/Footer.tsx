/**
 * The footer plate.
 *
 * The name, one channel, one address and a notice, on a field that is mostly empty. It
 * was entirely empty on instruction for a while, and the composition still reads that
 * way on purpose: the emptiness is the plate's character, so the content holds the top
 * and bottom edges and leaves the middle alone.
 *
 * It also carries the page's last structural decision — the matte closes underneath it.
 * Every section above sits
 * in a 10px white margin on three sides and runs flush to the bottom of the document;
 * this one is the only plate margined on all four, so the rounded window the page has
 * been drawing since the hero finally closes instead of being cut off by the viewport.
 *
 * The gradient is the grape ramp, and it is the one field on the page in the action
 * colour's family. That is defensible here and nowhere else: there is no button on
 * this plate to compete with, the hero's own backdrop is built from the same violet,
 * and a page that opens in the app's colour and closes in it reads as one object
 * rather than as a run of panels. It deepens downward — `grape` at the top into
 * `grape-deep` at the foot — because a footer is the page settling, not the page
 * opening.
 *
 * The crown used to be `lilac-deep`, and it moved for a reason worth recording, because
 * it is the cost of putting the name at the top of the plate. `paper` measures 3.7:1 on
 * `lilac-deep` and the glow sits in that same corner, which took it to 2.4:1 — under the
 * 3:1 floor for large text, never mind the 4.5:1 for small. Nothing could be written
 * there. `grape` into `grape-deep` clears it, and it is also the more coherent ramp by
 * this file's own argument: one hue thinning and deepening, the shape `ember` has, rather
 * than two hues meeting.
 *
 * Two layers, not one. A single linear ramp on a plate this wide goes flat in the
 * middle and bands on a shallow gradient; the radial in the top-left corner gives the
 * field a light source and something to fall away from. It fades to `lilac` at zero
 * alpha rather than to `transparent`, which is the rule `Backdrop` records: a fade to
 * `transparent` interpolates through transparent black and leaves a grey bloom.
 *
 * Its peak alpha halved, from 0.55 to 0.28, and that is the same contrast bill as the
 * ramp. The corner the light lands in is now the corner the lockup sits in, and a
 * highlight strong enough to be a light source was strong enough to erase white type
 * standing on it. At 0.28 it still reads as light falling across the plate — the
 * gradient's job here was never to be seen for itself — and the lockup measures about
 * 4.2:1 where it actually sits, clear of the 3:1 large-text floor with room over.
 *
 * The texture is a dot field pinned to the bottom edge and masked away as it rises, in
 * white at a low alpha so it belongs to the gradient rather than sitting on it. It has
 * a job beyond decoration: the deepest, most saturated part of the ramp is the last
 * 200px of the page, and that is exactly where a two-stop gradient shows its steps.
 * Grain would have solved the banding invisibly; dots solve it and give the foot of
 * the page a floor.
 *
 * The composition is a row at the crown and one line at the foot. The name leads on the
 * left with the X mark under it, the contact heading and address answer it on the right,
 * and the notice sits alone on the last line. The two crown blocks are flush to opposite
 * paddings, and those two edges are what hold the plate apart.
 *
 * Asymmetric on purpose: Privacy and the quote are both centred, and a third centred
 * composition in a row would make the end of the page read as one long exhale. This is
 * the plate that stops.
 *
 * Contrast decided which corner the small type could go in. The crown is `grape`, where
 * `paper` measures 5.4:1 — enough for the 14px address — but only where the glow has
 * faded. The glow is anchored to the top *left*, so the left block holds the wordmark
 * and the glyph, which need 3:1 and get about 4.2:1 under it, while the address takes
 * the right, past the point the highlight reaches zero. The notice keeps the foot, where
 * the ramp is deepest and the same white runs to 6.8:1.
 *
 * The notice takes `paper/80` rather than full strength, which is the hierarchy step
 * between a legal line and a live address. It measures 5.0:1 at the foot; `paper/70`
 * would have read better and lands at 4.2:1, so it did not survive.
 *
 * The contact heading takes `panel-title` at the wordmark's sizes, and it started as
 * `label` at 11px. Two things ruled that out. Dimming it to sit under the address was
 * never available — at the crown `paper/80` falls to 4.1:1 and `paper/70` to 3.5:1, both
 * under the floor at that size — and at 11px against a 36px lockup it read as a caption
 * filed beneath the name rather than as the other half of the row.
 *
 * At the wordmark's size it is a peer, which is what the composition wants: two blocks
 * of equal rank at opposite ends of the crown. The face stays Poppins rather than
 * following the wordmark into Dürer — the display face is the brand's voice and a footer
 * heading borrowing it would be a second wordmark — and the case follows `panel-title`'s
 * own argument, which is that a geometric sans sets loose at display sizes and wants its
 * tracking closed up, not opened out. `label`'s 0.16em is right at 11px and is gaps at
 * 36px. Sentence case for the same reason: uppercase at this size is a shout, and the
 * heading is naming a group, not raising its voice.
 *
 * The address is set in Poppins. It is not prose — an email address is structured data,
 * the same category as a price or a decoded field, which is the utility face's job.
 *
 * It takes `text-lead`, 17px to 22px, having started at 14px. Once the heading above it
 * went to the wordmark's size the old step left a 36-to-14 jump, which does not read as
 * hierarchy so much as an afterthought — and the address is the one thing in this block
 * anybody is here to use. At the top of the step it measures 5.4:1 on the crown, still
 * clear of the 4.5:1 floor for type this side of 24px.
 *
 * The mark sits in a chip that is *deeper* than the field it sits on, which is the
 * opposite of the reference and the only version that works here. The reference puts a
 * light grey circle on near-black, so its white glyph gains contrast from the surround;
 * inverted onto a mid-violet field, a white-alpha chip lightens the local ground and
 * takes the glyph down to about 3.3:1 — over the 3:1 floor for a graphic, but with
 * nothing in hand. Filling with `grape-deep` instead puts the glyph at 6.1:1 and needs
 * no argument.
 *
 * The colour pair is the plate's own: `grape-deep` is the foot of this ramp, so the chip
 * is the field's deep end lifted onto its light end, with a `paper` rim. That rim is
 * doing the work the fill cannot — a deep chip on a mid field is only about 1.25:1, so
 * the edge is what makes it read as an object rather than a smudge.
 *
 * Hover is one idea: the chip rises a single pixel and its rim catches more light. That
 * is the same emboss language the lock in `Privacy` uses — `paper` at low alpha standing
 * for light landing on a raised surface — rather than a new effect invented for a
 * footer, and the rise is what makes the rim's brightening read as a cause instead of a
 * colour change. 200ms, inside the 150–250ms band feedback belongs in, on transform and
 * colour only. Press returns it to the surface and deepens the fill.
 *
 * Under reduced motion the durations collapse and the rise goes with them; the rim and
 * fill still change, so the state is never carried by movement alone.
 *
 * The address stays underlined rather than taking a colour change on hover. On a field
 * this saturated the only headroom is downward, so a hover tint would cut contrast in
 * order to signal a state; strengthening a rule that is already there costs nothing. The
 * underline is also the link affordance itself, which matters when a link sits on a
 * coloured field with no other cue.
 *
 * `focus-visible` is overridden to `paper` on both links. The document's default ring is
 * `ink`, a cool near-black, which measures about 2.4:1 against this field — a focus
 * indicator failing the 3:1 it exists to meet. This is the only plate on the page dark
 * enough to need the inverse.
 *
 * The plate used to ride up over the quote's lower edge on a `-mt-24`, and that is
 * gone. The overlap only ever worked because the quote plate carried a tall minimum
 * height and the encroachment landed on empty field; once the quote was allowed to be
 * the height of its own content, the same negative margin ate through its bottom
 * padding and into the type. A plate that overlaps its neighbour by a fixed number of
 * pixels is depending on that neighbour's height, which is not a relationship worth
 * keeping for the effect it bought. It now sits in the same 10px matte gap as every
 * other section boundary on the page, so the rhythm is one value everywhere.
 *
 * The entrance is unaffected: `Lift` is transform-only and every offset it applies is
 * positive, so the plate can only ever be below its layout position on the way in and
 * never above it. It changes no document height during scroll and cannot reach into
 * the section above. Reduced motion skips the travel and renders the composition
 * exactly where CSS puts it.
 *
 */

import { footer } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { Lift } from "@/components/motion/Lift";

/* Light gathering in the top-left, falling away across the plate. */
const GLOW =
  "radial-gradient(72% 84% at 6% 0%, rgba(196,184,242,0.28) 0%, rgba(196,184,242,0.11) 44%, rgba(196,184,242,0) 76%)";

/* The X mark, drawn rather than fetched: one path is smaller than any dependency that
   would supply it, and `currentColor` means it belongs to the palette instead of
   shipping its own black. The only third-party glyph on the page, and it earns that by
   being the platform's own identity — the thing a word cannot do faster. */
function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" className={className}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

/* 10px pitch, tighter than the quote plate's 32px grid: at the foot of the page this
   reads as a fine mesh rather than as a second grid. */
const DOTS =
  "radial-gradient(circle, rgba(255,255,255,0.55) 1px, rgba(255,255,255,0) 1px)";

/* Dense on the bottom edge, gone by two thirds up. */
const DOT_MASK =
  "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0) 66%)";

export function Footer() {
  return (
    <footer
      data-parallax
      className="mt-2.5 mb-2.5 px-2.5 sm:mt-3 sm:mb-3 sm:px-3"
    >
      <Lift>
        <div
          data-lift="96"
          className="relative isolate flex min-h-[16rem] flex-col justify-between gap-12 overflow-hidden rounded-2xl bg-linear-to-b from-grape to-grape-deep px-7 py-9 will-change-transform sm:px-10 sm:py-11 lg:min-h-[20rem]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: GLOW }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: DOTS,
              backgroundSize: "10px 10px",
              maskImage: DOT_MASK,
              WebkitMaskImage: DOT_MASK,
            }}
          />

          {/* `relative` is load-bearing on both groups, the same way it is in `About`:
              the two layers above are positioned, and a positioned element paints over
              static in-flow content whatever the DOM order. This puts the name back on
              top of the field it signs. */}
          <div className="relative flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            {/* Bigger and heavier than anywhere else the lockup appears, because this
                is the one place it is a signature rather than a control. The nav's copy
                has to sit inside a 56px capsule and get out of the way; this one is the
                last thing on the page and can be the size it wants.

                Both halves move together on the lockup's measured 4:3, so the mark
                stays on the cap line: 40/30 on a phone, 48/36 from `sm` up. The step is
                there because 48px of Dürer plus a 44px chip under it is most of a
                360px screen's height budget. */}
            <div>
              <Logo
                bold
                className="text-paper"
                markClassName="size-10 sm:size-12"
                wordClassName="text-3xl sm:text-4xl"
              />

            {/* The chip is 44px exactly, so the touch target and the drawn object are
                the same thing rather than one padding the other. It sits flush with the
                left edge, not nudged: the circle is the object now, so its edge is what
                lines up with the lockup's, where before the glyph's own edge had to. */}
            <a
              href={footer.x.href}
              target="_blank"
              rel="noreferrer"
              aria-label={footer.x.label}
              className="mt-6 inline-flex size-11 items-center justify-center rounded-full bg-grape-deep/75 text-paper ring-1 ring-paper/20 transition duration-200 ease-swift hover:-translate-y-px hover:bg-grape-deep/90 hover:ring-paper/45 focus-visible:outline-paper active:translate-y-0 active:bg-grape-deep"
            >
                <XMark className="size-[18px]" />
              </a>
            </div>

            {/* Left-aligned, like everything else on the plate, even though the column
                sits at the far end of the row. Those are separate decisions and it is
                worth not confusing them: the block is positioned right, so its outer
                edge answers the lockup's, but its type starts on a left edge so the
                heading and the address share a reading edge. Right-aligning the text
                instead gave the two lines a ragged left and nothing to line up on. */}
            <div>
              {/* `panel-title` at the wordmark's own two sizes, so the heading and the
                  name read as peers across the row rather than as a label filed under
                  one of them.

                  Sized through `--panel-title-size` rather than by adding a `text-*`
                  class, because that variable is the hook the utility is built around —
                  it is how `panel-title-fit` lowers the same value — so there is one
                  `font-size` declaration and no two utilities racing on source order.
                  `--text-3xl` and `--text-4xl` are the same 30px and 36px the wordmark
                  takes, read from the theme instead of restated. */}
              <h2 className="panel-title text-paper [--panel-title-size:var(--text-3xl)] sm:[--panel-title-size:var(--text-4xl)]">
                {footer.email.title}
              </h2>

              {/* `address` rather than a div or a nav. This is contact information for
                  the page, which is the element's actual purpose — and it is not
                  navigation, so a nav landmark would be a lie about what it is.
                  Preflight leaves `address` italic, hence `not-italic`. */}
              {/* `mt-1`, and it looks wrong written down. The link builds its 44px touch
                  target with `min-h-11` and centres a ~33px line box inside it, which
                  already contributes about 11px of clear space above the type — so the
                  margin only has to add the remainder. Measured from the heading's
                  baseline to the address's cap line it comes to about 26px, a tight
                  pairing at a 36px heading; `mt-4` measured 38px and read as two
                  unrelated blocks. Padding that exists for a finger should not be paid
                  for twice.

                  The underline offset is in `em` so it holds its relationship as the
                  step moves between 17px and 22px, rather than crowding the descenders
                  at the top of the clamp. */}
              <address className="mt-1 not-italic">
                <a
                  href={footer.email.href}
                  className="inline-flex min-h-11 items-center font-ui text-lead font-medium text-paper underline decoration-paper/40 underline-offset-[0.3em] transition-colors duration-200 ease-swift hover:decoration-paper focus-visible:outline-paper"
                >
                  {footer.email.label}
                </a>
              </address>
            </div>
          </div>

          <p className="relative font-ui text-sm text-paper/80">
            {footer.notice(new Date().getFullYear())}
          </p>
        </div>
      </Lift>
    </footer>
  );
}

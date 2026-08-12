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
 * The composition is two groups held apart, not a row. The name leads at the crown with
 * the X mark under it, and the notice and the address sit on the last line. Everything
 * is on the left edge except the address, which takes the far end of the closing line.
 *
 * Asymmetric on purpose: Privacy and the quote are both centred, and a third centred
 * composition in a row would make the end of the page read as one long exhale. This is
 * the plate that stops.
 *
 * The split also does the contrast work. The crown can hold a 24px wordmark and a
 * 16px glyph, both of which need only 3:1, and it measures about 4.2:1. It could not
 * hold the 14px notice, which needs 4.5:1 — and does not have to, because the notice
 * belongs at the foot anyway, where the ramp is deepest and the same white runs to
 * 6.8:1. The type went where the field could carry it and where it wanted to be, which
 * is the only kind of constraint worth having.
 *
 * The notice takes `paper/80` rather than full strength, which is the hierarchy step
 * between a legal line and a live address. It measures 5.0:1 at the foot; `paper/70`
 * would have read better and lands at 4.2:1, so it did not survive.
 *
 * Both the address and the mark are set in Poppins. Neither is prose — an email address
 * is structured data, the same category as a price or a decoded field, which is the
 * utility face's job.
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
    <footer className="mt-2.5 mb-2.5 px-2.5 sm:mt-3 sm:mb-3 sm:px-3">
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
          <div className="relative">
            <Logo className="text-paper" />

            {/* The mark link is `-ml-3` so the glyph's own optical left edge lines up
                with the M of the lockup above it, rather than the padding that builds
                its touch target doing so. The target itself is the full 44px square the
                `size-11` gives it — an icon link has no text to grow one out of. */}
            <a
              href={footer.x.href}
              target="_blank"
              rel="noreferrer"
              aria-label={footer.x.label}
              className="mt-4 -ml-3 inline-flex size-11 items-center justify-center rounded-full text-paper transition-colors duration-200 ease-swift hover:bg-paper/12 focus-visible:outline-paper"
            >
              <XMark className="size-[18px]" />
            </a>
          </div>

          <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-ui text-sm text-paper/80">
              {footer.notice(new Date().getFullYear())}
            </p>

            {/* `address` rather than a div or a nav. This is contact information for the
                page, which is the element's actual purpose — and it is not navigation,
                so a nav landmark would be a lie about what it is. Preflight leaves
                `address` italic, hence `not-italic`. */}
            <address className="not-italic">
              <a
                href={footer.email.href}
                className="inline-flex min-h-11 items-center font-ui text-sm font-medium text-paper underline decoration-paper/40 underline-offset-[6px] transition-colors duration-200 ease-swift hover:decoration-paper focus-visible:outline-paper"
              >
                {footer.email.label}
              </a>
            </address>
          </div>
        </div>
      </Lift>
    </footer>
  );
}

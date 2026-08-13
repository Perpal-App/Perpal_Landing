import { Logo } from "@/components/ui/Logo";
import { Bitcoin } from "@/components/brandlogos/Bitcoin";
import { Ethereum } from "@/components/brandlogos/Ethereum";
import { Solana } from "@/components/brandlogos/Solana";

/**
 * The opening card: the lockup, then the three markets, then it leaves.
 *
 * No JavaScript, no state, no client boundary. Every beat is a CSS animation with a delay,
 * which buys three things a scripted splash cannot. It cannot flash — there is no moment
 * where the overlay has been painted and its script has not yet claimed it. It cannot strand
 * anyone: with JavaScript off the sequence still plays and still ends. And under
 * `prefers-reduced-motion` the global collapse lands every animation on its final frame, so
 * the card is already gone and the page is simply there — which is the correct reduced-motion
 * behaviour for a splash, rather than a shorter splash.
 *
 * It is a card, not a curtain: the same 10px matte and `rounded-2xl` every section on the page
 * sits in, so the first thing a visitor sees is already the page's own geometry. The field is
 * `lilac`, flat — the lavender that `Product`'s panel is built on, so the opening belongs to
 * the palette rather than introducing a colour that never returns. Nothing floats in it. A
 * particle field would be the one thing on this site that means nothing at all.
 *
 * Each beat runs 720ms while the marks change every 500ms, so consecutive marks cross rather
 * than cut. That overlap is what lets the sequence be unhurried without being long: each mark
 * holds about a third of a second at full strength, and the card starts leaving at 2.2s.
 * `sol` holds rather than fading, so the card leaves while something is still in it.
 *
 * Everything on the card is white, on instruction, including the lockup. That is a soft 1.83:1
 * on `lilac`, and worth knowing rather than defending: the marks are decoration on a card that
 * lives for under two seconds, but the wordmark is type, and type at 1.8:1 would not pass
 * anywhere else on this site. It is here because the alternative — a `dusk` lockup beside three
 * white glyphs — reads as two brands rather than one. If the card ever has to hold a sentence,
 * the field goes deeper first.
 *
 * The three market marks are the files the product owner supplied. Ethereum keeps its six
 * facets, with the shading translated into white at six opacities; the note in that file
 * explains the inversion.
 *
 * The card is the only thing that moves. It clears upward in a second while the page fades in
 * behind it, in place — an earlier version had the page rise 2rem into position against the
 * card's exit, and however good the parallax was, the page appeared to have been scrolled by
 * something the visitor had not done.
 *
 * The page is not merely covered during all this. It is unpainted and uninteractive until the
 * card starts to leave — see `site-reveal` — because a site sitting fully rendered under an
 * overlay can be scrolled and clicked through, and shows itself the moment anything about the
 * overlay is less than opaque. This is an opening, not a lid.
 */

/* Line marks rather than the 3D renders, on instruction, and it costs nothing to be pleased
   about: three inline SVGs are three fewer image decodes on the one screen that has to be
   painted before anything else, and a mark in `currentColor` cannot arrive a frame late.
   In the order the page names them everywhere else.

   The heights are unequal on purpose. Solana's mark is wide and short and Bitcoin's is tall
   and narrow, so matching their boxes would make one of them look twice the size of the
   other; these are matched by how much ink they put on the card. */
const MARKETS = [
  {
    id: "btc",
    Glyph: Bitcoin,
    size: "h-24 w-auto",
    beat: "animate-[splash-beat_720ms_var(--ease-swift)_660ms_both]",
  },
  {
    id: "eth",
    Glyph: Ethereum,
    size: "h-24 w-auto",
    beat: "animate-[splash-beat_720ms_var(--ease-swift)_1160ms_both]",
  },
  {
    id: "sol",
    Glyph: Solana,
    size: "h-20 w-auto",
    beat: "animate-[splash-hold_720ms_var(--ease-swift)_1660ms_both]",
  },
] as const;

export function Splash() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] animate-[splash-exit_1000ms_var(--ease-expo)_2200ms_both] p-2.5 sm:p-3"
    >
      <div className="grid h-full w-full place-items-center overflow-hidden rounded-2xl bg-lilac">
        {/* One cell, four things in it. A grid rather than absolute positioning, so the
            lockup and the tokens are centred on the same point without a single offset
            being written down. */}
        <div className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
          <Logo
            bold
            className="animate-[splash-beat_720ms_var(--ease-swift)_80ms_both] text-paper"
            markClassName="size-10"
            wordClassName="text-3xl"
          />

          {/* Each delay is written out rather than composed, because a class Tailwind's
              scanner cannot read in the source is a class it does not generate. */}
          {MARKETS.map(({ id, Glyph, size, beat }) => (
            <Glyph key={id} className={`${size} text-paper ${beat}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

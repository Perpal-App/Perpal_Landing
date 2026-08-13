"use client";

import { useEffect, useRef } from "react";
import { Logo } from "@/components/ui/Logo";
import { Bitcoin } from "@/components/brandlogos/Bitcoin";
import { Ethereum } from "@/components/brandlogos/Ethereum";
import { Solana } from "@/components/brandlogos/Solana";
import { unlockScroll } from "@/components/motion/scroll";
import {
  HERO_RELEASE_EVENT,
  OPENING_ACTIVE_CLASS,
} from "@/components/motion/opening";

/**
 * The opening card: the lockup, then the three markets, then it leaves.
 *
 * Every visual beat remains a CSS animation with a delay, so the overlay is present on the
 * first paint and the no-JavaScript sequence still plays. A client effect watches the exit
 * and releases scrolling and the hero halfway through it, so the headline rises out of the
 * space the card is still vacating instead of waiting behind it — the arithmetic for that
 * mark is on `HERO_RELEASE_PROGRESS` below. Under
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

/**
 * How far through `splash-exit` the card has uncovered the hero.
 *
 * The hero is released while the card is still moving, so the text rises out of the
 * space the card is vacating rather than waiting for it to be gone. Two earlier
 * marks were both too late, and for the same reason: `--ease-expo` is
 * cubic-bezier(0.16, 1, 0.3, 1), which spends almost all of its travel in the first
 * third of its time, so the slide reads as over long before it is.
 *
 * The card ends at -101%, so at travel `p` its bottom edge sits at 100 - 101p
 * viewport heights. Half-travel puts that edge at 49.5vh — the hero's own centre
 * line, where the headline is — and expo returns 0.5 at a tenth of its input:
 *
 *   y(s) = 3s - 3s² + s³ = 0.5  ->  s ≈ 0.2063
 *   x(0.2063) = 3(0.7937²)(0.2063)(0.16) + 3(0.7937)(0.2063²)(0.3) + 0.2063³
 *             = 0.0624 + 0.0304 + 0.0088 = 0.102
 *
 * So the card is half gone 102ms into the 1000ms exit, at 2.30s, and fully clear at
 * 2.82s. Releasing at 2.30s puts the whole of the headline's rise inside the second
 * half of the slide. Waiting for -100% (x = 0.620) or for `finished` (x = 1) both
 * left the hero blank after the card had visibly stopped.
 */
const HERO_RELEASE_PROGRESS = 0.102;

export function Splash() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let cancelled = false;
    let released = false;
    let timer = 0;
    const complete = () => {
      if (cancelled || released) return;
      released = true;
      document.documentElement.classList.remove(OPENING_ACTIVE_CLASS);
      unlockScroll();
      window.dispatchEvent(new Event(HERO_RELEASE_EVENT));
    };
    const exit = root
      .getAnimations()
      .find(
        (animation) =>
          (animation as CSSAnimation).animationName === "splash-exit",
      );

    if (exit) {
      /* The mark is read off the running animation rather than written down as a
         wall-clock number, so it stays correct if the exit's delay or duration is
         retimed — the only thing hard-coded here is the shape of the curve, which
         is what `CARD_CLEAR_PROGRESS` records. */
      const timing = exit.effect?.getComputedTiming();
      const releaseAt =
        Number(timing?.delay ?? 0) +
        Number(timing?.activeDuration ?? 0) * HERO_RELEASE_PROGRESS;
      const remaining = releaseAt - Number(exit.currentTime ?? 0);

      if (Number.isFinite(remaining)) {
        timer = window.setTimeout(complete, Math.max(0, remaining));
      }

      /* Backstop, and the only release if the timing could not be read: a
         cancelled or never-started exit still has to let the page go. */
      void exit.finished.then(complete, complete);
    } else {
      complete();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
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

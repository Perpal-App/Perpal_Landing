"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion, setLenis } from "./scroll";

/**
 * Smooth scrolling, driven by a single requestAnimationFrame loop.
 *
 * The important detail is that Lenis does not run its own RAF. GSAP's ticker
 * calls `lenis.raf`, so scroll interpolation, ScrollTrigger updates and every
 * tween are computed in one pass per frame, in a fixed order:
 *
 *   gsap.ticker tick
 *     -> lenis.raf        (advance smoothed scroll position, write scrollTop)
 *     -> lenis 'scroll'   (ScrollTrigger.update reads the new position)
 *     -> gsap tweens      (render)
 *
 * Two independent loops would read and write scroll position in an
 * unpredictable order and produce visible stutter on scroll-linked animation.
 *
 * That order does not happen by itself, and getting it wrong is subtle enough to
 * be worth spelling out. `gsap.ticker.add` appends, and GSAP's own render is
 * already on the ticker — it registers at library init, before any application
 * code runs. So a plain `add(tick)` puts the Lenis advance *after* the render,
 * and every scroll-linked tween on the page draws against the previous frame's
 * scroll position.
 *
 * At a constant velocity that is invisible: the whole page is one frame behind
 * and nothing disagrees with anything. It becomes visible the moment velocity
 * changes, because the size of the error is the frame's scroll delta, and on a
 * reversal it changes sign. Scroll-driven objects then step against the page
 * instead of moving with it — worst where two scrubbed timelines overlap, which
 * on this page is About's mesh and its character band. Hence the third argument
 * to `add`: `prioritize`, which puts this callback at the head of the list so the
 * documented order above is the one that actually runs.
 *
 * `lagSmoothing(0)` is required alongside this. GSAP's default lag smoothing
 * silently adjusts its internal clock after a slow frame, which desynchronises
 * it from the scroll position and shows up as a lurch after any hitch.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Reduced motion keeps native scrolling entirely. Lenis is never created.
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      // lerp rather than duration: the position always chases the real input,
      // so a flick responds on the next frame instead of playing out a fixed
      // animation.
      //
      // 0.15 settles in about a fifth of a second — the page keeps the glide but
      // stops feeling like it is catching up with the wheel. Below roughly 0.1 it
      // starts to read as latency rather than smoothing; above 0.2 the smoothing
      // stops registering at all and there is no reason to run Lenis.
      lerp: 0.15,
      // Just under native. A wheel notch is the unit of scroll-linked animation
      // on this page: every effect tied to scroll position advances by whatever
      // distance one notch covers, so a multiplier above 1 does not only make
      // the page quick, it makes every reveal quicker with it. Holding this
      // slightly below native gives the character band and the mesh room to
      // read, and the smoothing is what keeps it from feeling heavy.
      wheelMultiplier: 0.85,

      smoothWheel: true,
      // Touch is left native. Synthesising momentum on a touchscreen fights
      // the platform's own physics and always feels a step behind the finger.
      syncTouch: false,
      touchMultiplier: 1.6,

      autoRaf: false, // gsap.ticker drives it, see above
      autoResize: true,
      overscroll: false,

      // Let genuinely scrollable panels (code blocks, overflow lists) keep
      // their native scrolling instead of hijacking the page.
      prevent: (node) => node.hasAttribute?.("data-lenis-prevent") ?? false,
    });

    setLenis(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      // gsap.ticker reports seconds, Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };
    // `(tick, once = false, prioritize = true)` — see the note above on ordering.
    gsap.ticker.add(tick, false, true);
    gsap.ticker.lagSmoothing(0);

    // Late-arriving webfonts change text metrics, which moves every trigger
    // boundary below them. Recalculate once they are in.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP's default
      lenis.off("scroll", onScroll);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}

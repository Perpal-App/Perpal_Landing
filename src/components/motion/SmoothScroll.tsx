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
      // animation. 0.11 is the point where it reads smooth but still immediate.
      lerp: 0.11,
      wheelMultiplier: 1,

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
    gsap.ticker.add(tick);
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

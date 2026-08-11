"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Single registration point for GSAP and its plugins.
 *
 * GSAP 3.13 ships every plugin in the public package, so SplitText needs no
 * special handling. Registration is guarded because module code also runs
 * during server rendering of client components.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Fast out, settle in. Nothing on this page eases in from rest.
  gsap.defaults({ ease: "power3.out", duration: 0.75 });

  // Mobile browsers fire resize when the URL bar hides. Recalculating pinned
  // triggers mid-scroll is the single biggest source of jank on phones.
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

export { gsap, ScrollTrigger, SplitText };

/** Scroll reveals start as the element enters, not once it is well inside. */
export const REVEAL_START = "top 88%";

/** Shared timings so every section moves at the same speed. */
export const T = {
  reveal: 0.85,
  quick: 0.45,
  stagger: 0.065,
} as const;

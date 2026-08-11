"use client";

import type Lenis from "lenis";

/**
 * Module-level handle on the single Lenis instance.
 *
 * Deliberately not React context: nothing needs to re-render when the scroll
 * position changes, and a context value updating every frame would be the
 * fastest way to lose the frame budget this page is built around.
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Freeze scrolling (used while the mobile menu is open). */
export function lockScroll() {
  lenis?.stop();
  if (!lenis && typeof document !== "undefined") {
    document.documentElement.classList.add("lenis-stopped");
  }
}

export function unlockScroll() {
  lenis?.start();
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("lenis-stopped");
  }
}

/**
 * Scroll to an element. Falls back to native behaviour when Lenis is absent,
 * which is the case for anyone who has asked for reduced motion.
 */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "auto", block: "start" });
}

/** Click handler for in-page anchors so they route through Lenis. */
export function handleAnchorClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  if (!href.startsWith("#")) return;
  event.preventDefault();
  scrollToTarget(href, 0);
  // Keep the URL honest without triggering the browser's own jump.
  if (typeof history !== "undefined") {
    history.replaceState(null, "", href);
  }
}

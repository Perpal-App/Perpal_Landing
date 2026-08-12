"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap } from "./gsap";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * Lifts marked descendants into place across its own arrival in the viewport.
 *
 * Mark any element inside with `data-lift="<px>"`. It starts that many pixels
 * below where CSS puts it and rises to exactly where CSS puts it, scrubbed to
 * scroll position. Depth is the number: the further back an element reads, the
 * further it travels.
 *
 * How this differs from `Parallax`, which also drifts things against the scroll:
 *
 *   One trigger and one timeline for the whole group, every tween at position 0.
 *   `Parallax` triggers on each element it wraps, so two of them side by side
 *   measure two different ranges and drift out of step with each other by
 *   however much their heights differ. Here the container is the only thing
 *   measured, so a heading, a button and a phone move on one clock.
 *
 *   The range ends on arrival — `bottom bottom`, the moment this element is
 *   fully in view — rather than on departure. That is what makes it usable for
 *   the last panel on a page. A range ending at `bottom top` assumes the element
 *   will leave through the top of the viewport, and a closing panel never does:
 *   scrolling stops with it on screen, so the timeline would strand at a third
 *   of its progress and every element would rest somewhere that is not where the
 *   layout put it. Ending on arrival means full progress is the designed
 *   composition, reached exactly as the reader reaches the end of the page.
 *
 *   Every offset is positive, so nothing overshoots. An element can only ever be
 *   below its layout position, which is what keeps this safe inside a panel that
 *   clips: the crop at the end of the travel is the crop the layout already has.
 *
 * `scrub: true` rather than a catch-up value: the whole point is that the group is
 * locked to the same scroll position, and any smoothing here would let the
 * elements trail the page and each other. Lenis already smooths the scroll this
 * reads from.
 *
 * `ease: "none"`, because a scrubbed tween should take its curve from the scroll.
 *
 * Reduced motion returns before anything is created, and no-JavaScript never
 * reaches it, so in both cases every element renders where CSS puts it. Nothing
 * here carries information — the offsets are depth, and depth is a flourish.
 */
export function Lift({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-lift]", root);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });

      items.forEach((el) => {
        const y = Number(el.dataset.lift);
        if (!y) return;
        /* `from`, so the end of the tween is whatever the element's own layout
           position is. No rest value is written down twice. */
        tl.from(el, { y, ease: "none", duration: 1 }, 0);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

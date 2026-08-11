"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap } from "./gsap";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * Drifts its children vertically against the scroll.
 *
 * `from` and `to` are pixel offsets either side of where CSS already puts the
 * element, deliberately signed that way round. The layout position is the middle
 * of the swing, so the element sits in a sensible place before the script runs,
 * with reduced motion, and on the server — none of which is true if the animation
 * owns one end of the range.
 *
 * Transform only, so nothing reflows: the element's box never moves, which means a
 * parallax inside a clipping parent cannot change what the parent clips or how
 * tall the section is.
 *
 * The trigger is the element itself across its whole pass through the viewport, so
 * the drift is slow by construction — a tall subject earns a long range — and
 * `ease: "none"` because a scrubbed tween should take its curve from the scroll.
 */
export function Parallax({
  from,
  to,
  className,
  children,
}: {
  from: number;
  to: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: from },
        {
          y: to,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.75,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [from, to]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

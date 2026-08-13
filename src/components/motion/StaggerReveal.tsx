"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, REVEAL_START } from "./gsap";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * Forwarded as `data-lift`, because this element may also be one of `Lift`'s
   * targets and turning it into a component must not hide it from that query.
   */
  lift?: number;
  /** Seconds between rows. */
  stagger?: number;
  duration?: number;
  /** Pixels each row rises through. */
  distance?: number;
};

/**
 * Brings a list in one row at a time, as the list arrives.
 *
 * The rows are this element's own marked children, so the group needs no wrapper
 * per row and the parent's layout — a flex column with a gap, in the one place
 * this is used — keeps the rows as its direct children.
 *
 * Each row carries `data-reveal`, which is the shared start state in globals.css
 * rather than anything written here: `opacity: 0` while motion is allowed,
 * absent entirely under `prefers-reduced-motion`, and forced back to 1 by the
 * document's `<noscript>` block. So the list is plain readable markup in every
 * case where this component does not run.
 *
 * The rise is small — a row travelling far enough to notice would be a row that
 * looked misplaced before it moved.
 *
 * `once: true`. A list that re-assembles every time it scrolls past is a list
 * that never settles, and this one sits directly above the page's only action.
 *
 * Why the rows and not this container: where this is used the container is
 * already a `Lift` target, so GSAP owns its `transform` for the whole of the
 * panel's arrival. A second tween writing `y` here would fight that one. The
 * rows have no transform of their own, which makes them the free surface — the
 * same reasoning `PillCloud` records for keeping its fall on `y` and its drift
 * on `yPercent`.
 */
export function StaggerReveal({
  children,
  className,
  lift,
  stagger = 0.07,
  duration = 0.55,
  distance = 12,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const rows = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
    if (!rows.length) return;

    const ctx = gsap.context(() => {
      /* `fromTo`, not `from`. A `from` tween takes the element's *current* value
         as its destination, and the current opacity here is the 0 that
         `[data-reveal]` already put there — so it would animate 0 to 0 and the
         rows would never appear. Both ends are stated for that reason. */
      gsap.fromTo(
        rows,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: REVEAL_START, once: true },
          /* Leave nothing behind. These rows are `<details>` elements whose open
             and close is a CSS transition on `::details-content`, and an entrance
             that has finished has no business still holding an inline `opacity`
             and `transform` on them while the reader is operating one.

             The attribute goes first, in the same synchronous block, because the
             `[data-reveal]` rule would otherwise reassert `opacity: 0` the moment
             the inline value is cleared. No frame is painted between the two. */
          onComplete: () => {
            rows.forEach((row) => row.removeAttribute("data-reveal"));
            gsap.set(rows, { clearProps: "opacity,transform" });
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [stagger, duration, distance]);

  return (
    <div ref={ref} className={cn(className)} data-lift={lift}>
      {children}
    </div>
  );
}

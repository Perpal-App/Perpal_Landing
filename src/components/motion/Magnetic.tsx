"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap } from "./gsap";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the cursor's offset from centre that the element travels. */
  strength?: number;
};

/**
 * Pulls its child slightly toward the pointer on hover.
 *
 * Two deliberate choices keep this cheap:
 *
 * `gsap.quickTo` reuses one tween per axis instead of allocating a new tween
 * on every pointer event, so a fast sweep across a button does not queue
 * dozens of overlapping animations.
 *
 * The bounding rect is measured once on enter, not per move. Reading layout
 * inside a pointer handler while GSAP is writing transforms forces a
 * synchronous reflow each frame. Caching also avoids a feedback loop, since
 * the element is itself moving and would otherwise chase its own new centre.
 */
export function Magnetic({
  children,
  className,
  strength = 0.28,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.42, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.42, ease: "power3.out" });

    let cx = 0;
    let cy = 0;

    const measure = () => {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    };

    const onEnter = () => measure();

    const onMove = (event: PointerEvent) => {
      xTo((event.clientX - cx) * strength);
      yTo((event.clientY - cy) * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

"use client";

import { useRef, type ElementType } from "react";
import { cn } from "@/lib/cn";
import { gsap, REVEAL_START } from "./gsap";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

type MaskedLinesProps = {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Play on mount rather than on scroll. */
  immediate?: boolean;
  /** Hold in the pre-animation state until released. */
  paused?: boolean;
  /** Seconds to wait before playing. For copy that opens under the loading card. */
  delay?: number;
  stagger?: number;
  duration?: number;
};

/**
 * Line reveal for text whose breaks are decided by the copy, not by measurement.
 *
 * Where `SplitLines` measures rendered lines with SplitText, this takes the
 * breaks as given. For the largest type on the page that is the safer choice:
 * the line count cannot change with the viewport or a late webfont, there is no
 * measure-and-relayout pass before the first frame, and the markup is already
 * in its final shape when the animation starts.
 *
 * Each line sits in its own overflow-hidden element and travels on yPercent, so
 * the whole reveal is transform-only.
 */
export function MaskedLines({
  lines,
  as: Tag = "div",
  className,
  lineClassName,
  immediate = false,
  paused = false,
  delay = 0,
  stagger = 0.085,
  duration = 1.05,
}: MaskedLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-line]");
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { yPercent: 0 });
      return;
    }

    if (paused) {
      gsap.set(targets, { yPercent: 115 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        yPercent: 0,
        duration,
        delay,
        stagger,
        ease: "expo.out",
        ...(immediate
          ? {}
          : {
              scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
            }),
      });
    }, el);

    return () => ctx.revert();
  }, [immediate, paused, delay, stagger, duration]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          {/* The starting offset comes from the `html.motion` rule in
              globals.css, not a utility class, so the text stays readable when
              motion is off or JavaScript never arrives. */}
          <span
            data-line
            className={cn("block will-change-transform", lineClassName)}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

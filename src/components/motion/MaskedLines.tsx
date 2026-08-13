"use client";

import { useRef, type ElementType } from "react";
import { cn } from "@/lib/cn";
import { gsap, REVEAL_START } from "./gsap";
import { OPENING_ACTIVE_CLASS } from "./opening";
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
  /** Browser event that releases an immediate reveal. */
  startOn?: string;
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
  startOn,
  stagger = 0.085,
  duration = 1.05,
}: MaskedLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-line]");
    if (!targets.length) return;

    /* Each of the three writes below sets `y` next to `yPercent`, and the pair is
       not redundant.

       The start offset is declared in CSS, as `translateY(115%)`, which is what
       removes the flash — but `getComputedStyle` resolves any transform to a
       matrix in pixels. So what GSAP reads back is not 115%: `_parseTransform`
       sees `y = 1.15 x offsetHeight` and records `yPercent: 0`, because the only
       percentage it will ever infer from a matrix is the -50% centring case
       (CSSPlugin's `Math.round(offsetHeight / 2) === Math.round(-y)` test). It
       then renders `translate(x%, y%)` and `translate3d(x, y, z)` as two
       separate functions, so tweening `yPercent` alone ran 0 -> 0 while the
       pixel offset went untouched and the line never left its clip.

       `y` is therefore the value that actually has to travel. `yPercent` stays
       in the list so the intent survives if the CSS start state is ever
       expressed in a form GSAP does parse as a percentage. */

    if (prefersReducedMotion()) {
      gsap.set(targets, { yPercent: 0, y: 0 });
      return;
    }

    if (paused) {
      /* Overwrites the stylesheet's pixel offset rather than adding to it: the
         inline transform GSAP writes here is the whole 115%, not a second one. */
      gsap.set(targets, { yPercent: 115, y: 0 });
      return;
    }

    let tween: gsap.core.Tween | null = null;
    const play = () => {
      tween = gsap.to(targets, {
        yPercent: 0,
        y: 0,
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
    };

    if (startOn) {
      const waiting = document.documentElement.classList.contains(
        OPENING_ACTIVE_CLASS,
      );
      if (waiting) window.addEventListener(startOn, play, { once: true });
      else play();
    } else {
      play();
    }

    return () => {
      if (startOn) window.removeEventListener(startOn, play);
      tween?.kill();
    };
  }, [immediate, paused, delay, startOn, stagger, duration]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          {/* The starting offset comes from the `.line-mask > [data-line]` rule
              in globals.css, inside the `prefers-reduced-motion: no-preference`
              block, not from a utility class — so the text stays readable when
              motion is off or JavaScript never arrives. (There is no
              `html.motion` rule; an earlier note here named one.) */}
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

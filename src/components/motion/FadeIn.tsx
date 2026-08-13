"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gsap, REVEAL_START } from "./gsap";
import { OPENING_ACTIVE_CLASS } from "./opening";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

type FadeInProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Play on mount rather than on scroll. */
  immediate?: boolean;
  /** Seconds to wait before playing. For copy that opens under the loading card. */
  delay?: number;
  /** Browser event that releases an immediate fade. */
  startOn?: string;
  duration?: number;
};

/**
 * Opacity-only arrival for a block of copy.
 *
 * The counterpart to `MaskedLines`, and deliberately the quieter of the two:
 * where the headline travels, this only changes in opacity. That is what lets it
 * overlap a reveal instead of queueing behind one — two things moving in the same
 * place at the same time compete, whereas something moving and something
 * appearing do not. Nothing about the element's box changes either, so it cannot
 * reflow the copy around it as it arrives.
 *
 * The start state is the shared `[data-reveal]` rule in globals.css rather than a
 * class or an effect, so it is in place from the first paint, it never exists at
 * all under `prefers-reduced-motion`, and the document's `<noscript>` block
 * restores it. The copy is plain text in the markup in every one of those cases.
 */
export function FadeIn({
  children,
  as: Tag = "div",
  className,
  immediate = false,
  delay = 0,
  startOn,
  duration = 0.7,
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    let tween: gsap.core.Tween | null = null;
    const play = () => {
      tween = gsap.to(el, {
        opacity: 1,
        duration,
        delay,
        /* Not the `expo.out` the headline takes. Expo spends nearly all of its
           travel in the first fifth, which on a transform reads as momentum and
           on opacity alone reads as the text snapping on and then sitting there.
           A gentler curve keeps the fade legible for its whole length. */
        ease: "power2.out",
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
  }, [immediate, delay, startOn, duration]);

  return (
    <Tag ref={ref} data-reveal className={cn(className)}>
      {children}
    </Tag>
  );
}

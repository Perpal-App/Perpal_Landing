"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap, SplitText } from "./gsap";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * A soft band of characters that travels through the copy as it scrolls.
 *
 * Every character is a target in one scrubbed timeline. Because each is offset
 * from the last by a fraction of its own fade, a band of them is always
 * mid-transition: solid behind the band, a gradient inside it, and pale ahead of
 * it. Scroll moves the band forward, scrolling back moves it out.
 *
 * Three numbers decide how it feels, and `FLOOR` is the one that matters most.
 *
 *   `FLOOR` is where a character starts, and it is not zero. Text that fades up
 *   from nothing has a hard edge at the front of the band — a wall the copy
 *   stops at — and it hides words from anyone who has not scrolled far enough.
 *   Starting at 0.3 means unread copy is present but quiet, the band has no
 *   edge, and the effect reads as writing coming into focus rather than as text
 *   being switched on.
 *
 *   `STAGGER / DURATION` is the share of its fade each character is offset by,
 *   so the inverse is the width of the band: 25 characters here. Widen it and
 *   the paragraph dissolves as a block; narrow it and characters snap on one at
 *   a time like a typewriter.
 *
 *   `ease: "none"`, because a scrubbed timeline should borrow its curve from the
 *   scroll. Any other ease makes the band accelerate on its own, which reads as
 *   the page lagging the wheel.
 *
 * The timeline is assembled with explicit positions rather than one long
 * staggered tween, for two reasons. Sequence becomes a fact rather than an
 * emergent property of a 400-target stagger — the earlier version let the copy
 * after the band render solid, which gave the whole thing away. And the start
 * state is a plain `gsap.set` instead of a `from`, so nothing depends on
 * immediate-render behaviour.
 *
 * Groups overlap deliberately: each one begins as the previous one is still
 * finishing, so the band crosses a paragraph break without stopping.
 *
 * Mark any element inside with `data-reveal-text` to put it in the band. They are
 * collected in document order, so the band travels in reading order, and anything
 * left unmarked simply stays at full contrast — which is the right treatment for a
 * heading you navigate by and for a closing line too short to be worth crossing.
 *
 * Accessibility: SplitText's `aria: "auto"` default puts the original string on
 * the split element as a label and hides the fragments, so assistive technology
 * reads sentences rather than spelling them out. The split runs after mount, so
 * the server sends plain paragraphs — and with no JavaScript, or with reduced
 * motion, that is exactly what stays on screen at full contrast.
 */
const FLOOR = 0.3;
const DURATION = 1;
const STAGGER = 0.04;
/** Overlap between groups: how long after one starts the next joins in. */
const GAP = 0.12;

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    /* Reduced motion leaves the copy alone, at full contrast. The band is
       emphasis, not information, so there is nothing to translate. */
    if (prefersReducedMotion()) return;

    /* `querySelectorAll` returns document order, and document order is the
       sequence. */
    const parts = root.querySelectorAll<HTMLElement>("[data-reveal-text]");
    if (!parts.length) return;

    const splits: SplitText[] = [];
    const groups: Element[][] = [];

    parts.forEach((el) => {
      /* Words as well as characters: the word wrappers are what stop a line
         break landing inside a word once every character is its own box. Only
         opacity animates, so nothing needs re-measuring — the browser rewraps
         the words itself when the viewport changes. */
      const split = SplitText.create(el, { type: "words,chars" });
      splits.push(split);
      groups.push(split.chars);
    });

    const ctx = gsap.context(() => {
      const everything = groups.flat();
      gsap.set(everything, { opacity: FLOOR });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          /* Start only once the reading column is on-screen. Beginning below
             the viewport spent most of the reveal before anyone could see it. */
          start: "top 82%",
          end: "bottom bottom",
          /* This catch-up belongs only to the opacity timeline, so the letters
             remain visible in transition without changing layout or the
             page's Lenis-driven scroll position. */
          scrub: 3,
        },
      });

      let at = 0;
      groups.forEach((group) => {
        tl.to(
          group,
          { opacity: 1, duration: DURATION, stagger: STAGGER, ease: "none" },
          at,
        );
        /* Advance by the group's stagger span only, not its full length, so the
           next group is already fading before this one lands. */
        at += (group.length - 1) * STAGGER + GAP;
      });
    }, root);

    return () => {
      /* Tween first, then the DOM it points at. Reverting the split first would
         leave the context holding elements that no longer exist. */
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap, SplitText } from "./gsap";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * A soft band of type that travels through the copy as it scrolls.
 *
 * Every fragment is a target in one scrubbed timeline. Because each is offset from
 * the last by a fraction of its own fade, a band of them is always mid-transition:
 * solid behind the band, a gradient inside it, and pale ahead of it. Scroll moves the
 * band forward, scrolling back moves it out.
 *
 * `FLOOR` is where a fragment starts, and it is not zero. Text that fades up from
 * nothing has a hard edge at the front of the band — a wall the copy stops at — and it
 * hides words from anyone who has not scrolled far enough. Starting at 0.3 means unread
 * copy is present but quiet, the band has no edge, and the effect reads as writing
 * coming into focus rather than as text being switched on.
 *
 * `ease: "none"`, because a scrubbed timeline should borrow its curve from the scroll.
 * Any other ease makes the band accelerate on its own, which reads as the page lagging
 * the wheel. The same argument is why `scrub` defaults to exact tracking rather than to
 * a catch-up value — see the prop.
 *
 * The timeline is assembled with explicit positions rather than one long staggered
 * tween, for two reasons. Sequence becomes a fact rather than an emergent property of
 * a 400-target stagger — the earlier version let the copy after the band render solid,
 * which gave the whole thing away. And the start state is a plain `gsap.set` instead
 * of a `from`, so nothing depends on immediate-render behaviour.
 *
 * Groups overlap deliberately: each one begins as the previous one is still finishing,
 * so the band crosses a paragraph break without stopping.
 *
 * Mark any element inside with `data-reveal-text` to put it in the band. They are
 * collected in document order, so the band travels in reading order, and anything left
 * unmarked simply stays at full contrast — which is the right treatment for a heading
 * you navigate by and for a closing line too short to be worth crossing.
 *
 * Accessibility: SplitText's `aria: "auto"` default puts the original string on the
 * split element as a label and hides the fragments, so assistive technology reads
 * sentences rather than spelling them out. The split runs after mount, so the server
 * sends plain paragraphs — and with no JavaScript, or with reduced motion, that is
 * exactly what stays on screen at full contrast.
 */
const FLOOR = 0.3;
const DURATION = 1;

/**
 * What the band is made of, and how wide it is in those units.
 *
 * `stagger / DURATION` is the share of its own fade each fragment is offset by, so the
 * inverse is the width of the band. That inverse is why the two units cannot share a
 * number: a paragraph holds hundreds of characters and only tens of words, so the
 * character band is 25 fragments wide at 0.04 while the same value across words would
 * be wider than the whole quotation and everything would simply fade at once.
 *
 * `chars` dissolves prose — the band is finer than a word, so the effect is a focus
 * pull and no single word is ever the subject.
 *
 * `words` is the other reading of the same idea, and it suits a short statement where
 * each word is worth arriving on its own. Three and a bit words in the band at a time:
 * narrow enough that you can see them land in order, wide enough that it is a band and
 * not a teleprompter.
 *
 * `gap` is the overlap between groups, in the same units, so a group starts while the
 * one before it is still resolving.
 */
const BAND = {
  chars: { stagger: 0.04, gap: 0.12 },
  words: { stagger: 0.3, gap: 0.3 },
} as const;

/**
 * The widest viewport that counts as narrow, in px — one below `lg`.
 *
 * `lg` rather than `sm`, because the thing that breaks the default window is a
 * reading column taller than the viewport, and that is still true of a tablet.
 */
const NARROW_MAX = 1023;

export function Reveal({
  children,
  className,
  unit = "chars",
  start = "top 85%",
  end = "bottom 60%",
  narrowStart,
  narrowEnd,
  scrub = true,
}: {
  children: ReactNode;
  className?: string;
  /** What the band is made of. Prose wants `chars`; a short statement wants `words`. */
  unit?: keyof typeof BAND;
  /**
   * The scroll window the band is spread across, as ScrollTrigger strings.
   *
   * The defaults are written so the distance grows with the element rather than
   * shrinking, because the obvious pair does the opposite. `top 82%` to
   * `bottom bottom` gives a range of `H - 0.18 * vh`: it is generous for a tall
   * column, worthless for anything near a fifth of the viewport, and *negative* for
   * anything shorter — the end boundary sits above the start, so the whole band is
   * spent in one wheel movement and the copy appears to switch on rather than resolve.
   *
   * `top 85%` to `bottom 60%` gives `0.25 * vh + H`, which is always positive, never
   * degenerate, and about 725px for a reading column at a laptop height. It also
   * finishes with the element still fully on screen, so the last fragment lands
   * somewhere the reader is looking.
   */
  start?: string;
  end?: string;
  /**
   * The same window, for viewports below `lg`, where the default pair inverts.
   *
   * The defaults above are built on the assumption that finishing at `bottom 60%`
   * leaves the element on screen. That holds while the element is shorter than the
   * viewport and fails the moment it is taller — and a reading column is taller
   * than a phone. At `H = 800` on an 800px screen, `bottom 60%` is not reached
   * until the column's *top* sits 320px above the top of the window, so the last
   * words resolve after the reader has scrolled past them and the copy reads as
   * permanently half-lit.
   *
   * Narrow viewports therefore get a window that ends against the top of the
   * screen instead of the bottom of the element: `top 200px` is the column's top
   * arriving 200px down, and since the panel puts 112px of its own padding above
   * that column, it is the card's top edge arriving at about 88px — level with the
   * nav. The band is finished by the time the section reaches the chrome.
   *
   * The trade is real and is the right way round: on a screen this size the band
   * cannot both finish before the top leaves and still resolve each word as the
   * reader arrives at it, because the column does not fit. Copy that is legible
   * early beats copy that is grey when read.
   *
   * Left unset, both fall back to `start` and `end`, so a short element — the
   * quotation, which does fit — keeps one window at every width.
   */
  narrowStart?: string;
  narrowEnd?: string;
  /**
   * `true` to track scroll position exactly, or a number of seconds of catch-up.
   *
   * Leave it alone. A number is available because ScrollTrigger offers it, but nothing
   * on this page should use one: Lenis is already interpolating the scroll position in
   * the shared ticker, so a numeric scrub is a second smoothing stage in series with
   * the first. Two stages settle at different rates, and on a direction reversal they
   * unwind against each other — a three-second catch-up takes about that long to stop
   * disagreeing with the page, which reads as the section shaking rather than as
   * smoothing. `Lift` and `AboutMesh` both already track the scroll directly, and
   * `AboutMesh` records the same reasoning.
   */
  scrub?: boolean | number;
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

    const { stagger, gap } = BAND[unit];
    const splits: SplitText[] = [];
    const groups: Element[][] = [];

    parts.forEach((el) => {
      /* Do not create character nodes for a word reveal. Unused nested spans
         still enlarge style and paint work on every scroll frame. */
      const split = SplitText.create(el, {
        type: unit === "words" ? "words" : "words,chars",
      });
      splits.push(split);
      groups.push(unit === "words" ? split.words : split.chars);
    });

    const build = (from: string, to: string) => {
      const everything = groups.flat();
      gsap.set(everything, { opacity: FLOOR });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: from, end: to, scrub },
      });

      let at = 0;
      groups.forEach((group) => {
        tl.to(group, { opacity: 1, duration: DURATION, stagger, ease: "none" }, at);
        /* Advance by the group's stagger span only, not its full length, so the
           next group is already fading before this one lands. */
        at += (group.length - 1) * stagger + gap;
      });
    };

    /* `gsap.matchMedia` rather than a query read once at mount. It rebuilds the
       timeline when the query flips and reverts the old one itself, which is what
       makes both ranges correct on a device that rotates — and rotation is the one
       viewport change this project does not otherwise handle, since
       `ScrollTrigger` is configured not to refresh on resize. */
    const mm = gsap.matchMedia();
    mm.add(`(min-width: ${NARROW_MAX + 1}px)`, () => build(start, end));
    mm.add(`(max-width: ${NARROW_MAX}px)`, () =>
      build(narrowStart ?? start, narrowEnd ?? end),
    );

    return () => {
      /* Tween first, then the DOM it points at. Reverting the split first would
         leave the context holding elements that no longer exist. */
      mm.revert();
      splits.forEach((split) => split.revert());
    };
  }, [unit, start, end, narrowStart, narrowEnd, scrub]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

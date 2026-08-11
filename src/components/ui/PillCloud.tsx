"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { Pill } from "@/components/ui/Pill";
import { gsap } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/scroll";
import { useIsomorphicLayoutEffect } from "@/components/motion/use-isomorphic-layout-effect";

/**
 * The lesson subjects: two terms to a row, each row stepped, each pair filling the
 * width it is given.
 *
 * The markup stays one flat wrapped list. Eight terms are a list of eight, not four
 * groups of two, so a row per element would put a grouping into the document that
 * does not exist in the content. Equal grid columns were the other option, and they
 * would hand "Market news" the same width as "Duolingo-style lessons" — the gap
 * beside the short term simply moves inside it. So the pairing is done with three
 * properties on the terms themselves:
 *
 *   a minimum width of just over a third, so three can never share a line;
 *   `flex-grow`, so the two on a line divide what is left over and stay in
 *   proportion to their labels — the longer term keeps the longer pill;
 *   a per-row inset, so the rows step sideways instead of stacking flush.
 *
 * All three wait until the list itself is 672px wide. That is a container query and
 * not a breakpoint because this panel is 62% of the section's grid at `lg` and the
 * whole width of it once the grid stacks, so the viewport says nothing useful about
 * how much room the terms have — at 1280px the panel is narrower than it is at
 * 1000px. Below that width the terms keep their own widths and centre, because two
 * of these labels side by side would each be wrapping onto three lines.
 *
 * Two motions, kept on separate properties so they cannot overwrite each other: the
 * entrance on `y`, the parallax on `yPercent`. GSAP tracks those as separate values
 * in one matrix, so a scrubbed drift and a played fall can run on the same element
 * at once. Doing both on `y` would mean the last tween to render wins, which is how
 * this kind of effect usually ends up jittering.
 *
 * There is no resting tilt any more. A degree or two read as set down by hand while
 * the pills were small and content-width; at three times that width the same angle
 * lifts a corner by 17px, the rows stop being parallel to the panel they sit in, and
 * it reads as a mistake rather than a hand. The step between rows carries that job.
 */

/** Row insets, as a percentage of the list's own width: how far the row starts in
 *  from the left, and how far short of the right it stops. Cycled, and each pair
 *  totals 8, so every row is the same length and only its position moves — 0, 8, 3,
 *  6 — which steps irregularly without looking random.
 *
 *  Percentages rather than the 4px spacing base, deliberately. This is a
 *  compositional offset that has to hold its proportion while the panel goes from
 *  672px to past 1400px wide, not spacing between two objects.
 *
 *  Deterministic for the same reason it always was: a random value per render would
 *  differ between the server and the client and re-shuffle on every navigation. */
const ROW_INSETS = [
  [0, 8],
  [8, 0],
  [3, 5],
  [6, 2],
] as const;

export function PillCloud({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useIsomorphicLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;

    /* Reduced motion keeps the arrangement and drops both motions. The rows are the
       design; the fall is decoration. */
    if (prefersReducedMotion()) return;

    const pills = gsap.utils.toArray<HTMLElement>("li", list);
    if (!pills.length) return;

    const ctx = gsap.context(() => {
      /* The fall. Once, when the panel arrives: each pill drops from above and
         settles, one after another. `power3.out` lands it — a linear or ease-in
         fall arrives at full speed and reads as a cut rather than a landing.
         `from` means the offset state is applied at runtime, so if this never runs
         the pills are simply in place. */
      gsap.from(pills, {
        y: -130,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.055,
        scrollTrigger: { trigger: list, start: "top 88%", once: true },
      });

      /* The drift. Rates vary by a fifth either side of the middle, so the rows
         separate slightly as they travel instead of moving as one slab.
         Deliberately small: rows are 24px apart, and the widest rate gap between
         two pills sharing a column is 0.4, which at 22% of a 78px pill closes them
         by about 7px at one end of the scroll and opens them by the same at the
         other. Nothing touches. */
      const rate = (i: number) => 0.8 + (i % 3) * 0.2;
      gsap.fromTo(
        pills,
        { yPercent: (i: number) => -22 * rate(i) },
        {
          yPercent: (i: number) => 22 * rate(i),
          ease: "none",
          scrollTrigger: {
            trigger: list,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }, list);

    return () => ctx.revert();
  }, []);

  return (
    /* `@container` here rather than on the panel in `Product`: the terms are
       responding to the width of their own list, and putting the query container on
       the element that owns the arrangement keeps the two from being declared in
       separate files. A container query with no container ancestor evaluates false,
       so the terms degrade to their centred, content-width state. */
    <ul
      ref={ref}
      className={cn("@container flex flex-wrap justify-center", className)}
    >
      {items.map((item, i) => {
        const [lead, trail] = ROW_INSETS[Math.floor(i / 2) % ROW_INSETS.length];
        /* An odd term at the end of the list has no partner. It keeps its content
           width and centres, because a lone pill with `grow` would stretch across
           the entire row. */
        const alone = i % 2 === 0 && i === items.length - 1;

        return (
          <Pill
            key={item}
            style={
              {
                "--pill-lead": `${lead}%`,
                "--pill-trail": `${trail}%`,
              } as CSSProperties
            }
            className={cn(
              "@2xl:ms-[var(--pill-lead)] @2xl:me-[var(--pill-trail)]",
              /* 38% is the whole mechanism: two of these plus the 24px gap and the
                 8% inset come to 87% of the row, and a third cannot fit. */
              !alone && "@2xl:min-w-[38%] @2xl:grow",
            )}
          >
            {item}
          </Pill>
        );
      })}
    </ul>
  );
}

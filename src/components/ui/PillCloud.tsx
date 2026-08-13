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
 * beside the short term simply moves inside it. So the pairing is done with two
 * properties on the terms themselves:
 *
 *   a minimum width of just over a third, so three can never share a line;
 *   a per-row inset, so the rows step sideways instead of stacking flush.
 *
 * Above that minimum each pill takes its own label's width. `flex-grow` used to
 * divide the row between the pair instead, and it had to go: it decided the pill and
 * left the label to fit, and the label does not fit. A stretched pill holds the
 * longest of these terms on one line only once the list passes about 637px, and the
 * list is 527px at `lg` and 476px on a large phone — so the majority of the terms
 * were setting on two lines at the majority of widths. Sizing the pill from the label
 * puts the dependency the right way round, and the row keeps the ragged proportional
 * look it is drawn with, the longer term simply holding the longer pill.
 *
 * What that costs is a row that no longer reaches both edges. The inset is what makes
 * that read as composition rather than as slack.
 *
 * All three apply at every width, and the arrangement is the same object on a phone
 * as on a desktop — only the pill's own size steps, which `Pill` handles.
 *
 * They used to wait until the list was 672px wide, and that threshold was wrong
 * twice over. It dropped the composition on every phone and tablet, which is the
 * visible half. The less visible half is that it dropped it on most desktops too:
 * this panel is 62% of the section's grid at `lg`, so its content box is about 527px
 * at 1024px and 532–660px while the grid is stacked — all under 672px. The rows only
 * ever stepped past roughly a 1240px viewport, which is not what the arrangement was
 * drawn for.
 *
 * The measurement is still a container query rather than a breakpoint, and that part
 * was always right: the viewport says nothing useful about how much room the terms
 * have, since at 1280px this panel is narrower than it is at 1000px.
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
              "ms-[var(--pill-lead)] me-[var(--pill-trail)]",
              /* A floor and nothing else. 38% is what caps the row at two: three of
                 them plus the gaps come to more than the row, so a third can never
                 join. Above the floor each pill takes its label's own width.
     
                 It is deliberately not `grow`, and no longer `basis` either. Both of
                 those make the pill a fixed share of the row and hand the label
                 whatever is left, which inverts the dependency — the label then has
                 to fit the pill. It does not fit: a stretched pill holds the longest
                 term on one line only once this list passes about 637px, and the list
                 is 527px at `lg` and 476px on a large phone, so five of eight terms
                 wrapped to two lines at nearly every width.
     
                 Content width reverses it. The pill is as wide as its label needs, so
                 the label is always on one line and the row keeps the ragged,
                 proportional look it is drawn with — the longer term simply has the
                 longer pill. The cost is that a row no longer fills its width, which
                 is what the inset above is for. */
              !alone && "min-w-[38%]",
            )}
          >
            {item}
          </Pill>
        );
      })}
    </ul>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { gsap } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/scroll";
import { useIsomorphicLayoutEffect } from "@/components/motion/use-isomorphic-layout-effect";

/**
 * The markets and the venue, as objects in the margins of the About section.
 *
 * Decorative in the accessibility sense and not in the design sense: these are
 * BTC, ETH, SOL and Pacifica, which is exactly what the section's closing line
 * names. The mesh is the scope drawn instead of stated, so it carries no alt
 * text and adds no information a screen reader would miss.
 *
 * Eight renders, two of each subject, one of each variant — the pairs are
 * different camera angles, and the two halves of a pair sit on opposite sides of
 * the column so neither reads as a repeat. Each object lives in a side margin
 * and is clipped by the panel's own rounded edge, so it can sit half off the
 * page the way a physical thing would. None of them enters the reading column at
 * either end of its travel.
 *
 * They load from `3d_mesh/`, which is built from the original renders by
 * `scripts/build-mesh-assets.mjs`: five of the eight ship on an opaque plate,
 * white or cream, which would read as a square on this pale panel. The originals
 * stay in `3d_iconstoken/` and `3d_brandicons/` as the source material, the same
 * arrangement `public/fonts` has with the WOFF2 builds.
 */

/**
 * Home is where CSS puts each object, and home is the spread state.
 *
 * `from` is the offset it starts at, pointing back toward the column, so the
 * mesh is compact when the section arrives and opens outward as it scrolls in.
 * Declaring it this way round is what makes the layer safe: with no JavaScript,
 * with reduced motion, or before the scroll listener attaches, every object is
 * already at its final, clear position rather than sitting over the text.
 *
 * The travel is horizontal, plus scale. It could fan vertically too, and it
 * does not, because objects a quarter of the panel apart in a four-deep column
 * would then converge into each other at the compact end. Sideways they only
 * ever move within their own band, and the size sold the expansion anyway.
 *
 * Every source is a 512px square, so the size below is a real rendered size
 * rather than a crop of one.
 */
const MESH = [
  // Left, top to bottom.
  {
    src: "/assets/3d_mesh/btc_1.png",
    size: 148,
    home: "left-[2%] top-[6%]",
    from: 36,
  },
  {
    src: "/assets/3d_mesh/sol_2.png",
    size: 104,
    home: "left-[5%] top-[30%]",
    from: 30,
  },
  {
    src: "/assets/3d_mesh/eth_1.png",
    size: 132,
    home: "left-[1%] top-[54%]",
    from: 40,
  },
  {
    src: "/assets/3d_mesh/pacifica_2.png",
    size: 92,
    home: "left-[6%] bottom-[6%]",
    from: 26,
  },

  // Right, top to bottom. Each subject's other angle, so no pair shares a side.
  {
    src: "/assets/3d_mesh/eth_2.png",
    size: 120,
    home: "right-[3%] top-[6%]",
    from: -34,
  },
  {
    src: "/assets/3d_mesh/pacifica_1.png",
    size: 100,
    home: "right-[7%] top-[30%]",
    from: -28,
  },
  {
    src: "/assets/3d_mesh/btc_2.png",
    size: 152,
    home: "right-[1%] top-[54%]",
    from: -40,
  },
  {
    src: "/assets/3d_mesh/sol_1.png",
    size: 116,
    home: "right-[6%] bottom-[6%]",
    from: -30,
  },
] as const;

export function AboutMesh() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    /* Reduced motion keeps the spread layout and drops the travel entirely.
       Nothing is lost: the composition is the point, the movement is the
       flourish. */
    if (prefersReducedMotion()) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-mesh]", root);
    if (items.length !== MESH.length) return;

    const ctx = gsap.context(() => {
      /* One timeline and one trigger for all three, rather than a trigger each:
         the objects move together, so they should be measured together.

         `scrub` ties progress to scroll position, which is what makes scrolling
         back shrink the mesh again — the tween has no direction of its own. The
         0.8 is a catch-up delay, so a flicked wheel does not snap the objects to
         a new position in one frame. `ease: "none"` because anything else would
         make a scrubbed animation lag the scroll it is bound to. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.parentElement ?? root,
          start: "top bottom",
          end: "center center",
          scrub: 0.8,
        },
      });

      items.forEach((el, i) => {
        tl.fromTo(
          el,
          { x: MESH[i].from, scale: 0.84 },
          { x: 0, scale: 1, ease: "none", duration: 1 },
          0,
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    /* Hidden below `xl`. Under about 1280px the centred column leaves no margin
       to hold an object without crowding the text, and a decorative layer that
       does not fit should not be forced to. */
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden xl:block"
    >
      {MESH.map(({ src, size, home }) => (
        <Image
          key={src}
          data-mesh
          src={src}
          alt=""
          width={size}
          height={size}
          className={cn("absolute will-change-transform", home)}
        />
      ))}
    </div>
  );
}

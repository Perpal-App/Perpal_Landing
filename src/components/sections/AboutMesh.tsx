"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { gsap } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/scroll";
import { useIsomorphicLayoutEffect } from "@/components/motion/use-isomorphic-layout-effect";

/**
 * The markets and the venue, scattered around the About section.
 *
 * Decorative in the accessibility sense and not in the design sense: these are
 * BTC, ETH, SOL and Pacifica, which is exactly what the section's closing line
 * names. The mesh is the scope drawn instead of stated, so it carries no alt
 * text and adds no information a screen reader would miss.
 *
 * Eight renders, two of each subject, one of each variant — the pairs are
 * different camera angles, and no pair shares a quadrant. They load from
 * `3d_mesh/`, which is built from the original renders by
 * `scripts/build-mesh-assets.mjs`: five of the eight ship on an opaque plate,
 * white or cream, which would read as a square on this pale panel. The originals
 * stay in `3d_iconstoken/` and `3d_brandicons/` as the source material, the same
 * arrangement `public/fonts` has with the WOFF2 builds.
 */

type MeshObject = {
  src: string;
  /** Rendered size in px. Every source is a 512px square. */
  size: number;
  /** Position, anchored to the panel's own edges. */
  home: string;
  /** Travel across the scroll: px, then growth, then tilt in degrees. */
  to: { x: number; y: number; scale: number; rotate: number };
};

/**
 * Eight positions, anchored to the panel's edges rather than to its centre.
 *
 * The arrangement is a scatter, not a ring. A single radius reads as a rail the
 * moment you can see all of it at once, and anchoring to the centre left the
 * panel's outer bands empty at every width — the objects could not reach an edge
 * they were not measured from. Anchored to the edges instead, four of the eight
 * bleed past one, so the composition runs out of the panel rather than stopping
 * short of it.
 *
 * How it avoids reading as symmetrical, given three objects a side:
 *
 *   Insets all differ, so no object is the mirror of anything opposite.
 *   No object is level with one on the other side; the bands interleave.
 *   All eight sizes differ.
 *   The object above the copy is left of the axis and the one below it is right
 *   of the axis, so the two off-axis positions do not line up either.
 *
 * Six of the eight stay whole for the entire scroll, and only `eth_1` and
 * `btc_2` cross an edge — one a side, both around a quarter cut at the very end
 * of their travel. That is a budget, not a guess: an object's inset has to cover
 * its own travel plus the half-size its scale and tilt add, or it ends up cropped
 * at the end of the range even though it looked fine at rest.
 *
 * That budget is why the movement is mostly *down* rather than outward. Sideways
 * travel is capped by the panel edge at a few dozen pixels, but the panel is
 * around 700px tall and these objects have their own column of it, so they can
 * fall 40–150px without approaching anything. The magnitudes rise with depth on
 * each side, so the gaps between neighbours open as they fall instead of closing.
 * Falling while the page rises is also what makes the movement register: it reads
 * as parallax against the scroll rather than as drift with it.
 *
 * The tilt is the other half. Rotation is the cheapest visible movement
 * available — a 16 degree turn is unmistakable on an object with this much
 * specular detail, and costs about 20px of bounding box, where the same
 * legibility in translation would cost 150px the panel does not have.
 *
 * Placement is in percentages, which is also what keeps the geometry safe. The
 * text is a fixed measure — the prose at 46ch is about 506px, so copy never
 * passes 253px either side of the axis — while the panel only gets wider, so the
 * share of it the text occupies shrinks. Anything that clears the column at
 * 1280px clears it by more at every width above, and the same holds for the
 * panel edges.
 *
 * No object's horizontal band ever reaches the copy, at rest or at the end of
 * its travel, which is what makes a fall this long safe: vertical position stops
 * mattering once an object is 200px clear of the text either side. The two that
 * do share the copy's horizontal band — the one above it and the one below —
 * are the two that barely move vertically at all.
 */
const MESH: readonly MeshObject[] = [
  /* Above the copy. It shares the copy's horizontal band, so it cannot fall —
     the padding above the text is all the vertical room it has. It crosses the
     panel instead, which is the longest clear run of the eight. */
  {
    src: "/assets/3d_mesh/btc_1.png",
    size: 124,
    home: "left-[21%] top-[3%]",
    to: { x: -90, y: 0, scale: 1.16, rotate: -12 },
  },

  // Left, top to bottom. The fall gets longer with depth, so the two gaps
  // between them open rather than close.
  {
    src: "/assets/3d_mesh/sol_2.png",
    size: 100,
    home: "left-[4%] top-[4%]",
    to: { x: -20, y: 130, scale: 1.12, rotate: 20 },
  },
  // Exempt: crosses the left edge, about a quarter cut at the end of its travel.
  {
    src: "/assets/3d_mesh/eth_1.png",
    size: 140,
    home: "left-[-1%] top-[26%]",
    to: { x: -10, y: 150, scale: 1.12, rotate: -12 },
  },
  // Shortest fall on this side: it starts lowest, so it has the least floor left.
  {
    src: "/assets/3d_mesh/pacifica_2.png",
    size: 92,
    home: "left-[3%] bottom-[11%]",
    to: { x: -14, y: 40, scale: 1.1, rotate: 16 },
  },

  // Right, top to bottom. Each subject's other angle, and none of these bands
  // matches one on the left.
  {
    src: "/assets/3d_mesh/eth_2.png",
    size: 112,
    home: "right-[6%] top-[10%]",
    to: { x: 40, y: 110, scale: 1.12, rotate: -18 },
  },
  // Exempt: the right-hand counterpart, and the larger of the two.
  {
    src: "/assets/3d_mesh/btc_2.png",
    size: 148,
    home: "right-[-1%] top-[32%]",
    to: { x: 10, y: 140, scale: 1.1, rotate: 12 },
  },
  {
    src: "/assets/3d_mesh/sol_1.png",
    size: 104,
    home: "right-[5%] bottom-[15%]",
    to: { x: 30, y: 70, scale: 1.09, rotate: -14 },
  },

  /* Below the copy, and in its horizontal band, so this one runs sideways too —
     out toward the corner the right-hand column leaves empty. */
  {
    src: "/assets/3d_mesh/pacifica_1.png",
    size: 96,
    home: "left-[60%] bottom-[7%]",
    to: { x: 150, y: 20, scale: 1.06, rotate: 18 },
  },
];

export function AboutMesh() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    /* Reduced motion keeps the arrangement and drops the drift entirely.
       Nothing is lost: the composition is the point, the movement is the
       flourish. */
    if (prefersReducedMotion()) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-mesh]", root);
    if (items.length !== MESH.length) return;

    const ctx = gsap.context(() => {
      /* One timeline and one trigger for all eight, rather than a trigger each:
         the objects move together, so they should be measured together.

         The range is the section's whole pass across the viewport, so the mesh
         is still opening while the section is being read — half spread when it
         is centred — instead of finishing before it arrives and then sitting
         still. That is the difference between motion you notice and motion you
         miss.

         `scrub` ties progress directly to scroll position, which is what makes
         scrolling back close the mesh again. Lenis already supplies smoothing
         in the shared GSAP ticker, so another catch-up tween here would only
         make the objects trail the page. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.parentElement ?? root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      items.forEach((el, i) => {
        tl.to(el, { ...MESH[i].to, ease: "none", duration: 1 }, 0);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    /* Hidden below `xl`. Under about 1280px the panel is not wide enough to hold
       objects outside the reading column, and a decorative layer that does not
       fit should not be forced to. */
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

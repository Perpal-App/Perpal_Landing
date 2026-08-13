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
  /**
   * The object's size at a 1280px viewport, in px — the width this composition
   * was drawn at, and the ceiling of the responsive ramp rather than a fixed
   * value. Every source is a 512px square.
   */
  size: number;
  /** Position, anchored to the panel's own edges. */
  home: string;
  /**
   * Travel across the scroll: px, then growth, then tilt in degrees.
   *
   * The two pixel figures are written for the panel at 1280px and are scaled by
   * `NARROW_DRIFT` below that — see the note where the timeline is built. Growth
   * and tilt are not scaled, being relative to the object rather than to the panel.
   */
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
 * text is a bounded measure, while the panel only gets wider, so the share of it
 * the text occupies shrinks. Anything that clears the column at 1280px clears it
 * by more at every width above, and the same holds for the panel edges.
 *
 * Downward, that argument runs out, and it is worth being precise about where.
 * This used to be hidden below `xl` for exactly that reason. It now renders at
 * every width, on one size ramp — see the `style` on the image — because a scope
 * drawn instead of stated should not be a thing only desktop readers are told.
 *
 * Horizontally there is nothing to buy at a narrow width. At 320px the panel is
 * 300px and the reading column takes 260 of them, so there is no band beside the
 * text for an object to stand in — a percentage that clears the copy at 1280px
 * cannot clear it here, and four of the eight had to be re-placed rather than
 * merely scaled.
 *
 * Vertically there is room, and that is what the mobile arrangement uses. The
 * panel's own `py-28` is a 112px band top and bottom with no copy in it, so an
 * object inside one is clear of the text at any height the copy takes. Below `xl`:
 *
 *   `eth_2` lifts into the upper band, to `top-[2%]`, and stays whole. It was
 *   sitting level with the first line of copy with no edge to hide behind.
 *
 *   `sol_1` drops into the lower band and moves off the corner, to
 *   `left-[24%] bottom-[4%]`. The corner was the problem rather than the height:
 *   `pacifica_1` drifts rightward into it, and two objects arriving at the same
 *   place is what the overlap was. The band now reads at roughly 3%, 24% and 60%,
 *   which is a scatter; 50% would have given a composition that is not meant to
 *   have an axis one anyway.
 *
 *   `eth_1` and `btc_2` stay in the copy's band, because being the pair that
 *   crosses it is their whole role, and crop against the edge instead — at a fixed
 *   `-2.5rem` rather than a percentage. A percentage inset scales with the panel,
 *   which is how an earlier `-18%` came to be -101px on a 556px panel and put a
 *   73px object completely outside it. The object did not crop, it vanished. A fixed
 *   offset leaves the same visible sliver at every width.
 *
 *   The other four are already inside a band at every width and keep their
 *   placement. What changes for all eight is the travel, which is scaled by
 *   `NARROW_DRIFT`: the pixel figures are measured against a 1260px panel, and left
 *   unscaled on a 556px one they were large enough to carry objects out of the
 *   bands they had just been placed in.
 *
 * The reading column carries `relative` regardless, so it paints above the mesh
 * and the copy is never the thing that gets covered.
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
    /* An edge accent below `xl`, and the offset is in rem rather than per cent for
       a reason worth keeping: a percentage inset scales with the panel, so the
       `-18%` this used to carry was -101px on a 556px panel and put a 73px object
       entirely outside it. The object vanished instead of cropping. A fixed -2.5rem
       leaves about 33px of a 73px coin showing at every width, which is a crop
       rather than a disappearance. */
    home: "left-[-2.5rem] top-[26%] xl:left-[-1%]",
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
    /* Lifted into the panel's top padding below `xl` rather than cropped. At 10%
       of a phone-height panel this sat level with the first line of copy and 56px
       inside the column; at 2% it is inside the 112px band that holds no text at
       all, so it stays whole and stops competing. */
    home: "right-[6%] top-[2%] xl:top-[10%]",
    to: { x: 40, y: 110, scale: 1.12, rotate: -18 },
  },
  // Exempt: the right-hand counterpart, and the larger of the two.
  {
    src: "/assets/3d_mesh/btc_2.png",
    size: 148,
    /* The right-hand counterpart, cropped by the same fixed offset and for the same
       reason — about 37px of a 77px coin left against the panel's radius. */
    home: "right-[-2.5rem] top-[32%] xl:right-[-1%]",
    to: { x: 10, y: 140, scale: 1.1, rotate: 12 },
  },
  {
    src: "/assets/3d_mesh/sol_1.png",
    size: 104,
    /* Off the bottom-right corner below `xl`, and anchored from the left instead —
       `pacifica_1` drifts rightward into that corner, and two objects arriving at
       the same place is what the overlap was.
     
       24% is left of centre without being central: the three objects in the lower
       band then read at roughly 3%, 24% and 60%, which is a scatter. Putting it at
       50% would have made it the axis of a composition that is not meant to have
       one. `xl:left-auto` is required — without it the desktop `right` and the
       mobile `left` would both apply and fight. */
    home: "left-[24%] bottom-[4%] xl:left-auto xl:right-[5%] xl:bottom-[15%]",
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

/**
 * The widest viewport that gets the narrow arrangement, in px — one below `xl`.
 *
 * `xl` because that is the breakpoint the `home` overrides above are written
 * against, and the placement and the travel have to change together: scaled-down
 * translations against desktop positions would leave objects short of the edges
 * they are measured from, and desktop translations against the narrow positions are
 * what caused the overlap in the first place.
 */
const NARROW_MAX = 1279;

/**
 * How much of the designed travel survives below `xl`.
 *
 * 0.4 rather than a proportion of the panel width, because the objects also stop
 * shrinking at their floor — travel that scaled linearly with the panel would keep
 * falling while the objects did not, and the composition would come apart at the
 * bottom of the range. A flat fraction keeps the two roughly in step.
 */
const NARROW_DRIFT = 0.4;

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

    const build = (factor: number) => {
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
        const { x, y, scale, rotate } = MESH[i].to;
        /* Only the translations scale. `scale` and `rotate` are already relative to
           the object, so they read the same at any panel width and shrinking them
           would only make the movement disappear on the screens that have the least
           of it. */
        tl.to(
          el,
          { x: x * factor, y: y * factor, scale, rotate, ease: "none", duration: 1 },
          0,
        );
      });
    };

    /* The translations are written for a 1260px panel and have to be scaled down
       for a narrower one, because they are pixels against a box that is not.
       `pacifica_1` travels 150px, which is 12% of a desktop panel and 27% of a
       556px one — enough to walk it out of its own column and into the corner
       `sol_1` occupies, which is exactly the overlap that showed up at the bottom.
       At 0.4 it moves 60px, and every object stays in the band it was placed in.

       `gsap.matchMedia` rather than a query read once, so a rotation rebuilds the
       timeline at the right amplitude and reverts the old one — the same reason
       `Reveal` uses it. */
    const mm = gsap.matchMedia();
    mm.add(`(min-width: ${NARROW_MAX + 1}px)`, () => build(1));
    mm.add(`(max-width: ${NARROW_MAX}px)`, () => build(NARROW_DRIFT));

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      {MESH.map(({ src, size, home }) => (
        <Image
          key={src}
          data-mesh
          src={src}
          alt=""
          width={size}
          height={size}
          /* The rendered width is a clamp derived from the desktop size rather
             than the size itself, so every object scales on one ramp and the
             arrangement keeps its proportions at any width.

             The ceiling is the desktop size. The slope is `size / 12.8` per vw,
             which is what makes the object reach exactly that size at a 1280px
             viewport — the width this composition was drawn at. The floor is 52%
             of it, and a floor is the right shape for this rather than letting the
             ramp run to zero: below roughly 65px these renders stop being a coin
             or a phone and become a smudge, and a smudge is not the scope drawn
             instead of stated. So the objects scale from about 660px upward and
             hold a legible minimum below it.

             `h-auto` with the intrinsic `width`/`height` still on the element
             keeps them square, so the ratio comes from the file rather than from
             a second number written here. `sizes` is the ceiling, because that is
             the largest the object is ever drawn. */
          sizes={`${size}px`}
          style={{
            width: `clamp(${Math.round(size * 0.52)}px, ${(size / 12.8).toFixed(2)}vw, ${size}px)`,
          }}
          className={cn("absolute h-auto will-change-transform", home)}
        />
      ))}
    </div>
  );
}

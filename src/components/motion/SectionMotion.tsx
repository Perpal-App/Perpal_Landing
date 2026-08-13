"use client";

import { gsap, REVEAL_START } from "./gsap";
import { prefersReducedMotion } from "./scroll";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * Half the parallax swing, in pixels. Also the padding budget each section gets,
 * and also the width of the matte between plates — the three are the same number
 * on purpose, and the reason is under "The seam" below. The CSS half of it is the
 * `[data-parallax]` rule in globals.css, which cannot read this constant, so the
 * two are cross-referenced the way the opening's beats are.
 */
const AMPLITUDE = 10;

/** The arrival fade. Long enough to register on a large plate, short of a wipe. */
const ARRIVAL = 0.7;

/**
 * What every section does on scroll: arrive, then drift.
 *
 * Mark a section with `data-parallax` and its element children — the plate, or the
 * grid of plates — get both behaviours:
 *
 *   Arrival. The plate fades up once, as it crosses `REVEAL_START`. Opacity only,
 *   and that is a constraint rather than a preference: the drift below owns this
 *   element's `y` for the whole of its pass, so an arrival that also moved it
 *   would be two tweens writing one matrix. The rise on arrival is already there
 *   at the layer below — `Lift` raises the heading and copy *inside* the plate,
 *   which is the free surface.
 *
 *   Drift. From `-AMPLITUDE` to `+AMPLITUDE` across the section's pass, downward,
 *   so a plate rises slightly slower than the page carries it and therefore reads
 *   as set back from it.
 *
 * Why this is attached by attribute from one component rather than being a wrapper
 * each section renders: a wrapper would add eight divs and, more to the point,
 * eight client boundaries. Every section on this page is a server component and
 * stays one. This is the same shape as `Lift` — one root, marked descendants —
 * moved up a level. The attribute is named for the drift because that is the
 * behaviour with layout consequences; it governs both.
 *
 * ── The seam ─────────────────────────────────────────────────────────────────
 *
 * The hard constraint is that plates butt against each other with only the 10px
 * matte between them, and differential motion between two touching panels *is*
 * that gap changing. There is no arrangement where sections move relative to one
 * another and the matte stays constant, so the matte has to be able to absorb it.
 *
 * What makes that safe rather than approximate: the section box is left exactly
 * where the flow puts it and only its children move, inside a `padding-block`
 * budget the section gains. For two adjacent sections with margin `m`, budget `P`
 * and translations `T`, the visible gap between their plates is
 *
 *   gap = m + 2P + (T_below - T_above),   with T in [-A, +A]
 *       = m + 2P + [-2A, +2A]
 *
 * so setting `P = A` gives `gap in [m, m + 4A]`. The floor is `m` — the matte the
 * page already has — and the gap can only ever open from there, never close past
 * it. At rest the matte reads at `m + 2A`.
 *
 * Two things fall out of translating the children instead of the section:
 *
 *   Anchor navigation is untouched. `#about`, `#faq` and the rest resolve against
 *   the `<section>` elements, which never move, so `lenis.scrollTo` and the
 *   `scrollMarginTop` on three of them still land where they always did.
 *
 *   Nested triggers stay honest enough. `Lift`, `Reveal`, `Parallax`, `PillCloud`
 *   and `AboutMesh` all measure boundaries inside a moving ancestor, so their
 *   progress picks up an error of `2A / range` — about 20px in 1500px, under 1.5%
 *   — and, critically, their *landing* is unaffected: `Lift` ends an element on
 *   its layout position within the plate, and the whole plate is what moved.
 *
 * ── Frame budget ─────────────────────────────────────────────────────────────
 *
 * `scrub: true`, not a catch-up value, for `Lift`'s reason: smoothing would let
 * plates trail the page, and here that trailing would be visible as the matte
 * lagging. Lenis already smooths the scroll this reads from.
 *
 * `force3D: true` rather than GSAP's `"auto"`, which drops the z once a tween
 * completes. These plates clip gradients and images against a 16px radius, and a
 * 2D transform would make the browser re-resolve that clip against the page every
 * frame — the cost `About`'s `transform-gpu` exists to avoid. Pinning the third
 * axis on keeps each plate on its own compositing layer for the whole scroll,
 * which is also what replaces the `transform-gpu` that GSAP necessarily
 * overwrites on that one plate.
 *
 * The arrival is `once: true`, so after it has played each plate is carrying one
 * scrubbed transform and a settled inline opacity. The residue is left in place
 * here, unlike on the FAQ's rows: nothing on a plate transitions in CSS, so there
 * is nothing for an inline value to interfere with.
 *
 * Reduced motion returns before anything is created, and both CSS halves — the
 * padding budget and the hidden start state — live inside a `no-preference`
 * query. With motion off the page is exactly the layout and the visibility it had
 * before any of this: same matte, same heights, nothing hidden, nothing to undo.
 */
export function SectionMotion() {
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const sections = gsap.utils.toArray<HTMLElement>("[data-parallax]");
    if (!sections.length) return;

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        /* The section's own children, so a two-plate grid moves as one object
           rather than as two panels disagreeing about where the row is. */
        const plates = Array.from(section.children) as HTMLElement[];
        if (!plates.length) return;

        gsap.fromTo(
          plates,
          { opacity: 0 },
          {
            opacity: 1,
            duration: ARRIVAL,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: REVEAL_START, once: true },
          },
        );

        gsap.fromTo(
          plates,
          { y: -AMPLITUDE },
          {
            y: AMPLITUDE,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}

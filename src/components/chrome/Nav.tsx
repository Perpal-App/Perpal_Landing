"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { cta } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { handleAnchorClick } from "@/components/motion/scroll";

/**
 * Floating pill header: the mark, and one action.
 *
 * The capsule hugs its contents rather than spanning the viewport, so with the
 * section links gone it reads as a deliberate object sitting on the page
 * instead of a bar that lost its middle. Pale glass with a purple action,
 * because the page under it is paper: over the hero's field it frosts, and over
 * the white sections below it holds its edge on the hairline and the shadow
 * rather than on a fill.
 *
 * Only colour and shadow respond to scroll. Animating the padding would resize
 * the capsule and shift both children every frame, which is exactly the kind of
 * movement a fixed element should never make.
 *
 * On load it opens from the middle: a short pill whose two ends run outward, with the
 * mark and the action converging on their places behind them. The box grows and
 * `overflow-clip` holds the contents inside it — a clip on the capsule itself was the
 * first attempt and it painted a pale ghost of the navbar behind the real one, for the
 * reason recorded on `nav-open`. The clip margin is there so the permanent clip cannot
 * cut a focus ring: 16px against a ring that reaches 5px.
 *
 * `backwards`, not `both`. The `from` state covers the delay and nothing is held after
 * the animation, so the capsule is left with no width bound of its own. Under reduced
 * motion all three animations collapse and the capsule is simply there.
 *
 * Those delays start at 3.15s, not 2.3s. The opening card slides upward, so the strip
 * this sits in is the last thing it uncovers — anything opening here before 3.2s opens
 * for nobody, which is exactly what the earlier timing did. The whole timeline is
 * written out in `globals.css`; three of its lines are in this file.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  /* Compact state. A threshold check in a passive listener, so the DOM is
     touched twice per page rather than on every scroll event. */
  useEffect(() => {
    let last = false;
    const onScroll = () => {
      const next = window.scrollY > 48;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* The header spans the viewport only to centre the capsule, so it must not
       swallow pointer events across the full strip. Its top padding clears the
       backdrop's inset frame, so the pill sits inside the rounded canvas
       rather than straddling its edge. */
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-gutter pt-4 sm:pt-5">
      <div
        className={cn(
          "pointer-events-auto flex animate-[nav-open_1100ms_var(--ease-expo)_3150ms_backwards] items-center gap-6 overflow-clip rounded-full border py-1 pr-1 pl-5 transition-[background-color,border-color,box-shadow] duration-500 ease-swift [overflow-clip-margin:16px] sm:gap-12 sm:pl-6",
          scrolled
            ? "border-line-strong/60 bg-paper/85 shadow-pill backdrop-blur-xl"
            : "border-line/80 bg-paper/55 backdrop-blur-md",
        )}
      >
        <a
          href="#top"
          onClick={(event) => handleAnchorClick(event, "#top")}
          /* The label lives on the link, not inside `Logo`. What this control does is
             the link's business; the lockup only knows the name. */
          aria-label="Perpal home"
          className="-m-1 animate-[nav-fill_520ms_var(--ease-swift)_3500ms_both] p-1 text-ink transition-colors duration-300 ease-swift [--nav-from:10px] hover:text-sky-deep"
        >
          {/* Sized by the lockup itself, which is measured against the mark's
              own glyph bounds. Overriding either half here would break that. */}
          <Logo markClassName="size-7" wordClassName="text-xl" />
        </a>

        {/* Pill, so the button's radius agrees with the capsule around it. The wrapper is
            only there to carry the arrival — the action has its own hover and press
            transforms, and two animations on one element is a fight over the same
            matrix. */}
        <span className="inline-flex animate-[nav-fill_520ms_var(--ease-swift)_3620ms_both] [--nav-from:-10px]">
          <Button href={cta.href} size="sm" shape="pill" magnetic={false}>
            {cta.label}
          </Button>
        </span>
      </div>
    </header>
  );
}

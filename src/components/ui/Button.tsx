"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/motion/Magnetic";
import { handleAnchorClick } from "@/components/motion/scroll";

type Variant = "solid" | "outline" | "glass";
type Size = "sm" | "md";
type Shape = "key" | "pill";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  /** `pill` when the button sits inside a rounded container, so the two
   *  radii agree. `key` everywhere else. */
  shape?: Shape;
  className?: string;
  /** Defaults to on, except for variants that hold still. */
  magnetic?: boolean;
  type?: "button" | "submit";
  "aria-label"?: string;
};

/**
 * The only button in the project.
 *
 * Every surface asks for one of these rather than styling its own, so a call
 * site chooses a variant and a size and nothing else. If a button here needs a
 * shape the props cannot express, the props are what should change.
 *
 * `solid` is a flat purple field carrying a purple-cast white label at 4.63:1,
 * with no elevation and no travel: the fill deepens on hover and again on
 * press. `glass` is the hero's raised action: a deep purple lens that stays
 * exactly where it sits, blurring the field behind it and closing to opaque on
 * hover while the label swaps inside it.
 *
 * `min-h-11` is the 44px touch floor, and it is a minimum rather than a fixed
 * height so the label can never be clipped when text wraps or scales up.
 */

/* Sentence case at a readable size, not the 11px uppercase `label` treatment
   the rest of the interface meta uses: a button is something you read, not a
   field heading. Poppins ships a real 600, so semibold is an actual cut rather
   than a synthesised one.

   No travel in the base: the fill is the affordance. Elevation, where a variant
   wants any, belongs to that variant. */
const base = [
  "group relative isolate inline-flex min-h-11 items-center justify-center",
  "overflow-hidden select-none",
  "font-ui font-semibold tracking-[-0.005em]",
  "transition-colors duration-200 ease-swift",
].join(" ");

const sizes: Record<Size, string> = {
  sm: "px-5 text-sm",
  md: "min-h-12 px-7 text-base",
};

const shapes: Record<Shape, string> = {
  key: "rounded-xl",
  pill: "rounded-full",
};

const variants: Record<Variant, string> = {
  /* The label is fully opaque. It was softened to 90%, which measured 4.08:1
     against this fill — under the floor. The 10% was the only thing failing,
     so it went rather than the colour. */
  solid: "bg-grape text-grape-ink hover:bg-grape-deep active:bg-grape-deep",
  outline: "border border-line-strong text-ink hover:border-ink",
  /* Glass, and only honest because there is a live gradient field behind it:
     `backdrop-blur` samples the actual weather rather than imitating it with a
     flat translucent wash. `shadow-bulge` supplies the curvature — highlight on
     top, shade along the bottom, drop underneath — so it reads as a raised lens
     rather than a cut-out. No border: the highlight and the drop already draw
     the edge, and a ring on top of them is the accessory to cut.

     The label is white, and that is what sets the tint. A pale `lilac/35`
     frost carried ink at better than 11:1 but puts white at roughly 1.2:1 —
     unreadable — so the glass darkened to `grape-deep` instead of the label
     getting quieter. At 90% it still samples the weather, and white on it
     measures about 5.4:1 over the lightest part of the field the button can
     land on. Hover closes the last 10%, which only raises the number. The
     shade is now a dark lens on a light page rather than frost on it, which is
     also what tells the page's one action apart from the field it sits in. */
  glass: [
    "bg-grape-deep/90 text-white shadow-bulge",
    "backdrop-blur-xl backdrop-saturate-150",
    "hover:bg-grape-deep active:bg-grape-deep",
  ].join(" "),
};

/**
 * Variants that stay where they are put.
 *
 * Glass is a raised object, and one that drifts toward the pointer stops
 * reading as one. Performance points the same way: a `backdrop-filter` layer is
 * rasterised once while it sits still and has to be re-composited the moment it
 * moves. The label still swaps on hover — that happens inside the button, so
 * the object itself never budges.
 */
const anchoredVariants: Record<Variant, boolean> = {
  solid: false,
  outline: false,
  glass: true,
};

/**
 * The label swaps on a vertical slide rather than a fade.
 *
 * Both copies are laid out up front, so the hover state costs one transform on
 * each and no layout work. 340ms is long enough to read as motion and short
 * enough that the button never feels like it is lagging the pointer.
 *
 * This is the only hover motion on the glass button, and it is contained: the
 * slide happens behind the button's own clip, so the raised object stays put.
 */
function Label({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-[340ms] ease-swift group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-[340ms] ease-swift group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

export function Button({
  children,
  href,
  onClick,
  variant = "solid",
  size = "md",
  shape = "key",
  className,
  magnetic,
  type = "button",
  ...rest
}: ButtonProps) {
  /* One source of truth: an anchored variant is not magnetic unless a call site
     insists, rather than every call site remembering to switch it off. */
  const pullsToPointer = magnetic ?? !anchoredVariants[variant];

  const classes = cn(
    base,
    sizes[size],
    shapes[shape],
    variants[variant],
    className,
  );

  const inner = href ? (
    <a
      href={href}
      onClick={(event) => href.startsWith("#") && handleAnchorClick(event, href)}
      className={classes}
      {...rest}
    >
      <Label>{children}</Label>
    </a>
  ) : (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      <Label>{children}</Label>
    </button>
  );

  if (!pullsToPointer) return inner;
  return <Magnetic className="inline-block">{inner}</Magnetic>;
}

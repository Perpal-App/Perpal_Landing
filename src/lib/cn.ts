import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told this project's type scale.
 *
 * `text-*` is two utilities wearing one prefix — a font size and a text colour —
 * so tailwind-merge decides which group a class belongs to by validating the
 * value. Its font-size validator accepts t-shirt sizes (`sm`, `2xl`) and
 * arbitrary lengths (`text-[13px]`); every other bare word falls through to the
 * colour group. A custom step like `text-d1` is a bare word, so it was filed as
 * a colour, landed in the same group as the `text-ink` beside it, and was
 * dropped as the loser of a conflict that did not exist. The hero headline came
 * out with no font-size utility on it at all, inheriting the body's 16px.
 *
 * Only the step *names* live here. The values stay in the `@theme` block in
 * globals.css and are not duplicated. A step added there needs its name added
 * here too, or it will silently lose to any colour class sitting next to it.
 *
 * `extend` appends to the built-in group rather than replacing it, so the stock
 * Tailwind sizes keep working. This is safe in both directions because no colour
 * token shares a name with a step — nothing here shadows a `--color-*`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["d0", "d1", "d2", "d3", "lead", "lead-lg", "panel", "tag"] },
      ],
    },
  },
});

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

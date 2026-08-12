import { cn } from "@/lib/cn";

/**
 * The Apple mark.
 *
 * Inline SVG on `currentColor`, like `UmbraLogo`, so it inverts with the badge
 * that carries it instead of needing a second asset for the hovered state.
 *
 * Decorative: it sits beside the words "Coming to iOS", so a screen reader that
 * announced the logo as well would say the platform twice. `aria-hidden` rather
 * than `role="img"` — the text is the accessible name.
 *
 * The glyph fills its 24-unit box top to bottom, which is why the badge renders it
 * a step smaller than the Android head: that one is a wide, short shape and needs
 * more box to carry the same optical weight.
 */
export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cn("block", className)}
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.09-.026-3.207-1.234-3.246-4.883-.026-3.052 2.49-4.52 2.61-4.585-1.442-2.13-3.675-2.376-4.44-2.415-1.83-.144-3.386 1.05-4.32 1.05zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.687.805-3.583 1.818-.804.896-1.4 2.338-1.223 3.714 1.325.104 2.716-.688 3.56-1.702" />
    </svg>
  );
}

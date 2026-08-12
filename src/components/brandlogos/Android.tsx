import { cn } from "@/lib/cn";

/**
 * The Android head.
 *
 * Drawn from geometry rather than lifted as path data, because this shape is a
 * dome, two circles and two lines, and every number in it can be checked by
 * reading it: a semicircle of radius 9.5 centred on (12, 20) with a flat jaw, eyes
 * at ±4 of centre, and antennae leaving the dome at 27° from vertical.
 *
 * The eyes are holes, not dots. `evenodd` on the same path as the dome means the
 * panel's ember ramp is what shows through them, which is the only version that
 * works on a badge with no fill of its own — a pair of painted eyes would need to
 * know the colour behind them, and behind this one the colour is a gradient.
 *
 * The head is the right mark here rather than the Play triangle. Perpal is an
 * Android client with no store listing yet, so the platform is the true claim and
 * the storefront is not.
 *
 * Decorative, for the same reason as the Apple mark: the badge says "Android"
 * beside it in words.
 */
export function AndroidLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("block", className)}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.5 20a9.5 9.5 0 0 1 19 0ZM8 13.1a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Zm8 0a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z"
      />
      {/* Started a fraction inside the dome so the round cap merges into it
          instead of leaving a seam at the joint. */}
      <path
        d="M7.8 11.8 5.6 7.4M16.2 11.8 18.4 7.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

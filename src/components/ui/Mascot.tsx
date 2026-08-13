import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The lesson's mascot, and the bubble it talks through.
 *
 * Drawn rather than fetched, and drawn from the palette: the body is `lilac`, which is
 * the violet already in the page's weather, and its face is `dusk` — the violet family's
 * ink, so the character is one hue deepening rather than a cartoon dropped onto the
 * brand. No emoji anywhere in here. An emoji is someone else's drawing, rendered by the
 * reader's operating system at a size and in a style this page does not control, and the
 * repo's own rules put it on the refuse list. The reaction is the face.
 *
 * Three moods, and each one has to be legible at 36px: eyes wide and a small round mouth
 * while it waits for an answer, eyes closed and a grin when the answer was right, a
 * downturned mouth and one tear when it was not. Nothing here carries information on its
 * own — the words in the bubble say what happened — so the whole drawing is `aria-hidden`
 * and the bubble's text is the accessible content.
 *
 * The pop is a CSS animation on mount, which means the component needs no state and stays
 * a server component. To make it pop again, change its `key`: a new key remounts it and
 * the animation replays. The caller owns that, because the caller is the only thing that
 * knows what counts as a new question. Reduced motion is handled globally — the
 * reduced-motion block in `globals.css` collapses every animation to a single frame, and
 * `both` leaves the element on its end state, so the mascot simply appears.
 */

export type MascotMood = "asking" | "right" | "wrong" | "cheering";

const POP = "animate-[mascot-pop_320ms_var(--ease-snap)_both]";

/** A four-point star, for the mood that has something to celebrate. */
function Spark({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z`}
      fill="var(--color-sky-deep)"
    />
  );
}

function Face({ mood }: { mood: MascotMood }) {
  if (mood === "cheering") {
    return (
      <>
        <path
          d="M10.2 17.4q2.8-3.2 5.6 0"
          fill="none"
          stroke="var(--color-dusk)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20.2 17.4q2.8-3.2 5.6 0"
          fill="none"
          stroke="var(--color-dusk)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Wide open, rather than the closed grin of `right`. */}
        <path
          d="M13.2 21.4h9.6a4.8 4.8 0 0 1-9.6 0Z"
          fill="var(--color-dusk)"
        />
        <Spark x={5.4} y={9.6} r={3.2} />
        <Spark x={30.8} y={14.4} r={2.4} />
      </>
    );
  }

  if (mood === "right") {
    return (
      <>
        {/* Eyes closed, curved up. */}
        <path
          d="M10.2 17.4q2.8-3.2 5.6 0"
          fill="none"
          stroke="var(--color-dusk)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20.2 17.4q2.8-3.2 5.6 0"
          fill="none"
          stroke="var(--color-dusk)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14.4 22.2q3.6 3.8 7.2 0"
          fill="none"
          stroke="var(--color-dusk)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    );
  }

  if (mood === "wrong") {
    return (
      <>
        <ellipse cx="13" cy="17" rx="2.4" ry="2.8" fill="var(--color-dusk)" />
        <ellipse cx="23" cy="17" rx="2.4" ry="2.8" fill="var(--color-dusk)" />
        {/* Down at the corners, and one tear. */}
        <path
          d="M14.4 25.4q3.6-3.8 7.2 0"
          fill="none"
          stroke="var(--color-dusk)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* The tear, dripping. The keyframe rests on the visible state at both ends, so
            the reduced-motion collapse leaves a tear on its cheek rather than an empty
            one — the mood has to survive without the animation. */}
        <path
          d="M9.6 20.6c1.5 2.2 2.1 2.9 2.1 3.7a2.1 2.1 0 0 1-4.2 0c0-.8.6-1.5 2.1-3.7Z"
          fill="var(--color-sky-deep)"
          className="animate-[mascot-tear_1500ms_ease-in-out_infinite]"
        />
      </>
    );
  }

  return (
    <>
      <ellipse cx="13" cy="16.6" rx="2.6" ry="3" fill="var(--color-dusk)" />
      <ellipse cx="23" cy="16.6" rx="2.6" ry="3" fill="var(--color-dusk)" />
      {/* Waiting: a small open mouth. */}
      <ellipse cx="18" cy="23.4" rx="1.7" ry="1.9" fill="var(--color-dusk)" />
    </>
  );
}

export function Mascot({
  mood,
  delay = 0,
  className,
}: {
  mood: MascotMood;
  /** Milliseconds, for a card that wants the mascot to arrive after something else. */
  delay?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 36 40"
      /* Inline rather than an `animation-delay` utility: the pop is set through the
         `animation` shorthand, which carries a delay of its own, and utility order inside
         a layer is Tailwind's to decide. A style attribute is not up for argument. */
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn("block size-9 shrink-0", POP, className)}
    >
      {/* A dome on a scalloped hem: three notches, so the bottom edge reads as cloth
          rather than as a rounded rectangle. */}
      <path
        d="M18 3c7.7 0 14 6.3 14 14v12.6c0 1.9-2.3 2.8-3.6 1.4l-1.2-1.3a1.9 1.9 0 0 0-2.8 0l-1.3 1.4a1.9 1.9 0 0 1-2.8 0l-1.3-1.4a1.9 1.9 0 0 0-2.8 0l-1.3 1.4a1.9 1.9 0 0 1-2.8 0l-1.3-1.4a1.9 1.9 0 0 0-2.8 0L7.6 31C6.3 32.4 4 31.5 4 29.6V17C4 9.3 10.3 3 18 3Z"
        fill="var(--color-lilac)"
      />
      <Face mood={mood} />
    </svg>
  );
}

/**
 * The mascot with something to say.
 *
 * `surface` for the bubble, because this sits on a `paper` card and white on white is not
 * a bubble. The tail is a rotated square rather than a border trick, so it inherits the
 * same fill and cannot drift out of step with it.
 */
export function MascotSays({
  mood,
  children,
  className,
}: {
  mood: MascotMood;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Mascot mood={mood} />

      <div className={cn("relative min-w-0 flex-1", POP)}>
        <span
          aria-hidden
          className="absolute top-1/2 -left-1 size-2 -translate-y-1/2 rotate-45 rounded-[2px] bg-surface"
        />
        <p
          aria-live="polite"
          className="relative rounded-xl bg-surface px-3 py-1.5 text-sm leading-snug text-ink"
        >
          {children}
        </p>
      </div>
    </div>
  );
}

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
 * Three moods, and each one has to be legible at 36 by 44 pixels: eyes wide and a small round mouth
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

/**
 * The gold ramp the sparks are filled with.
 *
 * A gradient rather than a fill, because metal is a ramp and not a hue: a
 * highlight across one shoulder, the body colour through the middle, a shadow at
 * the far tip. Flat gold is just yellow, which is what this is not meant to be.
 * The diagonal is what makes the four points catch the light unevenly, the way a
 * faceted thing does.
 *
 * The id is fixed rather than generated. `Mascot` has no hooks and is a server
 * component, so there is no `useId` available to it, and a module counter would
 * differ between the server render and the client one. Two mascots on a page
 * therefore emit the same id twice — an HTML validity nit rather than a bug, since
 * both definitions are identical and every spark resolves to the same ramp. If
 * this ever needs to be per-instance, the component has to take the id as a prop
 * rather than become a client component for it.
 */
const SPARK_GOLD = "perpal-spark-gold";

function SparkGold() {
  return (
    <defs>
      <linearGradient id={SPARK_GOLD} x1="0.1" y1="0" x2="0.9" y2="1">
        {/* Mixed at use, so the ramp costs two tokens rather than three. */}
        <stop
          offset="0%"
          stopColor="color-mix(in oklab, var(--color-gold) 45%, #fff)"
        />
        <stop offset="45%" stopColor="var(--color-gold)" />
        <stop offset="100%" stopColor="var(--color-gold-deep)" />
      </linearGradient>
    </defs>
  );
}

/** A four-point star, for the mood that has something to celebrate. */
function Spark({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x} ${y - r}L${x + r * 0.3} ${y - r * 0.3}L${x + r} ${y}L${x + r * 0.3} ${y + r * 0.3}L${x} ${y + r}L${x - r * 0.3} ${y + r * 0.3}L${x - r} ${y}L${x - r * 0.3} ${y - r * 0.3}Z`}
      fill={`url(#${SPARK_GOLD})`}
    />
  );
}

function Face({ mood }: { mood: MascotMood }) {
  if (mood === "cheering") {
    return (
      <>
        <SparkGold />
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
      viewBox="0 0 36 44"
      /* Inline rather than an `animation-delay` utility: the pop is set through the
         `animation` shorthand, which carries a delay of its own, and utility order inside
         a layer is Tailwind's to decide. A style attribute is not up for argument. */
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      /* 36x44, one CSS pixel per viewBox unit. It has to match the box's own
         ratio: `size-9` would have fitted a 44-unit drawing into 36px of height
         and letterboxed the width down to about 29px, so the taller body would
         have arrived as a narrower mascot. */
      className={cn("block h-11 w-9 shrink-0", POP, className)}
    >
      {/* A dome on a scalloped hem: three notches, so the bottom edge reads as cloth
          rather than as a rounded rectangle. */}
      <path
        /* The dome is unchanged — 14 units of radius about (18, 17) — and all of
           the added height goes into the straight sides below it: 19.6 units
           rather than 12.6. That is where a ghost's body should grow, since
           lengthening the dome would only have made the head bigger.

           The hem below is written in relative commands, so extending that one
           vertical carries the whole scalloped edge down with it and the wave
           keeps its shape. Only the three absolute values on the return up the
           left side had to move with it, by the same 7. The viewBox gained 4 to
           keep the clearance the tear needs when it drips. */
        d="M18 3c7.7 0 14 6.3 14 14v19.6c0 1.9-2.3 2.8-3.6 1.4l-1.2-1.3a1.9 1.9 0 0 0-2.8 0l-1.3 1.4a1.9 1.9 0 0 1-2.8 0l-1.3-1.4a1.9 1.9 0 0 0-2.8 0l-1.3 1.4a1.9 1.9 0 0 1-2.8 0l-1.3-1.4a1.9 1.9 0 0 0-2.8 0L7.6 38C6.3 39.4 4 38.5 4 36.6V17C4 9.3 10.3 3 18 3Z"
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

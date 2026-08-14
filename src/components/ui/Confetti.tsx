import { cn } from "@/lib/cn";

/**
 * A burst, for the moment a lesson is finished.
 *
 * Fourteen pieces, every value written down rather than rolled: `Math.random()` would give
 * the server and the client two different bursts and React would replace the card on
 * hydration. It also means the burst is art-directed — the pieces are spread across the
 * width and weighted slightly to the sides, which reads better than an even rank.
 *
 * There is no JavaScript in here. The animation runs on mount, so it fires by being
 * rendered and cannot fire twice; the caller mounts it when the card appears. Under
 * reduced motion the global block collapses the animation to its final frame, which is
 * off-screen and transparent — so the burst simply does not happen, which is the correct
 * behaviour for something that is purely a celebration.
 *
 * Colours are the page's own violets and blues. `long` and `short` are deliberately absent:
 * they mean a direction, and a piece of confetti does not have one.
 */

type Piece = {
  /** Across the card, in percent. */
  x: number;
  /** Seconds. */
  delay: number;
  /** Degrees of tumble over the fall. */
  spin: number;
  /** How far it falls and how far it wanders, in rem. */
  drop: number;
  drift: number;
  size: number;
  round: boolean;
  colour: string;
};

const PIECES: readonly Piece[] = [
  { x: 4, delay: 0.02, spin: 420, drop: 20, drift: 1.4, size: 8, round: false, colour: "lilac" },
  { x: 12, delay: 0.22, spin: -300, drop: 24, drift: -0.8, size: 6, round: true, colour: "sky-deep" },
  { x: 19, delay: 0.1, spin: 520, drop: 18, drift: 1.8, size: 9, round: false, colour: "grape" },
  { x: 27, delay: 0.34, spin: -460, drop: 26, drift: -1.6, size: 7, round: true, colour: "lilac-deep" },
  { x: 34, delay: 0.06, spin: 380, drop: 21, drift: 0.9, size: 6, round: false, colour: "sky" },
  { x: 42, delay: 0.28, spin: -540, drop: 25, drift: -1.2, size: 9, round: true, colour: "lilac" },
  { x: 49, delay: 0.16, spin: 300, drop: 19, drift: 1.5, size: 7, round: false, colour: "grape" },
  { x: 57, delay: 0.4, spin: -420, drop: 27, drift: -0.6, size: 8, round: true, colour: "sky-deep" },
  { x: 64, delay: 0.08, spin: 480, drop: 20, drift: 1.1, size: 6, round: false, colour: "lilac-deep" },
  { x: 71, delay: 0.3, spin: -360, drop: 24, drift: -1.9, size: 9, round: true, colour: "lilac" },
  { x: 78, delay: 0.18, spin: 560, drop: 18, drift: 0.7, size: 7, round: false, colour: "sky" },
  { x: 85, delay: 0.36, spin: -320, drop: 26, drift: -1.3, size: 6, round: true, colour: "grape" },
  { x: 92, delay: 0.12, spin: 440, drop: 22, drift: 1.7, size: 8, round: false, colour: "lilac-deep" },
  { x: 97, delay: 0.26, spin: -500, drop: 19, drift: -1, size: 7, round: true, colour: "sky-deep" },
];

export function Confetti({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {PIECES.map((piece) => (
        <span
          key={piece.x}
          className={cn(
            "absolute top-0 block opacity-0 animate-[confetti-fall_1700ms_var(--ease-quart)_forwards]",
            piece.round ? "rounded-full" : "rounded-[2px]",
          )}
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: `var(--color-${piece.colour})`,
            animationDelay: `${piece.delay}s`,
            ["--confetti-spin" as string]: `${piece.spin}deg`,
            ["--confetti-drop" as string]: `${piece.drop}rem`,
            ["--confetti-drift" as string]: `${piece.drift}rem`,
          }}
        />
      ))}
    </div>
  );
}

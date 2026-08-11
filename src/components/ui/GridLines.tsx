import { cn } from "@/lib/cn";

/**
 * Decorative vertical hairlines on the layout's column boundaries.
 *
 * Purely structural: it gives large type something to sit against and makes
 * the grid legible without drawing a visible box around anything.
 */
export function GridLines({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 left-0 hidden w-full md:block",
        className,
      )}
    >
      <div className="shell relative h-full">
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-full border-l border-line/25",
                i === 0 && "border-l-0",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

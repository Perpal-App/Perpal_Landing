/**
 * The Solana mark, supplied by the product owner and used as given.
 *
 * Three bars, each one a parallelogram with the shear on the opposite end from its neighbour,
 * which is the whole identity of this mark — three plain rectangles would be a menu icon. Flat
 * white in the source; `currentColor` here, so the caller owns it.
 *
 * The viewBox is trimmed to the bars. The file arrived padded to a square with the mark in the
 * middle of it, which at a shared height would have drawn this smaller than the other two for
 * no reason a reader could see.
 */
export function Solana({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="126 103.5 44 38"
      fill="currentColor"
      className={className}
    >
      <polygon points="134.9 104.6 127 112.7 127.8 113.3 161.2 113.3 168.8 105.1 168 104.5" />
      <polygon points="127.8 117.9 127 118.6 134.8 126.9 168.1 126.9 168.9 126.3 161 117.9" />
      <polygon points="134.8 131.2 127 139.8 127.8 140.4 161 140.4 168.9 131.8 168.1 131.2" />
    </svg>
  );
}

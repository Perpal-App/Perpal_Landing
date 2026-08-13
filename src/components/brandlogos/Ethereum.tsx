/**
 * The Ethereum diamond, all six facets, translated from grey to white.
 *
 * The mark is normally shaded: two light faces and four darker ones, which is what makes a
 * flat polygon read as a solid with an edge on it. Keeping that on a coloured card means
 * inverting the relationship rather than the values — every facet is the same white, and what
 * differs is how much of it there is. The two `#8C8C8C` faces, the lightest in the source, go
 * to full strength; `#141414`, the darkest, goes to the most transparent, so the card's own
 * lavender shows through where the original had shadow.
 *
 * The order below is the source's order, so the opacities can be checked against it: 343434,
 * 8C8C8C, 3C3C3B, 8C8C8C, 141414, 393939.
 *
 * The viewBox is trimmed to the glyph. The file arrived padded to a square with the mark
 * sitting in the middle of it, which would have made this the smallest of the three marks at
 * the same height for no reason a reader could see.
 *
 * `currentColor`, so the caller owns the colour.
 */
export function Ethereum({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 256 417"
      fill="currentColor"
      className={className}
    >
      <polygon
        fillOpacity="0.55"
        points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32"
      />
      <polygon points="127.962 0 0 212.32 127.962 287.959 127.962 154.158" />
      <polygon
        fillOpacity="0.6"
        points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866"
      />
      <polygon points="127.962 416.9052 127.962 312.1852 0 236.5852" />
      <polygon
        fillOpacity="0.38"
        points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587"
      />
      <polygon
        fillOpacity="0.62"
        points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588"
      />
    </svg>
  );
}

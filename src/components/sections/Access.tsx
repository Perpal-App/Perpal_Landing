/**
 * Access: one full-width canvas, empty for now.
 *
 * Full width rather than split, which is what makes it read as a new movement
 * after the two panels above rather than a third column in the same row.
 *
 * `id="access"` is doing real work. The nav pill and the hero button have both
 * pointed at `#access` since they were written, and until now that anchor landed
 * nowhere — the page scrolled to the bottom and the reader was left with no idea
 * what the button had promised. This is the place that answer belongs.
 *
 * The fill is `ember`, left to right, fading into itself at 40%. Still one hue
 * thinning out rather than two hues meeting — the ramp's pale end is the same
 * orange at lower strength, not a second warm tone — so the gradient reads as
 * light falling across one surface.
 *
 * `ember` exists for this panel and was added on instruction; see the note beside
 * the token in globals.css for what it costs and why it is bounded to one section.
 * What it buys is worth naming: after haze, lilac and sky, the page has spent its
 * whole range on cool tones, so the closing panel arriving warm marks the end of
 * the argument and the start of the ask. Nothing else on the page can do that.
 *
 * The height is a placeholder, not a design. It reserves roughly the proportion
 * the content will need so the page can be judged at full length, and it should
 * come out the moment something lives in here.
 */
export function Access() {
  return (
    <section
      id="access"
      className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3"
      /* Clears the fixed nav when a native anchor jump lands here. */
      style={{ scrollMarginTop: "6rem" }}
    >
      <div className="min-h-[22rem] rounded-2xl bg-linear-to-r from-ember to-ember/40 lg:min-h-[26rem]" />
    </section>
  );
}

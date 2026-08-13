import Image from "next/image";
import { product } from "@/lib/content";
import { PillCloud } from "@/components/ui/PillCloud";
import { Lift } from "@/components/motion/Lift";
import { Parallax } from "@/components/motion/Parallax";

/**
 * Product: the trading home, and the learning and privacy scope around it.
 *
 * Two panels of unequal width on the same white matte the sections above sit in,
 * so the page continues to read as canvases stacked on a mount rather than as
 * bands of colour. Unequal because they are not equal claims — the left one is
 * evidence, the right one is an argument, and evidence needs less room to be
 * convincing.
 *
 * The signature is the phone breaking the bottom edge of the left panel. Cropping
 * the device rather than fitting it says the screen carries on past what the page
 * can show, which is the one thing a still image of an app cannot say on its own.
 *
 * `lilac` carries it, the strongest light tone the palette has, because the panel
 * holding the product should be the one with the most colour in it. `sky` goes to
 * the panel beside it, so the page runs haze, lilac, sky — pale, saturated, pale —
 * and the section with the screenshot is the one that arrives. A dark panel would
 * have been the easy way to make a dark device stand out, and it would also have
 * been the only dark surface on a daylight page. The phone is the darkest object
 * here; it does not need help.
 *
 * Behind the device, one disc in the deep step of the panel's own colour, cropped
 * by the panel's lower edges. It gives the crop a second thing to happen against — the phone
 * passes in front of a form rather than sitting on a flat field — and it stays a
 * shade of the surface rather than a new colour. A grain field tried to do this
 * job earlier and was removed: texture around the only screenshot on the page
 * competes with it, where a single large form sits behind it.
 *
 * Everything else gets quieter for it. The chips on the right are flat, one fill,
 * no shadow and no icons: they name product scope, and a chip that performs
 * starts to look like a button that does nothing.
 *
 * One motion idea, and it belongs to the crop: the device drifts against the
 * scroll inside the panel that cuts it. Nothing else here moves. That keeps it the
 * same family of gesture as the section above — scroll position drives everything,
 * nothing plays on arrival — while staying quieter than it, since a single object
 * moving 80px is a smaller claim than a paragraph assembling itself.
 */
export function Product() {
  return (
    <section
      id="product"
      data-parallax
      className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3"
    >
      {/* The gap between panels matches the matte around them, so the white
          between the two is the same white as the page edge.

          38/62 rather than an even split or the old 5/7. The left panel is slimmer
          for it, and nothing inside it reflows because the copy is capped at 34ch
          — well below the panel's content width at every size from the `lg`
          breakpoint up — so the wrap points are fixed by the caps, not by the
          column. The right panel only widens, which its own caps absorb. */}
      {/* `Lift` on the row rather than on each panel, so the heading and copy in
          both panels settle on one clock — two Lifts side by side would measure
          two different heights and drift out of step. The phone and the pills are
          left out of it: both already own a scrubbed transform of their own, and a
          second one on the same element would fight it. */}
      <Lift className="grid gap-2.5 sm:gap-3 lg:grid-cols-[38fr_62fr]">
        {/* Evidence. `overflow-hidden` crops both the phone and the disc;
            `isolate` gives the panel its own stacking context, so the disc's
            negative z-index stays inside it — above the fill, below everything
            in flow. */}
        {/* `px-6` below `sm`, not `px-8`. At a 320px viewport this plate is 300px
            wide, so 32px a side was spending 64px of it on air and leaving the
            heading 236px to set into. 24px gives the type back 16px, which is a
            line of it at this size. */}
        {/* `@container`, so the heading can measure the plate rather than the window.
            It has to: this plate is 38% of the row at `lg` and all of it once the grid
            stacks, so the viewport does not tell it how much room it has — the same
            reason the plate opposite is already a container. */}
        <div className="@container relative isolate flex flex-col overflow-hidden rounded-2xl bg-lilac px-6 pt-11 sm:px-11 sm:pt-14">
          {/* A disc of `lilac-deep`, the deep step of the panel's own colour, so
              the shape is a shade of the surface rather than a second colour
              arriving. Around 2:1 against the fill: enough to read as a distinct
              form, not enough to compete with the device in front of it.

              Like the reference, it is a wide oval shifted through the left and
              bottom edges, while its right curve closes inside the card. Its
              height comes from its own aspect ratio rather than the card, so a
              taller sibling panel cannot stretch it above the phone.

              Pushed 30% of the panel's height further down than it sat, so its
              crown lands around three quarters of the way down instead of level
              with the middle of the device. The oval was reading as a halo behind
              the phone at the same scale as the phone; low and wide, it reads as
              ground under it. What is left visible is the top arc, which is the
              part worth seeing.

              Two things bound it in the other direction — the oval's right curve
              has to close inside the card, and the crown has to stay below the copy,
              because
              `ink/80` measures 3.8:1 on `lilac-deep` against 6.4:1 on `lilac`. Text
              over this shape would fail contrast, so it can grow down and left but
              not up. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[30%] -left-[28%] -z-10 aspect-[7/6] w-[116%] rounded-[50%] bg-lilac-deep"
          />
          {/* Shrink to fit one line, rather than either wrapping or overflowing. Both
              of the earlier answers were wrong in the same way — they let the type size
              decide and made the line breaks the consequence.
     
              A plain `whitespace-nowrap` pushed the title through the plate's edge at
              `lg`, where the content box is 289px and this needs about 480px, and
              `overflow-hidden` cut it off without a scrollbar to say so. Letting it
              wrap instead cost the row a second line of heading, and because the plate
              opposite pushes its terms down with `mt-auto`, that height arrived over
              there as a gap between its copy and its pills.
     
              So the size follows the width. `6.9cqi` is not a taste: the plate
              opposite fits a 41-character title with `4cqi`, which is `100 / (41 x
              0.6)` for Poppins' average advance, and the same arithmetic on these 24
              characters gives 6.94. `min()` against `--text-panel` means it only ever
              shrinks — past a 634px plate the step is the smaller number and the
              heading sets at full size, matching its neighbour.
     
              The gate is where shrinking would start costing more than wrapping:
              6.9cqi reaches 24px — the floor of `--text-panel` — at a 352px plate. On
              anything narrower the title wraps, and `text-balance` splits it evenly. */}
          <h2
            data-lift="20"
            className="panel-title text-balance text-ink @min-[22rem]:[--panel-title-size:min(var(--text-panel),6.9cqi)] @min-[22rem]:whitespace-nowrap"
          >
            {product.app.title}
          </h2>
          {/* `ink` at 80% rather than `muted`, which reads at 3.9:1 on this fill;
              this holds 6.4:1.

              42ch, up from 34ch. Since the panel narrowed, the old cap was holding
              the copy around 70px short of the padding, so the paragraph read as a
              column inside a column. This lands near the panel's own content width
              at desktop, and still caps the measure once the panels stack and this
              one gets much wider. `text-pretty` for the rag: the problem is the
              orphan on the last line, not uneven line lengths, which is what
              `text-balance` would go after. */}
          <p
            data-lift="12"
            className="mt-5 max-w-[42ch] text-pretty text-base leading-relaxed text-ink/80"
          >
            {product.app.body}
          </p>

          {/* Bottom-anchored and cropped. The negative margin is what puts the
              device through the panel's edge; `mt-auto` keeps it there when the
              grid stretches this panel to match the taller one beside it.

              The drift is bounded by that bleed. The device hangs 112px past the
              edge, so 40px of upward travel still leaves it cropped — the panel
              can never show a gap beneath it — and the movement does something
              rather than merely happening: scrolling down lifts the phone, so more
              of the screen is visible by the time you have read the copy beside it.

              The shadow is doing real work now the panel is light: the render's
              own contact shadow was keyed away with its black plate, so without
              this the device looks pasted on rather than standing on the surface. */}
          <Parallax
            from={40}
            to={-40}
            /* 70% of the plate, capped at 300px. The proportion is the point: the
               device is evidence beside the copy rather than the subject of the
               panel, and filling the column made it the subject.

               The known cost, accepted rather than overlooked: the plate's width is
               not monotonic, because the row splits to `38fr` at `lg`. Its content
               box falls from about 530px stacked to 289px, so the device is around
               300px on a handset, 300px on a tablet, and 202px at 1024px before
               climbing back. If that dip ever needs closing, `min-w-[240px]` does it
               without changing any other width. */
            className="mx-auto mt-auto -mb-28 w-[70%] max-w-[300px] pt-10 will-change-transform sm:-mb-32"
          >
            {/* `quality` above the default 75, for the same reason as the markets
                shot in `Access`: this is a dark UI of small type, 1px rules and a
                banded gauge, which is what a lossy encoder gives up on first.

                The intrinsic size is the trimmed cut-out's own, and it is also this
                image's ceiling. `mockup.png` is a 1448x1086 render, so the phone in
                it is 458px wide and the optimiser will not enlarge past that — at
                the 300px the panel draws it, a 2x screen wants 600 real pixels and
                can only be given 458. Sharpening the build fixed the blur that was
                being added on top of that; the rest needs a larger render. */}
            <Image
              src="/assets/app/home.png"
              alt={product.app.alt}
              width={458}
              height={950}
              sizes="(min-width: 1024px) 320px, 70vw"
              quality={90}
              className="block w-full drop-shadow-2xl"
            />
          </Parallax>
        </div>

        {/* Argument. `@container` makes the panel the thing its own contents
            measure themselves against, which two of them now do: the heading sizes
            itself to fit one line of it, and the terms at the foot pair up once
            there is room. Both had to stop asking the viewport, because this panel
            is 62% of the row at `lg` and all of it once the grid stacks — it is
            wider at a 1000px window than at 1280px. */}
        {/* Matched to the plate beside it. The two are one row at `lg` and stacked
            below it, so a padding that differed would be most obvious exactly where
            they sit on top of each other. */}
        <div className="@container flex flex-col rounded-2xl bg-sky px-6 py-11 sm:px-11 sm:py-14">
          {/* `panel-title-fit` holds the 41-character title on one line by taking
              the largest size that fits the panel instead of wrapping — around 36px
              where the step would have set 42px, which is the trade: one line costs
              a step of size. It cannot overflow, since the size is derived from the
              width it has to fit, and the panel is size-contained so a nowrapped
              heading can no longer widen the grid the way the one beside it does.

              Under a 768px panel the fit lifts, the title wraps, and `text-balance`
              splits it evenly rather than leaving one word stranded. */}
          <h2
            data-lift="20"
            className="panel-title panel-title-fit text-balance text-ink"
          >
            {product.lessons.title}
          </h2>
          {/* Kept at the smaller body step used by the panel beside it. `ink` at 80% rather than
              `muted`, which only reaches 3.6:1 on this fill; this holds around
              7:1. */}
          {/* 88ch, so the copy runs to the panel's padding instead of stopping
              half way across a column this wide. The cap is not there to shape the
              measure any more, it is there as a ceiling: past roughly 90 characters
              a line stops being scannable, and without it an ultrawide window would
              keep stretching this. */}
          <p
            data-lift="12"
            className="mt-5 max-w-[88ch] text-pretty text-base leading-relaxed text-ink/80"
          >
            {product.lessons.body}
          </p>

          {/* Pushed to the foot of the panel, so the terms fill the height the
              phone gives the row rather than leaving a hole under the copy. Four
              rows of two reach around 150px further up into that height than the
              three ragged rows they replace, which is the point — the space above
              them was reading as an unfinished panel rather than as air.

              24px both ways once the terms pair up, from 20px below it. Across, it
              is the only thing between two pills that now meet in the middle of the
              row. Down, it has to survive the drift, which closes two rows sharing
              a column by about 7px at one end of the scroll. */}
          <PillCloud
            items={product.lessons.topics}
            /* A tighter gap below `sm`, because the gap is width the terms do not
               get: at a 252px list, 20px between two pills is 20px off a 106px pill.
               12px hands most of that back.
     
               `my-auto`, not `mt-auto`, and the difference only shows at `lg`. From
               there the two plates are one row, and the row's height is set by the
               phone in the plate opposite — which leaves this plate about 236px more
               than its own content needs. That slack cannot be removed, only placed,
               and `mt-auto` placed all of it in one gap between the copy and the
               terms. Splitting it halves the largest gap on the panel and reads as
               air on both sides of the block rather than as a hole above it.
     
               `lg:pt-0` goes with it: the 48px was the designed distance from the copy
               to the terms, and once the auto margins are supplying more than that, it
               only makes the top gap unequal to the bottom one. It is safe to drop
               because the slack at `lg` is never zero — the phone guarantees it.
     
               `lg:gap-y-8` opens the rows apart from `lg` up, which is more of the same
               argument: the block has height to fill, and 32px between four rows spends
               24px of the slack somewhere it reads as rhythm. The column gap stays at
               24px — that one is width the two terms on a row would otherwise have, and
               the pair is budgeted against it. */
            className="my-auto gap-3 pt-10 sm:gap-6 sm:pt-12 lg:gap-x-6 lg:gap-y-8 lg:pt-0"
          />
        </div>
      </Lift>
    </section>
  );
}

import Image from "next/image";
import { access, cta } from "@/lib/content";
import { Lift } from "@/components/motion/Lift";
import { Button } from "@/components/ui/Button";
import { StoreBadge } from "@/components/ui/StoreBadge";
import { AndroidLogo } from "@/components/brandlogos/Android";
import { AppleLogo } from "@/components/brandlogos/Apple";

/**
 * Access: the closing panel, and the offer.
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
 * The offer sits in the top-left corner, on the same padding rhythm as the panels
 * above, and it is deliberately not centred: this is the last thing on the page you
 * can act on, so it belongs where a reader's eye already is at the end of a line of
 * prose, not marooned in the middle of a canvas.
 *
 * Three things in that corner, and only one of them is a control. The badges are a
 * matched pair reporting one state — neither store has the app yet — so they are
 * the same size, the same hairline and the same sentence, and they are inert. The
 * waitlist key underneath them is the whole action, which is why it is the only
 * filled object here and why it spans the pair rather than sitting beside them:
 * the two statements set up the ask, and the ask is the last thing you read. Its
 * label is the same string the nav pill and the hero carry, read from `content.ts`,
 * so three buttons deep in one page cannot drift into three names.
 *
 * The device stands in the opposite corner, cut in half by the panel's bottom edge.
 * It is the markets screen, not the home screen `Product` shows, and that is what
 * keeps two device shots on one page from reading as one shot used twice: the panel
 * that argues shows the app's front door, the panel that asks shows the thing you
 * would open it for. The top half is also the half worth keeping — BTC, ETH and SOL
 * are its first three rows.
 *
 * Half is by construction rather than by measurement. The plate is trimmed to the
 * phone, so `bottom-0` plus a translate of half the image's own height puts the cut
 * on the device's midpoint at any size, and the two widths are then the only numbers
 * involved. At `lg` they land the phone's top edge on the panel's own top padding
 * line.
 *
 * That trim is not housekeeping. The render arrives as a phone in the middle of a
 * 3840x1948 transparent plate, a quarter of it device, so
 * `scripts/build-image-assets.mjs` cuts it down to `app/markets.png` — otherwise the
 * page ships four times the pixels it can use and the layout has to position an
 * empty frame instead of a phone.
 *
 * Trimmed and nothing else, which is the difference between this reading sharp and
 * reading soft. No feather, because the render's alpha arrives clean and a blur with
 * no seam to soften spends its radius on the tickers instead. No height cap, because
 * 352px of phone takes 704 real pixels on a 2x screen and the optimiser will not
 * enlarge past its source — at 1000px tall the cut is 489 wide and every retina
 * screen upscales it. `quality={90}` finishes the same thought: a near-black screen
 * of 1px rules and small type is the first thing the default 75 flattens.
 *
 * Below `md` it is gone rather than shrunk. There is no room beside a full-width
 * action for a phone worth looking at, and since a lazily loaded image inside a
 * `display: none` box never intersects the viewport, the narrow layout does not pay
 * for it either.
 *
 * One motion idea, and it is this panel's arrival: three depths on one clock. The
 * device rises 48px, the heading 20, the offer 12, each from below its own layout
 * position and each landing exactly on it — scrubbed, so scrolling back lowers them
 * again. Same family of gesture as the two sections above, where scroll position
 * drives everything and nothing plays on arrival, and quieter than either: the mesh
 * moves eight objects and `Product` drifts a device through a crop, where this only
 * settles what is already here.
 *
 * The range ends on arrival rather than on departure, which matters more here than
 * anywhere else on the page. This is the last panel, so it never leaves through the
 * top of the viewport, and a range that assumed it would would strand every element
 * short of its resting place — see `Lift`. What the reader sees at the foot of the
 * page is the composition, and the movement is only what brought it there.
 */
export function Access() {
  return (
    <section
      id="access"
      className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3"
      /* Clears the fixed nav when a native anchor jump lands here. */
      style={{ scrollMarginTop: "6rem" }}
    >
      {/* `items-start` so the heading and the offer each take their own width
          instead of stretching across a canvas this wide.

          The panel is also the scroll trigger — see `Lift`. One timeline measured
          on this box, so the three `data-lift` offsets below are one movement at
          three depths rather than three animations that happen to overlap. */}
      <Lift className="relative isolate flex min-h-[22rem] flex-col items-start overflow-hidden rounded-2xl bg-linear-to-r from-ember to-ember/40 px-8 py-11 sm:px-11 sm:py-14 lg:min-h-[26rem]">
        <h2 className="panel-title text-ink" data-lift="20">
          {access.title}
        </h2>

        {/* Equal tracks in a `w-fit` grid, so the wider badge sizes both and the
            narrower one grows to meet it — neither is scaled to reach the other.
            The grid is sized by its content, so the action inherits the pair's
            width by spanning them rather than by being given a number.

            One column at 360px, where two badges side by side would each be under
            150px and every label would break across three lines. Stacked, the
            equal track keeps all three the same width there too.

            The offer travels least of anything here, and the badges and the action
            travel together. The thing a reader has to hit should be the steadiest
            object on the panel, and a button that arrives on its own clock from its
            own labels is three moving targets instead of one still one. */}
        <div
          className="mt-7 grid w-fit grid-cols-1 gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4"
          data-lift="12"
        >
          {/* Android leads. It is the platform that ships first, and on an
              Android-first product it should not be second. */}
          <StoreBadge
            mark={<AndroidLogo className="size-8 shrink-0" />}
            verb={access.android.verb}
            platform={access.android.platform}
          />
          <StoreBadge
            mark={<AppleLogo className="size-7 shrink-0" />}
            verb={access.ios.verb}
            platform={access.ios.platform}
          />
          <Button href={cta.join} variant="ember" className="sm:col-span-2">
            {cta.label}
          </Button>
        </div>

        {/* Last in the DOM so it is read after the offer, and behind it in paint
            order so it can never cover it — `isolate` on the panel keeps that
            negative index from escaping into the page. `right-11` is the panel's own
            padding line, so the device respects the same margin the copy does.

            No shadow, unlike the phone in `Product`. That one appears to stand on
            the panel floor and needs the contact; this one is cut off mid-body, so
            there is nothing to ground, and a near-black device on mid-orange has no
            separation problem a shadow could solve. It would only put a grey halo
            around the crispest edge on the page.

            It travels four times as far as the offer, which is what makes the group
            read as depth rather than as a page settling. Two transforms stack on it
            and neither is fighting the other: `translate-y-1/2` is a CSS individual
            transform property and GSAP writes `transform`, and the used matrix is
            the individual properties first, then that. So the crop stays half the
            device and the lift happens underneath it. */}
        <Image
          src="/assets/app/markets.png"
          alt={access.mockAlt}
          width={922}
          height={1886}
          sizes="(min-width: 1024px) 352px, 216px"
          quality={90}
          data-lift="48"
          className="pointer-events-none absolute right-11 bottom-0 -z-10 hidden w-54 translate-y-1/2 md:block lg:w-88"
        />
      </Lift>
    </section>
  );
}

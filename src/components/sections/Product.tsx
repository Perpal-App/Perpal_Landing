import Image from "next/image";
import { product } from "@/lib/content";
import { Parallax } from "@/components/motion/Parallax";

/**
 * Product: the app, and the vocabulary it teaches.
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
 * The fill is flat. A grain field rose out of the bottom-left corner here for a
 * while, and the panel is better without it: the crop is the idea, and anything
 * textured around the device competes with the only screenshot on the page.
 *
 * Everything else gets quieter for it. The chips on the right are flat, one fill,
 * no shadow and no icons: they are the lesson subjects, so their job is to be
 * read as a list of real terms, and a chip that performs starts to look like a
 * button that does nothing.
 *
 * One motion idea, and it belongs to the crop: the device drifts against the
 * scroll inside the panel that cuts it. Nothing else here moves. That keeps it the
 * same family of gesture as the section above — scroll position drives everything,
 * nothing plays on arrival — while staying quieter than it, since a single object
 * moving 80px is a smaller claim than a paragraph assembling itself.
 */
export function Product() {
  return (
    <section id="product" className="relative mt-2.5 px-2.5 sm:mt-3 sm:px-3">
      {/* The gap between panels matches the matte around them, so the white
          between the two is the same white as the page edge. */}
      <div className="grid gap-2.5 sm:gap-3 lg:grid-cols-12">
        {/* Evidence. `overflow-hidden` is what crops the phone. */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-lilac px-7 pt-9 sm:px-9 sm:pt-11 lg:col-span-5">
          <h2 className="panel-title max-w-[22ch] text-ink">
            {product.app.title}
          </h2>
          {/* `ink` at 80% rather than `muted`, which reads at 3.9:1 on this fill.
              This holds 6.4:1. */}
          <p className="mt-4 max-w-[38ch] text-base text-ink/80">
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
            className="mx-auto mt-auto -mb-28 w-[70%] max-w-[300px] pt-10 will-change-transform sm:-mb-32"
          >
            <Image
              src="/assets/app/home.png"
              alt={product.app.alt}
              width={456}
              height={948}
              sizes="(min-width: 1024px) 320px, 70vw"
              className="block w-full drop-shadow-2xl"
            />
          </Parallax>
        </div>

        {/* Argument. */}
        <div className="flex flex-col rounded-2xl bg-sky px-7 py-9 sm:px-9 sm:py-11 lg:col-span-7">
          <h2 className="panel-title max-w-[24ch] text-ink">
            {product.lessons.title}
          </h2>
          {/* `ink` at 80% rather than `muted`, which only reaches 3.6:1 on this
              fill. This holds around 7:1. */}
          <p className="mt-4 max-w-[52ch] text-base text-ink/80">
            {product.lessons.body}
          </p>

          {/* Pushed to the foot of the panel, so the terms fill the height the
              phone gives the row rather than leaving a hole under the copy.

              A plain wrap, deliberately. The reference staggers its rows by hand,
              and an indent that encodes nothing is decoration; the terms are
              different lengths, which gives the rag for free. */}
          <ul className="mt-auto flex flex-wrap gap-2.5 pt-12">
            {product.lessons.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full bg-paper px-4 py-2 font-ui text-sm font-medium text-ink"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

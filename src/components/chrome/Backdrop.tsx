import Image from "next/image";

/**
 * The hero's sky.
 *
 * One inset surface filling the hero and nothing else: the weather is the
 * hero's stage, and every section below it stands on plain paper. It is
 * absolute rather than fixed for that reason — a fixed layer would follow the
 * reader down the page and turn a stage into wallpaper. The rounded window and
 * its white matte are what make the ending deliberate: the sky stops at an edge
 * it drew itself instead of fading out somewhere mid-scroll.
 *
 * Bottom to top:
 *
 *   frame     the document background, which the inset leaves showing as a
 *             white matte around a rounded window
 *   ramp      white into pale sky, so nothing goes flat where colour runs out
 *   clouds    the painted sky, masked so it holds the edges and thins in the
 *             middle
 *   lift      white rising from the bottom, which is what separates the cloud
 *             mass in the lower-left of the source image from the wisp
 *   field     four radial gradients in one element, mixed with
 *             `background-blend-mode`, then blurred
 *   glow      a lilac-into-sky radial along the bottom edge
 *   clearing  a soft white radial where the copy sits — the signature, and
 *             the reason type over a photographic sky passes contrast
 *   grain     noise, which keeps a gradient this wide from banding into steps
 *
 * Three details that matter more than they look:
 *
 * Every radial fades to its own hue at zero alpha, never to `transparent`.
 * `transparent` is `rgba(0,0,0,0)`, so interpolating to it drags each stop
 * through black and leaves a grey halo. Fading to `rgba(same hue, 0)` keeps the
 * ramp clean without relying on `in oklab` interpolation, which would drop the
 * whole declaration on an engine that lacks it.
 *
 * The field is inset negatively, well past the canvas on every side. A blur
 * samples transparency beyond its element's box, so a blurred layer sized to
 * its container fades out at the container's edges and leaves a rim.
 * Oversizing pushes that falloff outside the clip.
 *
 * Nothing here animates, so the blur rasterises once and is only composited
 * from then on, including while the page scrolls past it.
 */

/* Fine grain, generated rather than shipped as an asset. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E")`;

/* Sky top-left, lilac top-right, then both again low and wide so the purple
   carries through the bottom half rather than sitting in one corner. Top layer
   first, which is the order `background-blend-mode` expects. `multiply` so
   overlaps deepen into each other instead of stacking alpha into grey. */
const FIELD = [
  "radial-gradient(58% 48% at 14% 6%, rgba(169,214,246,0.55) 0%, rgba(169,214,246,0.20) 46%, rgba(169,214,246,0) 74%)",
  "radial-gradient(54% 46% at 88% 4%, rgba(196,184,242,0.50) 0%, rgba(196,184,242,0.17) 44%, rgba(196,184,242,0) 72%)",
  "radial-gradient(52% 44% at 8% 92%, rgba(95,168,221,0.32) 0%, rgba(95,168,221,0) 70%)",
  "radial-gradient(56% 46% at 92% 94%, rgba(139,121,212,0.30) 0%, rgba(139,121,212,0) 72%)",
].join(", ");

/* The mask that thins the clouds through the middle of the frame. Elliptical
   and pushed above centre, so the cloud mass survives in the top corners where
   the source image actually has it. */
const CLOUD_MASK =
  "radial-gradient(78% 62% at 50% 30%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.45) 46%, rgba(0,0,0,0.92) 72%, #000 100%)";

/* The glow along the bottom edge: lilac at the core, opening into sky as it
   rises. A gradient rather than a blurred ellipse — soft by construction, with
   no full-viewport rasterisation and no smeared edge. */
const BOTTOM_GLOW = [
  "radial-gradient(78% 48% at 50% 106%,",
  "rgba(139,121,212,0.42) 0%,",
  "rgba(196,184,242,0.34) 32%,",
  "rgba(169,214,246,0.24) 58%,",
  "rgba(169,214,246,0) 82%)",
].join(" ");

export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 p-2.5 sm:p-3"
    >
      <div
        className="relative isolate h-full w-full overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #eff7fd 46%, #dceefb 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            maskImage: CLOUD_MASK,
            WebkitMaskImage: CLOUD_MASK,
          }}
        >
          <Image
            src="/assets/cloud_bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover opacity-90"
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.78) 16%, rgba(255,255,255,0) 44%)",
          }}
        />

        <div
          className="absolute -inset-[24%] blur-[72px]"
          style={{
            background: FIELD,
            backgroundBlendMode: "multiply, multiply, multiply, normal",
          }}
        />

        <div className="absolute inset-0" style={{ background: BOTTOM_GLOW }} />

        {/* The clearing. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(46% 38% at 50% 34%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.55) 44%, rgba(255,255,255,0) 76%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.055] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
      </div>
    </div>
  );
}

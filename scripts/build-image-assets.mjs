/**
 * Builds the page's cut-out image assets from the original renders.
 *
 * Several of the source images ship on an opaque plate — white or cream behind
 * the 3D tokens, black behind the phone — which would read as a rectangle on the
 * panels these sit on. The plate is flat in every case, so it is keyed out by
 * flood-filling inward from the border: anything the fill reaches is background,
 * anything it cannot reach is the subject. That distinction is the whole reason
 * to do it this way. A global colour key would also punch out the near-white
 * speculars on the coin rims and the black dynamic island on the phone, both of
 * which are enclosed by the subject and so are never reached from the edge.
 *
 * Then: erode one pixel to drop the plate-tinted fringe, feather the alpha so the
 * edge is not aliased, and trim to the subject.
 *
 * Run with `node scripts/build-image-assets.mjs`. The originals stay where they
 * are and are the source of truth, the same arrangement `public/fonts` has with
 * its WOFF2 builds.
 */
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const JOBS = [
  {
    /* The eight token and venue renders, padded into a common square so the mesh
       can size them all against one aspect ratio. */
    dirs: ["public/assets/3d_iconstoken", "public/assets/3d_brandicons"],
    out: "public/assets/3d_mesh",
    box: 512,
    /* Pacifica's mark is a ring, so it encloses a pocket of cream the border fill
       cannot reach. This second pass collects it. */
    fillEnclosed: true,
  },
  {
    /* The app screenshot, trimmed to the phone. */
    files: ["public/assets/mockup.png"],
    out: "public/assets/app",
    rename: "home.png",
    maxHeight: 1000,
    /* Off, and this matters: the dynamic island is a large patch of pure black
       enclosed by the screen, so an enclosed-region pass would cut a hole
       straight through the phone. */
    fillEnclosed: false,
  },
  {
    /* The markets screen, for the closing panel. This render arrives with its
       alpha already cut, so `key` returns on the first pixel and nothing is keyed
       — it is here for the trim, which is the expensive part of the problem: the
       phone stands in the middle of a 3840x1948 plate and occupies a quarter of
       its width, so shipping it untrimmed would send four times the pixels the
       page can use and force the layout to position an empty frame instead of a
       device.

       No height cap, unlike the home shot, and that is the difference between this
       reading sharp and reading soft. The panel draws it 352px wide, which a 2x
       display renders with 704 real pixels, and the image optimiser will not
       enlarge past its source — capped at 1000 tall this cut is only 489 wide, so
       every retina screen would be upscaling it. Trimmed at full height it is 952
       wide and every size the page asks for is a downscale. */
    files: ["public/assets/cta_mockup.png"],
    out: "public/assets/app",
    rename: "markets.png",
    fillEnclosed: false,
  },
];

const TOLERANCE = 26;

async function key(file, { fillEnclosed }) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const at = (x, y) => (y * w + x) * 4;

  // Already transparent: nothing to key.
  if (data[at(0, 0) + 3] === 0) return { data, w, h, keyed: 0 };

  const corners = [at(1, 1), at(w - 2, 1), at(1, h - 2), at(w - 2, h - 2)];
  const plate = [0, 1, 2].map((c) =>
    Math.round(corners.reduce((sum, i) => sum + data[i + c], 0) / 4),
  );

  const distance = (i) =>
    Math.max(
      Math.abs(data[i] - plate[0]),
      Math.abs(data[i + 1] - plate[1]),
      Math.abs(data[i + 2] - plate[2]),
    );

  /* Flood fill from every border pixel. An explicit stack, because a recursive
     fill over a million pixels overflows the call stack. */
  const bg = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, x + (h - 1) * w);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);

  while (stack.length) {
    const p = stack.pop();
    if (bg[p] || distance(p * 4) > TOLERANCE) continue;
    bg[p] = 1;
    const x = p % w;
    const y = (p - x) / w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w);
    if (y < h - 1) stack.push(p + w);
  }

  if (fillEnclosed) {
    /* Regions of plate the border fill cannot see. Two guards keep this off the
       subject's own highlights: the colour has to be within 8 rather than 26, and
       the region has to be large. An enclosed plate pocket is flat and wide; a
       specular highlight is a gradient over a coloured body. */
    const seen = new Uint8Array(w * h);
    for (let start = 0; start < w * h; start++) {
      if (bg[start] || seen[start] || distance(start * 4) > 8) continue;

      const region = [];
      const queue = [start];
      seen[start] = 1;
      while (queue.length) {
        const p = queue.pop();
        region.push(p);
        const x = p % w;
        const y = (p - x) / w;
        const push = (n) => {
          if (bg[n] || seen[n] || distance(n * 4) > 8) return;
          seen[n] = 1;
          queue.push(n);
        };
        if (x > 0) push(p - 1);
        if (x < w - 1) push(p + 1);
        if (y > 0) push(p - w);
        if (y < h - 1) push(p + w);
      }

      if (region.length >= 2000) for (const p of region) bg[p] = 1;
    }
  }

  /* Erode the subject by one pixel: any kept pixel touching the background is
     part of the plate-blended fringe, and keeping it rings the subject in the
     plate's colour once it sits on something else. */
  const edge = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (bg[p]) continue;
      if (bg[p - 1] || bg[p + 1] || bg[p - w] || bg[p + w]) edge[p] = 1;
    }
  }

  let keyed = 0;
  for (let p = 0; p < w * h; p++) {
    if (bg[p] || edge[p]) {
      data[p * 4 + 3] = 0;
      keyed++;
    }
  }

  return { data, w, h, keyed };
}

for (const job of JOBS) {
  await mkdir(job.out, { recursive: true });

  const sources = job.files ?? [];
  for (const dir of job.dirs ?? []) {
    for (const name of (await readdir(dir)).filter((f) => f.endsWith(".png"))) {
      sources.push(path.join(dir, name));
    }
  }

  for (const file of sources) {
    const { data, w, h, keyed } = await key(file, job);
    const name = job.rename ?? path.basename(file);

    /* Feather the hard 0/255 cut the fill leaves, so the edge is not aliased — in
       the alpha channel only, and only when there is a cut to feather.

       Blurring the whole image is the obvious way to do this and it is wrong twice
       over. It softens the subject, which on a phone screenshot is every ticker,
       price and hairline in the UI and the only reason the render exists. And it
       drags colour out of the pixels the key just emptied: those still hold the
       plate's RGB under a zero alpha, and libvips does not premultiply before it
       blurs, so the plate bleeds back into the subject's edge as a pale halo — the
       exact fringe the erosion pass above went to the trouble of removing.

       Feathering the alpha alone leaves every colour where it was and lets the
       subject's own edge pixels fade out instead. The blurred channel is written
       back into the buffer rather than joined onto a pipeline, because `joinChannel`
       lands after the resize and trim below and would be fighting them for order. A
       render that already ships cut is returned untouched by `key` and skips this
       entirely. */
    if (keyed > 0) {
      const alpha = await sharp(data, {
        raw: { width: w, height: h, channels: 4 },
      })
        .extractChannel(3)
        .blur(0.6)
        .raw()
        .toBuffer();

      for (let p = 0; p < w * h; p++) data[p * 4 + 3] = alpha[p];
    }

    let pipeline = sharp(data, {
      raw: { width: w, height: h, channels: 4 },
    }).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 });

    if (job.box) {
      pipeline = pipeline.resize(job.box, job.box, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });
    } else if (job.maxHeight) {
      pipeline = pipeline.resize({
        height: job.maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const out = await pipeline
      .png({ compressionLevel: 9 })
      .toFile(path.join(job.out, name));

    const pct = ((keyed / (w * h)) * 100).toFixed(1);
    console.log(
      `${name.padEnd(14)} keyed ${pct.padStart(5)}% of ${w}x${h} -> ${out.width}x${out.height}`,
    );
  }
}

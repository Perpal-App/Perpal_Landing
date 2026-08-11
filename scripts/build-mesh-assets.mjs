/**
 * One-off: build the About mesh assets from the 3D renders.
 *
 * Five of the eight renders ship on an opaque plate — white for the `_2` token
 * variants, cream for both Pacifica ones — which would read as a square on the
 * section's pale panel. The plate is flat and uniform, so it is keyed out by
 * flood-filling inward from the border: anything the fill reaches is background,
 * everything it cannot reach is the object. That distinction matters, because a
 * global colour key would also punch holes in the near-white specular highlights
 * on the coin rims, and the gaps between Pacifica's four arcs do have to key out.
 *
 * Then: erode one pixel to drop the plate-tinted fringe, feather the alpha so the
 * edge is not aliased, trim to the object, and pad every result into the same
 * 512px square so the component can size them all against one aspect ratio.
 */
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = ["public/assets/3d_iconstoken", "public/assets/3d_brandicons"];
const OUT = "public/assets/3d_mesh";
const BOX = 512;
const TOLERANCE = 26;

async function key(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const at = (x, y) => (y * w + x) * 4;

  // Already transparent: nothing to key.
  if (data[at(0, 0) + 3] === 0) return { data, w, h, keyed: 0 };

  const corners = [
    at(1, 1),
    at(w - 2, 1),
    at(1, h - 2),
    at(w - 2, h - 2),
  ];
  const plate = [0, 1, 2].map((c) =>
    Math.round(corners.reduce((sum, i) => sum + data[i + c], 0) / 4),
  );

  const near = (i) =>
    Math.max(
      Math.abs(data[i] - plate[0]),
      Math.abs(data[i + 1] - plate[1]),
      Math.abs(data[i + 2] - plate[2]),
    ) <= TOLERANCE;

  /* Flood fill from every border pixel. A typed array as an explicit stack,
     because a recursive fill over 1.5M pixels overflows the call stack. */
  const bg = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) {
    stack.push(x, x + (h - 1) * w);
  }
  for (let y = 0; y < h; y++) {
    stack.push(y * w, y * w + w - 1);
  }

  while (stack.length) {
    const p = stack.pop();
    if (bg[p] || !near(p * 4)) continue;
    bg[p] = 1;
    const x = p % w;
    const y = (p - x) / w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w);
    if (y < h - 1) stack.push(p + w);
  }

  /* Second pass, for plate the border fill cannot reach. Pacifica's mark is a
     ring, so the plate inside it is enclosed by the object and survives the
     first pass as a cream pocket.
     Two guards keep this from eating the near-white speculars on the coin rims:
     the colour has to be within 8 of the plate rather than 26, and the region
     has to be large. An enclosed plate pocket is flat and wide; a highlight is a
     gradient over a violet body, so it satisfies neither. */
  const exact = (i) =>
    Math.max(
      Math.abs(data[i] - plate[0]),
      Math.abs(data[i + 1] - plate[1]),
      Math.abs(data[i + 2] - plate[2]),
    ) <= 8;

  const seen = new Uint8Array(w * h);
  for (let start = 0; start < w * h; start++) {
    if (bg[start] || seen[start] || !exact(start * 4)) continue;

    const region = [];
    const queue = [start];
    seen[start] = 1;
    while (queue.length) {
      const p = queue.pop();
      region.push(p);
      const x = p % w;
      const y = (p - x) / w;
      const push = (n) => {
        if (bg[n] || seen[n] || !exact(n * 4)) return;
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

  /* Erode the object by one pixel: any kept pixel touching the background is
     part of the plate-blended fringe, and keeping it would ring the object in
     cream on a blue panel. */
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

await mkdir(OUT, { recursive: true });

for (const dir of SRC) {
  for (const name of (await readdir(dir)).filter((f) => f.endsWith(".png"))) {
    const { data, w, h, keyed } = await key(path.join(dir, name));

    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      // Feather the hard 0/255 edge left by the fill so it is not aliased.
      .blur(0.6)
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
      .resize(BOX, BOX, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, name));

    const pct = ((keyed / (w * h)) * 100).toFixed(1);
    console.log(`${name.padEnd(14)} keyed ${pct}% of ${w}x${h}`);
  }
}

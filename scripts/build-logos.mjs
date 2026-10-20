// Turns each business's official logo (design/logos/raw/<slug>.<ext>, sources in data/logos.json) into a
// single-ink PNG on transparent paper, printed the way a directory would print it: dark parts become ink, light
// parts become paper (so white lettering inside a coloured badge stays knocked out), and a logo drawn light on a
// dark tile is inverted. Output: src/assets/logos/<slug>.png, trimmed, at most 96px tall and 240px wide (3× the
// largest size the page draws them), plus src/data/logos.json with each one's size.  Run: npm run logos
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rawDir = join(root, 'design', 'logos', 'raw');
const outDir = join(root, 'src', 'assets', 'logos');
const INK = [0x1c, 0x1a, 0x17];
const MAX_H = 96;
const MAX_W = 240;
/** Logos whose lockup is mostly small print get cropped to their emblem: [x, y, width, height] in source pixels. */
const CROPS = {
  // Hindustan Petroleum's header lockup is the HP emblem beside two lines of corporate name: keep the emblem.
  'hp-gas-manrath-enterprises': [0, 0, 64, 79],
};
const TYPES = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.gif': 'image/gif' };

// Read the sources and start Chrome first: if either fails, the logos already in src/assets stay as they are.
const sources = readdirSync(rawDir).sort();
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const page = await browser.newPage();
const report = [];
/** slug → printed size, so the page knows which places have a logo (the rest get a monogram). */
const manifest = {};

for (const file of sources) {
  const ext = extname(file).toLowerCase();
  if (!TYPES[ext]) continue;
  const slug = file.slice(0, -ext.length);
  const bytes = readFileSync(join(rawDir, file));
  const src = `data:${TYPES[ext]};base64,${bytes.toString('base64')}`;
  let result = await convert(src, CROPS[slug]);
  // Some sites ship SVGs with fill="none" on the root and colour them with CSS: draw those with the default fill.
  if (result.empty && ext === '.svg') {
    const fixed = bytes.toString('utf8').replace(/(<svg\b[^>]*?)\sfill="none"/, '$1');
    result = await convert(`data:image/svg+xml;base64,${Buffer.from(fixed).toString('base64')}`, CROPS[slug]);
  }
  if (result.empty) {
    report.push(`${slug}: EMPTY after conversion (check the source)`);
    continue;
  }
  writeFileSync(join(outDir, `${slug}.png`), Buffer.from(result.png, 'base64'));
  manifest[slug] = { width: result.width, height: result.height };
  const how = result.lightLogo ? 'light logo, shape as ink' : result.oneTone ? 'one tone' : `split at ${result.split}`;
  report.push(`${slug}: ${result.width}×${result.height} (${how})`);
}

/** One logo, drawn and printed in the page (canvas), returned as an ink PNG. */
async function convert(src, crop) {
  return page.evaluate(
    async ({ src, crop, INK, MAX_H, MAX_W }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      // Draw big first (SVGs without a size report 300×150; give them room), then trim and scale down.
      const [sx, sy, sw, sh] = crop ?? [0, 0, img.naturalWidth || 1200, img.naturalHeight || 600];
      let w = sw;
      let h = sh;
      const up = Math.max(1, 800 / Math.max(w, h));
      w = Math.round(w * up);
      h = Math.round(h * up);
      const c = new OffscreenCanvas(w, h);
      const x = c.getContext('2d', { willReadFrequently: true });
      // Without a crop, draw the whole image (an SVG with no intrinsic size has no source rectangle to cut from).
      if (crop) x.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      else x.drawImage(img, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data;
      const lum = (i) => (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;

      // Is the background transparent, or a solid tile? Look at the edge pixels.
      // A logo whose badge touches one side (RentoMojo's tile) still has a transparent background: count how
      // much of the edge is see-through rather than averaging its alpha.
      let edgeClear = 0;
      let edgeLum = 0;
      let edgeN = 0;
      const sample = (px, py) => {
        const i = (py * w + px) * 4;
        if (d[i + 3] < 40) edgeClear++;
        edgeLum += lum(i);
        edgeN++;
      };
      for (let px = 0; px < w; px += Math.max(1, Math.floor(w / 64))) {
        sample(px, 0);
        sample(px, h - 1);
      }
      for (let py = 0; py < h; py += Math.max(1, Math.floor(h / 64))) {
        sample(0, py);
        sample(w - 1, py);
      }
      edgeLum /= edgeN;
      const transparentBg = edgeClear / edgeN > 0.4;
      const darkBg = !transparentBg && edgeLum < 0.45;

      // On a transparent background, does the logo itself read light (a white logo made for dark headers)?
      // A white badge with dark linework inside (The Pilates Studio) is not a white logo: its lines must print.
      let opaque = 0;
      let opaqueLum = 0;
      let dark = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 128) {
          opaque++;
          const L = lum(i);
          opaqueLum += L;
          if (L < 0.55) dark++;
        }
      }
      const lightLogo = transparentBg && opaque > 0 && opaqueLum / opaque > 0.88 && dark / opaque < 0.02;

      // Print it like a one-ink press: find this logo's own split between its dark and light colours (Otsu's
      // threshold over the visible pixels). Darker than the split prints as ink, lighter stays paper, with a
      // narrow soft band so edges stay smooth. A white logo on a transparent background prints as its shape.
      const hist = new Float64Array(64);
      let total = 0;
      for (let i = 0; i < d.length; i += 4) {
        const a = d[i + 3] / 255;
        if (a < 0.5) continue;
        hist[Math.min(63, Math.floor(lum(i) * 64))] += 1;
        total++;
      }
      let sumAll = 0;
      for (let k = 0; k < 64; k++) sumAll += k * hist[k];
      let wB = 0;
      let sumB = 0;
      let best = -1;
      let split = 32;
      let meanGap = 0;
      let lightMean = 1;
      for (let k = 0; k < 63; k++) {
        wB += hist[k];
        if (!wB) continue;
        const wF = total - wB;
        if (!wF) break;
        sumB += k * hist[k];
        const mB = sumB / wB;
        const mF = (sumAll - sumB) / wF;
        const between = wB * wF * (mB - mF) ** 2;
        if (between > best) {
          best = between;
          // Halfway between the two colours, not at the edge of the darker one: a red badge on white must print solid.
          split = (mB + mF) / 2 + 0.5;
          meanGap = (mF - mB) / 64;
          lightMean = mF / 64;
        }
      }
      const t = split / 64;
      // On a transparent background only near-white parts stay paper (white lettering in a badge); two dark
      // colours (black text, an orange smile) both print as ink.
      const oneTone = meanGap < 0.2 || (transparentBg && lightMean < 0.75);
      const band = 0.06;
      const ink = new Uint8ClampedArray(w * h);
      for (let p = 0, i = 0; p < w * h; p++, i += 4) {
        const a = d[i + 3] / 255;
        const L = lum(i);
        let v;
        if (lightLogo || (oneTone && transparentBg)) v = a;
        else if (oneTone) v = L < 0.85 ? a : 0;
        else v = a * Math.min(1, Math.max(0, (t + band - L) / (2 * band)));
        ink[p] = Math.round(v * 255);
      }

      // Trim to the inked area.
      let x0 = w;
      let y0 = h;
      let x1 = -1;
      let y1 = -1;
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          if (ink[py * w + px] > 24) {
            if (px < x0) x0 = px;
            if (px > x1) x1 = px;
            if (py < y0) y0 = py;
            if (py > y1) y1 = py;
          }
        }
      }
      if (x1 < 0) return { empty: true, transparentBg, darkBg, lightLogo };
      const tw = x1 - x0 + 1;
      const th = y1 - y0 + 1;
      const scale = Math.min(1, MAX_H / th, MAX_W / tw);
      const ow = Math.max(1, Math.round(tw * scale));
      const oh = Math.max(1, Math.round(th * scale));
      const full = new OffscreenCanvas(tw, th);
      const fx = full.getContext('2d');
      const fd = fx.createImageData(tw, th);
      for (let py = 0; py < th; py++) {
        for (let px = 0; px < tw; px++) {
          const o = (py * tw + px) * 4;
          fd.data[o] = INK[0];
          fd.data[o + 1] = INK[1];
          fd.data[o + 2] = INK[2];
          fd.data[o + 3] = ink[(py + y0) * w + (px + x0)];
        }
      }
      fx.putImageData(fd, 0, 0);
      const out = new OffscreenCanvas(ow, oh);
      const ox = out.getContext('2d');
      ox.imageSmoothingQuality = 'high';
      ox.drawImage(full, 0, 0, ow, oh);
      const blob = await out.convertToBlob({ type: 'image/png' });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let bin = '';
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return { png: btoa(bin), width: ow, height: oh, transparentBg, darkBg, lightLogo, split: t.toFixed(2), oneTone };
    },
    { src, crop: crop ?? null, INK, MAX_H, MAX_W },
  );
}

await browser.close();
writeFileSync(join(root, 'src', 'data', 'logos.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(report.join('\n'));

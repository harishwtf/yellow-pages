// Turns each masthead illustration (design/scenes/raw/<id>.png, black ink on white, generated in Figma) into the
// page's ink on transparent paper, so the drawing prints straight onto the yellow: dark lines become ink, the white
// becomes paper. Output: src/assets/scenes/<id>-600.webp and <id>-1200.webp, trimmed, plus src/data/scenes.json with
// each drawing's size. WebP, because a drawing is one flat ink colour plus its alpha, which WebP stores far smaller than
// PNG (the header loads one on every visit).  Run: npm run scenes
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rawDir = join(root, 'design', 'scenes', 'raw');
const outDir = join(root, 'src', 'assets', 'scenes');
const INK = [0x1c, 0x1a, 0x17];
/** The header shows a drawing about 36rem wide on desktop and full width on a phone: 600 covers 1x screens, 1200 covers
 *  2x desktops and 3x phones. */
const WIDTHS = [600, 1200];
const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

// Read the sources and start Chrome first: if either fails, the drawings already in src/assets stay as they are.
const sources = readdirSync(rawDir).sort();
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const page = await browser.newPage();
const manifest = {};
const report = [];

for (const file of sources) {
  const ext = extname(file).toLowerCase();
  if (!TYPES[ext]) continue;
  const id = file.slice(0, -ext.length);
  const src = `data:${TYPES[ext]};base64,${readFileSync(join(rawDir, file)).toString('base64')}`;
  const result = await page.evaluate(
    async ({ src, INK, WIDTHS }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const c = new OffscreenCanvas(w, h);
      const x = c.getContext('2d', { willReadFrequently: true });
      x.fillStyle = '#fff';
      x.fillRect(0, 0, w, h);
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, w, h).data;
      // Ink coverage from lightness: paper white (and the faint grey a generator leaves) prints nothing, solid black
      // prints full ink, with a short ramp between for smooth line edges.
      const ink = new Uint8ClampedArray(w * h);
      for (let p = 0, i = 0; p < w * h; p++, i += 4) {
        const L = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
        ink[p] = Math.round(Math.min(1, Math.max(0, (0.82 - L) / 0.5)) * 255);
      }
      let x0 = w;
      let y0 = h;
      let x1 = -1;
      let y1 = -1;
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          if (ink[py * w + px] > 40) {
            if (px < x0) x0 = px;
            if (px > x1) x1 = px;
            if (py < y0) y0 = py;
            if (py > y1) y1 = py;
          }
        }
      }
      if (x1 < 0) return { empty: true };
      const tw = x1 - x0 + 1;
      const th = y1 - y0 + 1;
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
      const files = {};
      for (const ow of WIDTHS) {
        const oh = Math.round((th * ow) / tw);
        const out = new OffscreenCanvas(ow, oh);
        const ox = out.getContext('2d');
        ox.imageSmoothingQuality = 'high';
        ox.drawImage(full, 0, 0, ow, oh);
        // 16 levels of ink at the final size are plenty for smooth line edges and halve the file (the drawing is the
        // heaviest thing a phone loads).
        const od = ox.getImageData(0, 0, ow, oh);
        for (let i = 3; i < od.data.length; i += 4) od.data[i] = Math.round(od.data[i] / 17) * 17;
        ox.putImageData(od, 0, 0);
        const bytes = new Uint8Array(await (await out.convertToBlob({ type: 'image/webp', quality: 0.9 })).arrayBuffer());
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        files[ow] = { data: btoa(bin), height: oh };
      }
      return { files, source: `${w}×${h}`, trimmed: `${tw}×${th}` };
    },
    { src, INK, WIDTHS },
  );
  if (result.empty) {
    report.push(`${id}: EMPTY (no ink found)`);
    continue;
  }
  let kb = 0;
  for (const ow of WIDTHS) {
    const buf = Buffer.from(result.files[ow].data, 'base64');
    kb += buf.length / 1024;
    writeFileSync(join(outDir, `${id}-${ow}.webp`), buf);
  }
  const big = WIDTHS.at(-1);
  manifest[id] = { width: big, height: result.files[big].height };
  report.push(`${id}: ${result.source} → trimmed ${result.trimmed}, ${Math.round(kb)} KB for both sizes`);
}

await browser.close();
writeFileSync(join(root, 'src', 'data', 'scenes.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(report.join('\n') || 'no drawings in design/scenes/raw yet');

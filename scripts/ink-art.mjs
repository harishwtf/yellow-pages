// Turns a black-and-white illustration into a tiny 4-tone ink PNG: the paper becomes transparent and
// the lines take the theme's ink colour, so the art sits straight on the yellow page.
//   node scripts/ink-art.mjs <input.png> <output.png> [ink-hex]
// Resize first with `sips --resampleWidth <w> in.png --out tmp.png` (sips writes 8-bit RGB PNGs).
import { readFileSync, writeFileSync } from 'node:fs';
import { crc32, deflateSync, inflateSync } from 'node:zlib';

const [input, output, inkHex = '#1c1a17'] = process.argv.slice(2);
if (!input || !output) throw new Error('usage: node scripts/ink-art.mjs <input.png> <output.png> [ink-hex]');

// ── decode (8-bit, non-interlaced; grey, RGB or RGBA) ─────────────────────────
const png = readFileSync(input);
let offset = 8;
let width = 0;
let height = 0;
let colorType = 0;
const idat = [];
while (offset < png.length) {
  const length = png.readUInt32BE(offset);
  const type = png.toString('ascii', offset + 4, offset + 8);
  const data = png.subarray(offset + 8, offset + 8 + length);
  if (type === 'IHDR') {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    if (data[8] !== 8 || data[12] !== 0) throw new Error('only 8-bit, non-interlaced PNGs are supported');
    colorType = data[9];
  } else if (type === 'IDAT') {
    idat.push(data);
  }
  offset += 12 + length;
}
const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
if (!channels) throw new Error(`unsupported colour type ${colorType}`);
const raw = inflateSync(Buffer.concat(idat));
const stride = width * channels;
const pixels = Buffer.alloc(stride * height);
const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};
for (let y = 0; y < height; y++) {
  const filter = raw[y * (stride + 1)];
  const src = y * (stride + 1) + 1;
  const dst = y * stride;
  for (let x = 0; x < stride; x++) {
    const a = x >= channels ? pixels[dst + x - channels] : 0;
    const b = y > 0 ? pixels[dst + x - stride] : 0;
    const c = x >= channels && y > 0 ? pixels[dst + x - stride - channels] : 0;
    const value = raw[src + x];
    pixels[dst + x] =
      filter === 0 ? value
      : filter === 1 ? value + a
      : filter === 2 ? value + b
      : filter === 3 ? value + ((a + b) >> 1)
      : value + paeth(a, b, c);
  }
}

// ── quantise darkness to 4 levels (2 bits per pixel) ─────────────────────────
const levelOf = (darkness) => (darkness < 70 ? 0 : darkness < 130 ? 1 : darkness < 185 ? 2 : 3);
const rowBytes = Math.ceil(width / 4);
const packed = Buffer.alloc((rowBytes + 1) * height);
for (let y = 0; y < height; y++) {
  const row = y * (rowBytes + 1);
  packed[row] = 0; // filter: none
  for (let x = 0; x < width; x++) {
    const i = y * stride + x * channels;
    const luma = channels >= 3 ? 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2] : pixels[i];
    const level = levelOf(255 - luma);
    packed[row + 1 + (x >> 2)] |= level << (6 - 2 * (x & 3));
  }
}

// ── encode an indexed PNG: 4 palette entries of ink, alpha 0 / 95 / 180 / 255 ─
const ink = inkHex.replace('#', '');
const [r, g, b] = [0, 2, 4].map((i) => parseInt(ink.slice(i, i + 2), 16));
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body) >>> 0, 8 + data.length);
  return out;
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 2; // bit depth
ihdr[9] = 3; // indexed colour
writeFileSync(
  output,
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('PLTE', Buffer.from([r, g, b, r, g, b, r, g, b, r, g, b])),
    chunk('tRNS', Buffer.from([0, 95, 180, 255])),
    chunk('IDAT', deflateSync(packed, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]),
);
console.log(`${output}: ${width}×${height}`);

// Reads a Google Fonts CSS2 response on stdin, downloads the latin woff2 files to public/fonts
// (one file per family/style, with a weight range when the file is a variable font) and writes src/fonts.css.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';

const css = readFileSync(0, 'utf8');
const dir = 'public/fonts';
const faces = [];
let subset = '';
for (const chunk of css.split(/(?=\/\*\s*[a-z-]+\s*\*\/)/)) {
  const tag = chunk.match(/^\/\*\s*([a-z-]+)\s*\*\//);
  if (tag) subset = tag[1];
  if (subset !== 'latin' || !chunk.includes('@font-face')) continue;
  const family = chunk.match(/font-family:\s*'([^']+)'/)[1];
  const style = chunk.match(/font-style:\s*(\w+)/)[1];
  const weightMatch = chunk.match(/font-weight:\s*(\d+)(?:\s+(\d+))?/);
  const weight = Number(weightMatch[1]);
  const weightMax = weightMatch[2] ? Number(weightMatch[2]) : weight;
  const url = chunk.match(/url\(([^)]+)\)/)[1];
  const range = chunk.match(/unicode-range:\s*([^;]+);/)[1].trim();
  const tmp = `${dir}/.tmp-${faces.length}.woff2`;
  execFileSync('curl', ['-sL', url, '-o', tmp]);
  faces.push({ family, style, weight, weightMax, range, tmp, hash: createHash('md5').update(readFileSync(tmp)).digest('hex') });
}

const groups = new Map();
for (const face of faces) {
  const key = `${face.family}|${face.style}|${face.hash}`;
  if (!groups.has(key)) groups.set(key, { ...face, weights: [] });
  groups.get(key).weights.push(face.weight, face.weightMax);
}

let out = '/* Self-hosted Google Fonts (SIL Open Font License), latin subset. Regenerate with: npm run fonts */\n';
const keep = new Set();
for (const g of groups.values()) {
  const min = Math.min(...g.weights);
  const max = Math.max(...g.weights);
  const slug = g.family.toLowerCase().replace(/\s+/g, '-');
  const file = `${slug}-${min === max ? min : 'variable'}${g.style === 'italic' ? '-italic' : ''}.woff2`;
  if (existsSync(`${dir}/${file}`)) unlinkSync(`${dir}/${file}`);
  renameSync(g.tmp, `${dir}/${file}`);
  keep.add(file);
  out += `@font-face {\n  font-family: '${g.family}';\n  font-style: ${g.style};\n  font-weight: ${min === max ? min : `${min} ${max}`};\n  font-display: swap;\n  src: url('/fonts/${file}') format('woff2');\n  unicode-range: ${g.range};\n}\n`;
}
for (const f of readdirSync(dir)) if (!keep.has(f)) unlinkSync(`${dir}/${f}`);
writeFileSync('src/fonts.css', out);
console.log(`Wrote ${keep.size} font files and src/fonts.css`);

// Packs every built version (versions/, from `npm run versions`) into self-contained HTML files, plus an
// "All versions" viewer with every version built in, and zips them for reviewers outside the organization.
// Each file carries its own code, styles, fonts and images, so it opens with a double-click: no server,
// no account, and it still works when opened straight out of the zip.  Run with: npm run share
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const versionsDir = join(root, 'versions');
const outDir = join(root, 'share');
const bundle = join(outDir, 'Peela Pages review');
const zipName = 'peela-pages-review.zip';

const TYPES = { woff2: 'font/woff2', png: 'image/png', svg: 'image/svg+xml', jpg: 'image/jpeg', webp: 'image/webp' };
const dataUri = (file) => `data:${TYPES[file.split('.').pop()] ?? 'application/octet-stream'};base64,${readFileSync(file).toString('base64')}`;
/** Keep a script's text from closing the <script> element it is inlined into. */
const scriptSafe = (js) => js.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');

/** One built version folder → one HTML string with everything inlined. */
function pack(dir) {
  let html = readFileSync(join(dir, 'index.html'), 'utf8');
  // Fonts are inlined into the stylesheet, so the preload hints have nothing left to fetch.
  html = html.replace(/\s*<link rel="preload"[^>]*>/g, '');
  html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/g, (_, href) => {
    const cssFile = join(dir, href);
    const css = readFileSync(cssFile, 'utf8').replace(/url\((['"]?)([^)'"]+)\1\)/g, (m, q, ref) => {
      if (/^(data:|#|https?:)/.test(ref)) return m;
      const file = resolve(dirname(cssFile), ref);
      return existsSync(file) ? `url(${dataUri(file)})` : m;
    });
    return `<style>\n${css}\n</style>`;
  });
  html = html.replace(/<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/g, (_, src) => {
    let js = readFileSync(join(dir, src), 'utf8');
    // Images the components point at by path (the Phone-Book Page drawing).
    js = js.replace(/\.\/(img\/[\w.-]+\.(?:png|jpg|webp|svg))/g, (m, ref) => (existsSync(join(dir, ref)) ? dataUri(join(dir, ref)) : m));
    return `<script type="module">\n${scriptSafe(js)}\n</script>`;
  });
  html = html.replace(/(<link rel="icon"[^>]*href=")\.\/([^"]+)"/g, (m, start, ref) => (existsSync(join(dir, ref)) ? `${start}${dataUri(join(dir, ref))}"` : m));
  const leftover = html.match(/(?:src|href)="\.\/[^"]+"|url\(\.\.?\/[^)]+\)/g);
  if (leftover) throw new Error(`${dir}: still points at files: ${leftover.join(', ')}`);
  return html;
}

if (!existsSync(join(versionsDir, 'versions.json'))) throw new Error('Run `npm run versions` first.');
const list = JSON.parse(readFileSync(join(versionsDir, 'versions.json'), 'utf8'));

rmSync(outDir, { recursive: true, force: true });
mkdirSync(bundle, { recursive: true });

const htmlById = {};
for (const v of list) {
  htmlById[v.id] = pack(join(versionsDir, v.id));
  const prefix = v.draft ? 'Draft' : v.label;
  writeFileSync(join(bundle, `${prefix} - ${v.name}.html`), htmlById[v.id]);
  console.log(`packed ${prefix} - ${v.name}`);
}

// The viewer, with the list and every version built in (it shows them through blob: URLs).
let viewer = readFileSync(join(root, 'scripts', 'versions-index.html'), 'utf8').replace(/url\('fonts\/([^']+)'\)/g, (m, f) =>
  existsSync(join(versionsDir, 'fonts', f)) ? `url(${dataUri(join(versionsDir, 'fonts', f))})` : m,
);
const embedded = `<script>window.PEELA_VERSIONS = ${scriptSafe(JSON.stringify({ list, html: htmlById }))};</script>\n`;
const at = viewer.lastIndexOf('<script>');
viewer = viewer.slice(0, at) + embedded + viewer.slice(at);
writeFileSync(join(bundle, 'All versions.html'), viewer);
console.log('packed All versions');

writeFileSync(
  join(bundle, 'Read me.txt'),
  `Peela Pages: the Indiranagar move-in guide by M

Open any .html file in Chrome, Safari, Edge or Firefox (double-click it). No internet connection is needed.

- "All versions.html" puts every version side by side; pick one from the list.
- "1 - Peela Pages.html" is the current version. On a laptop it is a phone book: scroll, swipe or use the arrow
  keys to turn pages. In a narrow window or on a phone it becomes a scrolling directory.
- Map, website and app links open in your browser. Tapping a phone number to call works on phones.
`,
);

execFileSync('zip', ['-rq', zipName, 'Peela Pages review'], { cwd: outDir });
console.log(`done: ${join(outDir, zipName)}`);

// Draws the vintage 1-bit cursors (classic Mac arrow, HyperCard pointing hand, pixel I-beam) as crisp SVGs.
// X = ink, W = paper fill. A 1-pixel paper mask is added around the ink so each cursor reads on any colour.
// Colours follow the theme tokens (--color-ink, --color-card in src/index.css), never pure black or white.
//   node scripts/pixel-cursors.mjs   → design/cursors/*.svg, and the CSS cursor tokens on stdout
import { mkdirSync, writeFileSync } from 'node:fs';

const SCALE = 1.5; // each bitmap pixel is 1.5 CSS px (3 device pixels on a retina screen)
const INK = '#1c1a17'; // --color-ink
const PAPER = '#fbeaa0'; // --color-card

const CURSORS = {
  arrow: {
    fallback: 'auto',
    hotspot: [0, 0], // the bitmap pixel the click lands on
    rows: [
      'X',
      'XX',
      'XXX',
      'XXXX',
      'XXXXX',
      'XXXXXX',
      'XXXXXXX',
      'XXXXXXXX',
      'XXXXXXXXX',
      'XXXXXX',
      'XXWXXX',
      'XW.WXXX',
      '....XXX',
      '.....XXX',
      '.....XXX',
    ],
  },
  hand: {
    fallback: 'pointer',
    hotspot: [5, 0],
    // the classic Mac / HyperCard pointing hand: index finger up, thumb left, three fingers curled right
    rows: [
      '.....XX',
      '....XWWX',
      '....XWWX',
      '....XWWX',
      '....XWWXXX',
      '....XWWXWWXXX',
      '.XX.XWWXWWXWWXX',
      'XWWXXWWWWWWWWXWX',
      'XWWWXWWWWWWWWWWX',
      '.XWWWWWWWWWWWWWX',
      '..XWWWWWWWWWWWWX',
      '..XWWWWWWWWWWWX',
      '...XWWWWWWWWWWX',
      '....XWWWWWWWWX',
      '.....XWWWWWWWX',
      '.....XXXXXXXXX',
    ],
  },
  ibeam: {
    fallback: 'text',
    hotspot: [3, 7],
    rows: [
      'XXX.XXX',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      '...X',
      'XXX.XXX',
    ],
  },
};

const at = (rows, x, y) => (rows[y] && rows[y][x]) || '.';

function toSvg(rows) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const gw = w + 2;
  const gh = h + 2;
  // the bitmap sits at (1, 1); every transparent pixel touching black (8-neighbourhood) becomes white mask
  const grid = Array.from({ length: gh }, (_, y) => Array.from({ length: gw }, (_, x) => at(rows, x - 1, y - 1)));
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      if (grid[y][x] !== '.') continue;
      let touches = false;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (at(rows, x - 1 + dx, y - 1 + dy) === 'X') touches = true;
      if (touches) grid[y][x] = 'W';
    }
  }
  const paths = { X: '', W: '' };
  for (let y = 0; y < gh; y++) {
    let x = 0;
    while (x < gw) {
      const c = grid[y][x];
      if (c === '.') {
        x++;
        continue;
      }
      let end = x;
      while (end + 1 < gw && grid[y][end + 1] === c) end++;
      paths[c] += `M${x} ${y}h${end - x + 1}v1h-${end - x + 1}z`;
      x = end + 1;
    }
  }
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${gw * SCALE}" height="${gh * SCALE}" viewBox="0 0 ${gw} ${gh}" shape-rendering="crispEdges"><path fill="${PAPER}" d="${paths.W}"/><path fill="${INK}" d="${paths.X}"/></svg>`,
  };
}

const uri = (svg) =>
  `data:image/svg+xml,${encodeURIComponent(svg).replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%22/g, "'")}`;

mkdirSync('design/cursors', { recursive: true });
for (const [name, { rows, hotspot, fallback }] of Object.entries(CURSORS)) {
  const { svg } = toSvg(rows);
  writeFileSync(`design/cursors/${name}.svg`, svg + '\n');
  const [hx, hy] = hotspot.map((v) => Math.round((v + 1 + 0.5) * SCALE));
  console.log(`  --cursor-${name}: url("${uri(svg)}") ${hx} ${hy}, ${fallback};`);
}

import sizes from '../data/logos.json';

/** Ink logos printed by scripts/build-logos.mjs, keyed by the place's name as a slug. */
const urls = import.meta.glob<string>('../assets/logos/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});
const SIZES: Record<string, { width: number; height: number }> = sizes;

/** "Bharat Gas: Mahalakshmi Enterprises" → "bharat-gas-mahalakshmi-enterprises" (the logo file's name). */
export function slugOf(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface Logo {
  src: string;
  width: number;
  height: number;
}

export function logoFor(name: string): Logo | null {
  const slug = slugOf(name);
  const src = urls[`../assets/logos/${slug}.png`];
  const size = SIZES[slug];
  return src && size ? { src, ...size } : null;
}

const SMALL_WORDS = new Set(['and', 'the', 'of', 'a', 'an', 'to']);

/** Two initials for a place with no logo of its own: "R K Nursery and Pottery House" → "RK", "M – trained home cook" → "M". */
export function monogramOf(name: string): string {
  const head = name.split(/[–—:(]/)[0];
  const words = head.split(/[^A-Za-z0-9]+/).filter((w) => w && !SMALL_WORDS.has(w.toLowerCase()));
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

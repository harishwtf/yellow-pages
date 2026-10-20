/** Ink illustrations of Indiranagar for the masthead. One is shown per visit, a different one each time.
 *  Each is a transparent WebP drawn in the page ink at two widths, src/assets/scenes/<id>-600.webp and -1200.webp,
 *  made by `npm run scenes` from design/scenes/raw/<id>.png (generated in Figma from the briefs in
 *  design/scenes/places.json, which say why each place was picked and what the drawing is based on). */
import sizes from './scenes.json';

const files = import.meta.glob<string>('../assets/scenes/*.webp', { eager: true, query: '?url', import: 'default' });
/** Pixel size of each drawing's larger file (written by scripts/build-scenes.mjs), for the aspect ratio. */
const SIZES: Record<string, { width: number; height: number }> = sizes;

interface SceneEntry {
  id: string;
  /** Shown under the drawing, like a caption in a printed guide. */
  caption: string;
}

export interface Scene extends SceneEntry {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

const ENTRIES: SceneEntry[] = [
  { id: '12th-main', caption: '12th Main, HAL 2nd Stage' },
  { id: 'glens-bakehouse', caption: 'Glen’s Bakehouse, 100 Feet Road' },
  { id: 'toit', caption: 'Toit, 100 Feet Road' },
  { id: 'bobs-bar', caption: 'Bob’s Bar, 100 Feet Road' },
  { id: 'indiranagar-metro-station', caption: 'Indiranagar metro station, CMH Road' },
  { id: 'chokkanathaswamy-temple', caption: 'Chokkanathaswamy Temple, Domlur' },
];

export const SCENES: Scene[] = ENTRIES.flatMap((entry) => {
  const small = files[`../assets/scenes/${entry.id}-600.webp`];
  const large = files[`../assets/scenes/${entry.id}-1200.webp`];
  const size = SIZES[entry.id];
  return small && large && size ? [{ ...entry, ...size, src: small, srcSet: `${small} 600w, ${large} 1200w` }] : [];
});

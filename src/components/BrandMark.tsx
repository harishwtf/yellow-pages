import { logoFor, monogramOf } from '../lib/brand';
import { MWave } from './icons';

/** The slot at the start of a row: the place's own logo printed in ink, or its initials for a local shop.
 *  Logos are sized to roughly equal ink area, so a wide wordmark and a square badge carry the same weight. M's own
 *  row carries M's wave logo. */
const SLOT_W = 6; // em
const SLOT_H = 2.5; // em
const AREA = 6; // em²
/** M's wave is drawn in a 200 × 61 box. */
const WAVE_RATIO = 200 / 61;

const widthFor = (ratio: number) => Math.min(SLOT_W, Math.sqrt(AREA * ratio), SLOT_H * ratio);

export function BrandMark({ name, wave = false }: { name: string; wave?: boolean }) {
  if (wave) {
    return (
      <span className="brand" aria-hidden="true">
        <MWave className="brand__logo" style={{ width: `${widthFor(WAVE_RATIO).toFixed(2)}em` }} />
      </span>
    );
  }
  const logo = logoFor(name);
  if (!logo) {
    return (
      <span className="brand" aria-hidden="true">
        <span className="brand__monogram">{monogramOf(name)}</span>
      </span>
    );
  }
  const width = widthFor(logo.width / logo.height);
  return (
    <span className="brand" aria-hidden="true">
      <img
        className="brand__logo"
        src={logo.src}
        width={logo.width}
        height={logo.height}
        style={{ width: `${width.toFixed(2)}em` }}
        alt=""
        decoding="async"
      />
    </span>
  );
}

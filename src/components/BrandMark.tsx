import { logoFor, monogramOf } from '../lib/brand';

/** The slot at the start of a row: the place's own logo printed in ink, or its initials for a local shop.
 *  Logos are sized to roughly equal ink area, so a wide wordmark and a square badge carry the same weight. */
const SLOT_W = 6; // em
const SLOT_H = 2.5; // em
const AREA = 6; // em²

export function BrandMark({ name }: { name: string }) {
  const logo = logoFor(name);
  if (!logo) {
    return (
      <span className="brand" aria-hidden="true">
        <span className="brand__monogram">{monogramOf(name)}</span>
      </span>
    );
  }
  const ratio = logo.width / logo.height;
  const width = Math.min(SLOT_W, Math.sqrt(AREA * ratio), SLOT_H * ratio);
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

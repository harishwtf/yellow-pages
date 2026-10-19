import { COPY } from '../data/ui';
import { CountStamp, MStamp, Postmark } from './Stamps';

/** The front of the kraft notebook: stitched spine, a name label, the title, two stamps. */
export function CoverArt({ total }: { total: number }) {
  return (
    <div className="cover-art">
      <span className="cover-art__spine" aria-hidden="true" />
      <div className="cover-art__body">
        <span className="cover-art__label" aria-hidden="true">
          {COPY.coverLabel}
        </span>
        <Postmark />
        <p className="cover-art__pin" aria-hidden="true">
          <span>{COPY.pinPlace}</span>
          <span className="cover-art__rule" />
          <span>{COPY.pinCode}</span>
        </p>
        <h1 className="cover-art__title">{COPY.title}</h1>
        <p className="cover-art__sig" translate="no">
          {COPY.signature}
        </p>
      </div>
      <MStamp />
      <CountStamp count={total} label={COPY.placesInside} />
    </div>
  );
}

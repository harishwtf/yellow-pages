import { COPY } from '../data/ui';
import { MWave } from './MWave';

/** The back cover: yellow, the M wave, the closing note, and the small print. */
export function BackCover() {
  return (
    <footer className="cover mt-16">
      <div className="mx-auto max-w-[62rem] px-4 pb-10 pt-14 md:pb-12 md:pt-20">
        <MWave className="h-6 w-auto" />
        <p className="mt-6 max-w-xl text-[1.15rem] leading-snug text-pretty md:text-[1.35rem]">{COPY.closing.body}</p>
        <a className="btn btn--ink mt-6" href={COPY.closing.url} target="_blank" rel="noopener">
          {COPY.closing.cta}
          <span aria-hidden="true">↗</span>
        </a>
        <div className="mt-14 border-t border-ink/30 pt-4 text-[0.8rem] leading-relaxed">
          <p>{COPY.smallPrint}</p>
          <p className="mt-1">
            Source:{' '}
            <a className="underline underline-offset-2" href={COPY.source.url} target="_blank" rel="noopener" translate="no">
              {COPY.source.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

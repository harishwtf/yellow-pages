import { COPY } from '../data/ui';
import { SCENES } from '../data/scenes';
import { useFreshPick } from '../hooks/useFreshPick';

/** Phone-book cover masthead: the imprint between double rules, an ink drawing of an Indiranagar landmark (a
 *  different one on each visit, captioned), the title set in type with "by M", and the one-line promise. */
export function Header() {
  const [sceneIndex] = useFreshPick(SCENES.length, 'movein-guide:scene');
  const scene = SCENES[sceneIndex];

  return (
    <header className="cover mx-auto max-w-[68rem] px-4">
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-muted md:text-[0.75rem]">{COPY.imprint}</p>
      <div className="rule-double mt-2" aria-hidden="true" />
      <div className="cover__body">
        <h1 className="cover__title font-display font-bold uppercase" translate="no">
          <span className="block">The Indiranagar</span>
          <span className="block">
            Move-In Guide
            <span className="font-hand ml-2.5 inline-block -rotate-3 align-baseline text-[0.55em] font-semibold normal-case tracking-normal text-muted">
              {COPY.byline}
            </span>
          </span>
        </h1>
        <p className="cover__promise">{COPY.promise}</p>
        {scene && (
          <figure className="cover__scene">
            <img
              src={scene.src}
              srcSet={scene.srcSet}
              sizes="(min-width: 48rem) 36rem, calc(100vw - 2rem)"
              width={scene.width}
              height={scene.height}
              alt=""
              fetchPriority="high"
            />
            <figcaption>{scene.caption}</figcaption>
          </figure>
        )}
      </div>
      <div className="rule-double" aria-hidden="true" />
    </header>
  );
}

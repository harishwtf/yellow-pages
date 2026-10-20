import { COPY } from '../data/ui';
import { TRIVIA } from '../data/trivia';
import { useFreshPick } from '../hooks/useFreshPick';

/** "thehindu.com" from a source URL, to credit it under the fact. */
function siteOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** A "Did you know?" panel about Indiranagar, reversed out of the ink: a different fact on each visit, another on
 *  request, and where it comes from. */
export function Trivia() {
  const [index, setIndex] = useFreshPick(TRIVIA.length, 'movein-guide:trivia');
  if (TRIVIA.length === 0) return null;
  const fact = TRIVIA[index % TRIVIA.length];
  return (
    <aside className="trivia" aria-labelledby="trivia-heading">
      <p id="trivia-heading" className="trivia__label">
        {COPY.triviaLabel}
      </p>
      <div>
        <p className="trivia__text" aria-live="polite">
          {fact.text}
        </p>
        <div className="trivia__foot">
          <button type="button" className="paper-btn" onClick={() => setIndex((i) => (i + 1) % TRIVIA.length)}>
            {COPY.triviaNext}
          </button>
          <a
            className="trivia__source"
            href={fact.source}
            target="_blank"
            rel="noopener"
            aria-label={`${COPY.triviaSource} ${siteOf(fact.source)} (opens in a new tab)`}
          >
            {COPY.triviaSource} {siteOf(fact.source)}
          </a>
        </div>
      </div>
    </aside>
  );
}

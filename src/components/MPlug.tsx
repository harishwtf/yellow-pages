import { COPY } from '../data/ui';
import { reveal } from '../lib/reveal';
import type { Listing } from '../types';
import { Icon } from './icons';

/** M's own advert, boxed between chapters the way a directory sets an ad between sections. In ink like the rest of
 *  the page (reversed out of the ink), so it reads as part of the book rather than a banner. Its button opens M's contact
 *  form. */
export function MPlug({ listing }: { listing: Listing }) {
  return (
    <aside ref={reveal} className="plug reveal" aria-labelledby="plug-heading">
      <h2 id="plug-heading" className="plug__title">
        {COPY.plug.title}
      </h2>
      <p className="plug__text">{COPY.plug.text}</p>
      <p className="plug__kicker">{COPY.plug.kicker}</p>
      <ul className="plug__pills" aria-label={COPY.plug.servicesLabel}>
        {COPY.plug.services.map((service) => (
          <li key={service} className="pill">
            {service}
            <Icon name="check" />
          </li>
        ))}
      </ul>
      <div className="plug__foot">
        {listing.url && (
          <a
            className="paper-btn"
            href={listing.url}
            target="_blank"
            rel="noopener"
            aria-label={`${COPY.plug.cta} (opens in a new tab)`}
          >
            <Icon name="chat" />
            {COPY.plug.cta}
          </a>
        )}
        <p className="plug__tell">{COPY.plug.tellM}</p>
      </div>
    </aside>
  );
}

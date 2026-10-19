import { useEffect, useRef } from 'react';
import { COPY, OPEN_LABELS } from '../data/annotations';
import { splitPhone, telHref } from '../lib/phone';
import type { Listing } from '../types';
import { HandUnderline } from './ink/HandUnderline';
import { TornEdge } from './TornEdge';

export interface FavoriteItem {
  listing: Listing;
  sectionLabel: string;
}

interface FavoritesDrawerProps {
  open: boolean;
  items: FavoriteItem[];
  onClose: () => void;
  onRemove: (listing: Listing) => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** "My Page": starred listings on a torn-out page. Bottom sheet on phones, side panel on larger screens. */
export function FavoritesDrawer({ open, items, onClose, onRemove }: FavoritesDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-page-title"
        className="drawer-in absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[26rem] md:flex-row"
      >
        <div className="relative h-6 shrink-0 md:h-auto md:w-6">
          <TornEdge edge="top" fill="var(--color-paper)" seed={5} className="md:hidden" />
          <TornEdge edge="left" fill="var(--color-paper)" seed={9} className="hidden md:block" />
        </div>
        <div className="torn-page min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-2 md:pt-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="my-page-title" className="hand relative inline-block pr-2 text-5xl leading-none text-pen-blue">
              My Page
              <HandUnderline />
            </h2>
            <button ref={closeRef} type="button" className="icon-btn -mr-2 -mt-1" aria-label="Close My Page" onClick={onClose}>
              <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-ink-soft">
            {items.length} starred · torn out of the guide
          </p>

          {items.length === 0 ? (
            <p className="hand mt-8 text-3xl leading-tight text-pen-blue">{COPY.emptyFavorites}</p>
          ) : (
            <ul className="mt-5 divide-y divide-ink/25">
              {items.map(({ listing, sectionLabel }) => (
                <FavoriteRow key={listing.id} listing={listing} sectionLabel={sectionLabel} onRemove={onRemove} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function FavoriteRow({ listing, sectionLabel, onRemove }: FavoriteItem & { onRemove: (listing: Listing) => void }) {
  const openLabel = OPEN_LABELS[listing.linkType];
  const phone = listing.phone ? splitPhone(listing.phone) : null;
  return (
    <li className="py-3">
      <div className="leader-row">
        <h3 className="min-w-0 text-[1.05rem] font-bold uppercase leading-tight tracking-wide">{listing.name}</h3>
        <span aria-hidden="true" className="leader" />
        {phone ? (
          <a className="phone" href={telHref(listing.phone as string)} aria-label={`Call ${listing.name}: ${phone.primary}`}>
            {phone.primary}
          </a>
        ) : (
          <a
            className="phone phone--link"
            href={listing.url}
            target="_blank"
            rel="noopener"
            aria-label={`${openLabel}: ${listing.name} (opens in a new tab)`}
          >
            {openLabel}
            <span aria-hidden="true"> ↗</span>
          </a>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="text-sm text-ink-soft">
          {sectionLabel} · {listing.category}
          {listing.rating !== null && (
            <>
              {' · '}
              <span className="font-bold text-ink">
                <span aria-hidden="true">★ </span>
                <span className="sr-only">rated </span>
                {listing.rating.toFixed(1)}
              </span>
            </>
          )}
        </p>
        <div className="-my-1 flex items-center gap-1">
          {phone && (
            <a
              href={listing.url}
              target="_blank"
              rel="noopener"
              className="btn"
              aria-label={`${openLabel}: ${listing.name} (opens in a new tab)`}
            >
              {openLabel}
              <span aria-hidden="true"> ↗</span>
            </a>
          )}
          <button type="button" className="icon-btn" aria-label={`Remove ${listing.name} from My Page`} onClick={() => onRemove(listing)}>
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

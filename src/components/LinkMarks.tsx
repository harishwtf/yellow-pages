import type { ReactNode } from 'react';
import { ACTION_LABELS, COPY, PLAY_LABEL } from '../data/ui';
import { cn } from '../lib/cn';
import type { Listing } from '../types';
import { AppStoreMark, LinkIcon, PlayMark } from './icons';

interface LinkMarksProps {
  listing: Listing;
  /** `book`: compact, for the desktop pages. `phone`: 44px targets. */
  size: 'book' | 'phone';
}

/** A place's links as ink icons, as in Version 3: a globe for a website, a pin for a map, the App Store and
 *  Google Play marks for an app. "Contact M" keeps its words beside a chat icon, since an icon alone wouldn't
 *  say who you're contacting. Each link names itself for screen readers and on hover. */
export function LinkMarks({ listing, size }: LinkMarksProps) {
  const icon = size === 'phone' ? 20 : 16;
  const { name, url, linkType, androidUrl } = listing;
  const mark = (href: string, label: string, glyph: ReactNode, withText = false) => (
    <a
      key={href}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('mark', `mark--${size}`, withText && 'mark--text')}
      title={label}
      aria-label={withText ? undefined : `${label}: ${name} (${COPY.newTab})`}
    >
      {glyph}
      {withText && (
        <>
          {label}
          <span className="sr-only"> ({COPY.newTab})</span>
        </>
      )}
    </a>
  );

  return (
    <span className="marks">
      {linkType === 'app' && mark(url, ACTION_LABELS.app, <AppStoreMark size={icon} />)}
      {linkType === 'app' && androidUrl && mark(androidUrl, PLAY_LABEL, <PlayMark size={icon} />)}
      {linkType === 'maps' && mark(url, ACTION_LABELS.maps, <LinkIcon name="pin" size={icon} />)}
      {linkType === 'website' && mark(url, ACTION_LABELS.website, <LinkIcon name="globe" size={icon} />)}
      {linkType === 'contact' && mark(url, ACTION_LABELS.contact, <LinkIcon name="chat" size={icon} />, true)}
    </span>
  );
}

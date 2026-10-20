import { useCallback } from 'react';
import { Book } from './components/Book';
import { PhoneDirectory } from './components/PhoneDirectory';
import { PressFilter } from './components/PressFilter';
import { Toast } from './components/Toast';
import listings from './data/listings.json';
import { COPY } from './data/ui';
import { useMedia } from './hooks/useMedia';
import { useToast } from './hooks/useToast';
import { copyText } from './lib/clipboard';
import type { GuideData } from './types';

const guide = listings as GuideData;

/** Wide screens get the page-turning book; phones and tablets get the same directory as one scrolling page. */
export default function App() {
  const spread = useMedia('(min-width: 1024px)');
  const { toast, show } = useToast();
  const handleCopy = useCallback(
    async (phone: string) => {
      show((await copyText(phone)) ? COPY.copied : COPY.copyFailed);
    },
    [show],
  );
  return (
    <>
      <PressFilter />
      <main>
        {spread ? (
          <Book sections={guide.sections} onCopy={handleCopy} />
        ) : (
          <PhoneDirectory sections={guide.sections} onCopy={handleCopy} />
        )}
      </main>
      <Toast toast={toast} />
    </>
  );
}

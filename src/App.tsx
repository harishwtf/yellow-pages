import { useCallback, useEffect, useRef } from 'react';
import { BackCover } from './components/BackCover';
import { BookStage } from './components/BookStage';
import { Toast } from './components/Toast';
import listings from './data/listings.json';
import { COPY } from './data/ui';
import { useBook } from './hooks/useBook';
import { useOpenProgress } from './hooks/useOpenProgress';
import { useToast } from './hooks/useToast';
import { copyText } from './lib/clipboard';
import type { GuideData } from './types';

const guide = listings as GuideData;
const ids = guide.sections.map((s) => s.id);

export default function App() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { open, openFully: openBook, reduced } = useOpenProgress(trackRef, stageRef);
  const { current, shown, turn, goTo, linkedOnLoad } = useBook(ids, !reduced);
  const { toast, show } = useToast();

  // A link straight to a section (#kitchen) lands with the book already open there.
  useEffect(() => {
    if (linkedOnLoad) openBook(true);
  }, [linkedOnLoad, openBook]);

  /** A bookmark turns the pages when the book is open; on a closed book it opens straight to that section. */
  const pick = useCallback(
    (index: number) => {
      if (open) {
        goTo(index, true);
        return;
      }
      goTo(index, false);
      openBook();
    },
    [open, goTo, openBook],
  );

  // ← and → turn the pages once the book is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight') goTo(current + 1, true);
      if (event.key === 'ArrowLeft') goTo(current - 1, true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, current, goTo]);

  const handleCopy = useCallback(
    async (phone: string) => {
      show((await copyText(phone)) ? COPY.copied : COPY.copyFailed);
    },
    [show],
  );

  return (
    <>
      <main>
        <BookStage
          ref={trackRef}
          stageRef={stageRef}
          sections={guide.sections}
          current={current}
          shown={shown}
          turn={turn}
          open={open}
          onOpenBook={() => openBook()}
          onPick={pick}
          onCopy={handleCopy}
        />
      </main>
      <BackCover />
      <Toast toast={toast} />
    </>
  );
}

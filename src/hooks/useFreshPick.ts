import { useEffect, useState } from 'react';
import { pickNew } from '../lib/rotate';
import { readStorage, writeStorage } from '../lib/storage';

/** Which of `count` items to show: a different one on each visit, random but never the one shown last time.
 *  The index is remembered once it is on screen (not while picking), so the next visit always skips it. */
export function useFreshPick(count: number, storageKey: string) {
  const [index, setIndex] = useState(() => pickNew(count, readStorage<number>(storageKey, -1)));
  useEffect(() => {
    if (count > 1) writeStorage(storageKey, index);
  }, [count, storageKey, index]);
  return [index, setIndex] as const;
}

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
}

/** One short toast at a time. */
export function useToast(duration = 1800) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback(
    (text: string) => {
      window.clearTimeout(timer.current);
      setToast({ id: Date.now(), text });
      timer.current = window.setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { toast, notify };
}

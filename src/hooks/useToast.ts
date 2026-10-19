import { useCallback, useEffect, useRef, useState } from 'react';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessage {
  id: number;
  text: string;
  action?: ToastAction;
}

/** One toast at a time. A toast with an action (e.g. Undo) stays up longer. */
export function useToast(duration = 1700, actionDuration = 6000) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback(
    (text: string, action?: ToastAction) => {
      window.clearTimeout(timer.current);
      setToast({ id: Date.now(), text, action });
      timer.current = window.setTimeout(() => setToast(null), action ? actionDuration : duration);
    },
    [duration, actionDuration],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { toast, show, dismiss };
}

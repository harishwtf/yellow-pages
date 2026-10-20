import { useEffect, useState } from 'react';

/** The section being read: the last one whose top has passed `line` px from the top of the window. */
export function useActiveSection(ids: string[], line: number): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    const list = key.split('|');
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (!el || el.getBoundingClientRect().top > line) break;
        current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [key, line]);

  return active;
}

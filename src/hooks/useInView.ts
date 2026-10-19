import { useEffect, useRef, useState } from 'react';

const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window;

/** True once the element has scrolled into view (sticks to true). Browsers without
 *  IntersectionObserver treat everything as in view. */
export function useInView<T extends Element>(threshold = 0.5) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(!canObserve);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canObserve) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

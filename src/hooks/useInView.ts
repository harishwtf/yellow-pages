import { useEffect, useRef, useState, type RefObject } from 'react';

const supported = typeof window !== 'undefined' && 'IntersectionObserver' in window;

/** True once the element has scrolled into view; it stays true. Without IntersectionObserver it is true from the start. */
export function useInView<T extends Element>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(!supported);

  useEffect(() => {
    const el = ref.current;
    if (!el || !supported) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

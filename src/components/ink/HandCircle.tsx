import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../lib/cn';

interface HandCircleProps {
  children: ReactNode;
  /** When false, renders the children with no circle. */
  active?: boolean;
  className?: string;
}

/** A wobbly red-pen loop around its children that draws itself in on scroll. */
export function HandCircle({ children, active = true, className }: HandCircleProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      {children}
      {active && (
        <svg
          aria-hidden="true"
          className={cn('hand-draw pointer-events-none absolute text-pen-red', inView && 'is-inview')}
          style={{ left: "-0.7em", right: "-0.6em", top: "-0.4em", bottom: "-0.35em", width: "auto", height: "auto" }}
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M14 27 C 9 13, 34 3, 57 4 C 81 5, 98 14, 96 28 C 94 42, 64 50, 37 48 C 15 46, 2 38, 7 25 C 11 15, 26 9, 44 8"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={100}
          />
        </svg>
      )}
    </span>
  );
}

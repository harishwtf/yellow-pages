import { COPY } from '../data/ui';

export function EmptyState() {
  return <p className="py-16 text-center text-[1.05rem] text-muted text-pretty">{COPY.empty}</p>;
}

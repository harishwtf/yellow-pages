import type { IconName } from './icons';
import { Icon } from './icons';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  hint: string;
}

export function EmptyState({ icon, title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <span className="badge bg-accent-soft text-ink" aria-hidden="true">
        <Icon name={icon} />
      </span>
      <p className="mt-4 font-display text-[1.25rem] font-semibold">{title}</p>
      <p className="mt-1 max-w-xs text-[0.95rem] text-muted text-pretty">{hint}</p>
    </div>
  );
}

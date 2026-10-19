import type { ToastMessage } from '../hooks/useToast';
import { cn } from '../lib/cn';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

/** A handwritten status message near the bottom of the screen, with an optional action such as Undo. */
export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div role="status" aria-live="polite" className="toast-region pointer-events-none fixed inset-x-0 z-[70] flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          className={cn(
            'toast-pop flex items-center gap-3 rounded bg-paper/95 px-3 py-1',
            toast.action && 'toast-pop--sticky pointer-events-auto shadow-lift',
          )}
        >
          <span className="hand inline-block -rotate-2 text-3xl leading-none text-pen-blue">{toast.text}</span>
          {toast.action && (
            <button
              type="button"
              className="btn btn--solid"
              onClick={() => {
                toast.action?.onClick();
                onDismiss();
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

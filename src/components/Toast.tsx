import type { ToastMessage } from '../hooks/useToast';

/** A handwritten status message that pops up near the bottom of the screen. */
export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
      {toast && (
        <span key={toast.id} className="toast-pop hand rounded bg-paper/90 px-3 py-1 text-3xl leading-none text-pen-blue">
          {toast.text}
        </span>
      )}
    </div>
  );
}

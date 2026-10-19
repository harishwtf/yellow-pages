import type { ToastMessage } from '../hooks/useToast';

export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-50 flex justify-center px-4"
    >
      {toast && (
        <p key={toast.id} className="toast">
          {toast.text}
        </p>
      )}
    </div>
  );
}

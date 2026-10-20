import type { ToastMessage } from '../hooks/useToast';

interface ToastProps {
  toast: ToastMessage | null;
}

export function Toast({ toast }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-[95] flex justify-center px-4"
    >
      {toast && (
        <div key={toast.id} className="toast pointer-events-auto">
          {toast.text}
        </div>
      )}
    </div>
  );
}

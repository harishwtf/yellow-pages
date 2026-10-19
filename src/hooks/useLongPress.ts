import { useRef, type MouseEvent, type PointerEvent } from 'react';

/** Touch-and-hold on a link runs `onLongPress` instead of following the link. A mouse is left alone. */
export function useLongPress(onLongPress: () => void, delay = 500) {
  const timer = useRef<number | undefined>(undefined);
  const fired = useRef(false);
  const touch = useRef(false);

  const clear = () => window.clearTimeout(timer.current);
  const start = (event: PointerEvent) => {
    touch.current = event.pointerType !== 'mouse';
    if (!touch.current) return;
    fired.current = false;
    clear();
    timer.current = window.setTimeout(() => {
      fired.current = true;
      onLongPress();
    }, delay);
  };
  const onClick = (event: MouseEvent) => {
    if (fired.current) {
      event.preventDefault();
      fired.current = false;
    }
  };
  const onContextMenu = (event: MouseEvent) => {
    if (touch.current) event.preventDefault();
  };

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onPointerMove: clear,
    onClick,
    onContextMenu,
  };
}

import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';
import { createWheelGesture } from '../lib/wheelGesture';

/** Scroll distances, in viewport heights: one stretch swings the cover open, then one per page turn.
 *  Snap points sit at the end of each stretch so a scroll always settles on a whole page. */
export const OPEN_VH = 0.9;
export const TURN_VH = 0.75;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Chrome on macOS flags every trackpad and Magic Mouse glide (WheelEvent.momentum), so the flag can be trusted
 *  from the very first gesture. Elsewhere the wheel reader starts trusting it once it has seen a flagged event. */
const flagsGlides = typeof WheelEvent !== 'undefined' && 'momentum' in WheelEvent.prototype && /Mac/i.test(navigator.platform);
/** Where the first spread rests, and the length of one turn, in whole pixels so resting points are exact. */
const turnStart = (h: number) => Math.round(h * OPEN_VH);
const turnLength = (h: number) => Math.round(h * TURN_VH);

/** Maps the page's scroll position to the book: --p (cover, 0 → 1) and --f (the leaf turning, 0 → 1) on
 *  the stage, plus `step`, the spread or page the book rests on. With reduced motion nothing animates:
 *  the cover and pages simply switch at the halfway mark.
 *
 *  --f is always measured from the spread React has actually drawn. When a turn completes, the drawn leaf
 *  is held fully turned (which looks exactly like the next spread) until React draws the next spread, and
 *  the real value is applied in a layout effect before paint. So pages and bookmarks never snap back. */
export function useBookScroll(track: RefObject<HTMLElement | null>, stage: RefObject<HTMLElement | null>, turns: number) {
  const [reduced] = useState(prefersReducedMotion);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [vh, setVh] = useState(() => window.innerHeight);

  /** The spread currently drawn on screen, and the function that applies scroll to the stage. */
  const drawn = useRef(0);
  const apply = useRef<() => void>(() => {});

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = window.innerHeight;
      const scrolled = -(track.current?.getBoundingClientRect().top ?? 0);
      let p = clamp(scrolled / turnStart(h), 0, 1);
      if (p > 0.995) p = 1;
      let t = clamp((scrolled - turnStart(h)) / turnLength(h), 0, turns);
      // Within a few pixels of a page is on that page: a smooth scroll can stop a hair short, and the
      // book must not treat that as a turn still in progress (which shows the unclickable turning copy).
      if (Math.abs(t - Math.round(t)) * turnLength(h) < 3) t = Math.round(t);
      let k = Math.min(Math.floor(t), turns);
      // How far the drawn spread's leaf has turned (0 → 1), even if scroll has already reached the next one.
      let f = clamp(t - drawn.current, 0, 1);
      if (drawn.current >= turns) f = 0;
      if (reduced) {
        p = p >= 0.5 ? 1 : 0;
        k = Math.round(t);
        f = 0;
      }
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--f', f.toFixed(4));
      // At rest, the 3D pieces are swapped for flat ones so text stays crisp.
      el.setAttribute('data-still', String(f < 0.002));
      el.setAttribute('data-full', String(p > 0.985));
      setOpen(p > 0.6);
      setStep(k);
    };
    apply.current = update;
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const resize = () => {
      setVh(window.innerHeight);
      schedule();
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, stage, track, turns]);

  // A new spread has been drawn: measure the turn from it, before the browser paints.
  useLayoutEffect(() => {
    drawn.current = step;
    apply.current();
  }, [step]);

  /** Where the book is heading: the resting point a scroll is on its way to, or null when it's at rest.
   *  Every move is measured from here, so a second press, click or swipe during a turn goes one page
   *  further instead of re-aiming at the page the book is already turning to. */
  const dest = useRef<number | null>(null);
  const destTimer = useRef<number | undefined>(undefined);

  /** The resting point nearest the current scroll position: -1 is the closed book. */
  const restingNow = () => {
    const el = track.current;
    if (!el) return -1;
    const h = window.innerHeight;
    const scrolled = -el.getBoundingClientRect().top;
    if (scrolled < turnStart(h) / 2) return -1;
    return clamp(Math.round((scrolled - turnStart(h)) / turnLength(h)), 0, turns);
  };

  /** Scroll to a resting point: -1 is the closed book, 0 the first spread, and so on. */
  const goTo = (target: number, instant = false) => {
    const el = track.current;
    if (!el) return;
    const h = window.innerHeight;
    const k = clamp(target, -1, turns);
    const offset = k < 0 ? 0 : turnStart(h) + k * turnLength(h);
    const top = Math.round(el.getBoundingClientRect().top + window.scrollY + offset);
    dest.current = instant || reduced ? null : k;
    window.clearTimeout(destTimer.current);
    // If the scroll is interrupted (say, by dragging the scrollbar), forget the destination soon after.
    destTimer.current = window.setTimeout(() => (dest.current = null), 1200);
    window.scrollTo({ top, behavior: instant || reduced ? 'auto' : 'smooth' });
  };

  /** One page forward (1) or back (-1) from where the book is heading. */
  const turnBy = (dir: 1 | -1) => {
    const from = dest.current ?? restingNow();
    const target = from + dir;
    if (target < -1 || target > turns || target === from) return;
    goTo(target);
  };

  const navRef = useRef({ goTo, turnBy });
  useEffect(() => {
    navRef.current = { goTo, turnBy };
  });

  // The destination is reached (or the scroll ended elsewhere): the book is at rest again.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    /** When the last scroll reached its destination. Chrome reports that scroll's end (scrollend) 30-70ms
     *  later, and by then a new press may be heading on: that late scrollend isn't the new scroll's. */
    let arrivedAt = -Infinity;
    const check = () => {
      if (dest.current === null) return;
      const h = window.innerHeight;
      const scrolled = -el.getBoundingClientRect().top;
      const at = dest.current < 0 ? 0 : turnStart(h) + dest.current * turnLength(h);
      if (Math.abs(scrolled - at) < 3) {
        dest.current = null;
        arrivedAt = performance.now();
      }
    };
    // A scroll that ended without arriving (say, the scrollbar was dragged) leaves the book wherever it is.
    const ended = () => {
      if (performance.now() - arrivedAt < 300) arrivedAt = -Infinity;
      else dest.current = null;
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('scrollend', ended);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('scrollend', ended);
      window.clearTimeout(destTimer.current);
    };
  }, [track]);

  /** One gesture turns one page: a wheel or trackpad swipe, a key press, a touch swipe. The wheel stream is
   *  read by createWheelGesture (glides ignored, new swipes always counted). Its memory lives in a ref and
   *  the listeners are registered once, so re-measuring the pages can't reset a swipe halfway through. */
  const wheel = useRef(createWheelGesture({ trustFlag: flagsGlides }));
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    // Where the track sits, cached so a wheel event doesn't force a layout while a turn is drawing.
    let trackTop = 0;
    let trackHeight = 0;
    const measure = () => {
      trackTop = el.getBoundingClientRect().top + window.scrollY;
      trackHeight = el.offsetHeight;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    /** Whether the book fills the screen (the track covers the viewport). */
    const inBook = () => window.scrollY >= trackTop - 1 && window.scrollY + window.innerHeight <= trackTop + trackHeight + 1;
    /** Inside the search panel, scrolling and keys belong to the panel. */
    const inPanel = (event: Event) => (event.target as HTMLElement | null)?.closest?.('[data-free-scroll]');

    // A frame clock while wheel input is coming in: a gap in the input only counts as a pause if the page
    // kept drawing frames through it (if it didn't, the page was busy and the browser bunched the events).
    // While the page works through a backlog every frame delivers another event, so the frame must also have
    // come after the page finished with the event before the gap; and an event handled long after it
    // happened says the page is behind, so its gap can't be trusted either.
    let lastFrame = -Infinity;
    let lastWheel = -Infinity;
    let prevWheel = -Infinity;
    let late = false;
    let ticking = false;
    const tick = (now: number) => {
      lastFrame = now;
      if (now - lastWheel < 1000) window.requestAnimationFrame(tick);
      else ticking = false;
    };
    const frameAfter = (t: number) => !late && lastFrame > t && lastFrame > prevWheel;

    // One axis per swipe: on a diagonal swipe the larger of deltaX and deltaY can swap from event to event,
    // and with opposite signs that would read as the swipe reversing. The axis only changes on a clear switch.
    let axis: 'x' | 'y' | null = null;
    let ax = 0;
    let ay = 0;
    let axisT = -Infinity;
    let axisMomentum = false;

    const onWheel = (event: WheelEvent) => {
      if (inPanel(event)) {
        // The results list scrolls; the dimmed page behind it stays put.
        if (!(event.target as HTMLElement).closest('.search-results')) event.preventDefault();
        return;
      }
      if (event.ctrlKey || !inBook()) return; // pinch-zoom, or outside the book
      event.preventDefault();
      prevWheel = lastWheel;
      lastWheel = performance.now();
      late = lastWheel - event.timeStamp > 100;
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(tick);
      }
      // Lines and pages (some mice, Firefox) in pixels.
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const momentum = 'momentum' in event ? Boolean((event as WheelEvent & { momentum?: boolean }).momentum) : undefined;
      // A new swipe: a pause, or fresh fingers after a glide.
      if (event.timeStamp - axisT > 120 || (axisMomentum && momentum !== true)) {
        axis = null;
        ax = ay = 0;
      }
      axisT = event.timeStamp;
      axisMomentum = momentum === true;
      ax = ax * 0.8 + Math.abs(event.deltaX * unit);
      ay = ay * 0.8 + Math.abs(event.deltaY * unit);
      if (!axis) {
        if (Math.max(ax, ay) >= 4) axis = ay >= ax ? 'y' : 'x';
      } else if (axis === 'y' ? ax > 3 * ay : ay > 3 * ax) axis = axis === 'y' ? 'x' : 'y';
      const d = ((axis ?? (ay >= ax ? 'y' : 'x')) === 'y' ? event.deltaY : event.deltaX) * unit;
      const dir = wheel.current({ t: event.timeStamp, d, momentum }, frameAfter);
      if (dir) navRef.current.turnBy(dir);
    };

    let startX = 0;
    let startY = 0;
    const onTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (inPanel(event)) return;
      if (inBook() && event.cancelable) event.preventDefault();
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (inPanel(event) || !inBook()) return;
      const dx = startX - event.changedTouches[0].clientX;
      const dy = startY - event.changedTouches[0].clientY;
      const along = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(along) > 40) navRef.current.turnBy(along > 0 ? 1 : -1);
    };

    // Whether focus last moved with a pointer. Chrome leaves a clicked button focused, but Space after a click
    // still means "turn the page"; once Tab moves focus, Space presses the focused button again.
    let pointerFocus = false;
    const onPointerDown = () => (pointerFocus = true);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') pointerFocus = false;
      if (event.altKey || event.ctrlKey || event.metaKey || !inBook() || inPanel(event)) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;
      // Space on a button focused from the keyboard presses it rather than turning the page.
      if (event.key === ' ' && !pointerFocus && target?.closest('button, [role="button"]')) return;
      const forward = ['ArrowDown', 'PageDown', 'ArrowRight'].includes(event.key) || (event.key === ' ' && !event.shiftKey);
      const backward = ['ArrowUp', 'PageUp', 'ArrowLeft'].includes(event.key) || (event.key === ' ' && event.shiftKey);
      if (!forward && !backward) return;
      event.preventDefault();
      // Each press turns a page; holding a key pages steadily, one turn at a time.
      if (event.repeat && dest.current !== null) return;
      navRef.current.turnBy(forward ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [track]);

  /** The track's height and its snap points, in px. */
  const openPx = turnStart(vh);
  const turnPx = turnLength(vh);
  const snaps = [0, ...Array.from({ length: turns + 1 }, (_, k) => openPx + k * turnPx)];
  const height = vh + openPx + turns * turnPx;

  return { open, step, goTo, turnBy, snaps, height, reduced };
}

/** One page per gesture, from a stream of wheel events.
 *
 *  A trackpad swipe arrives as many wheel events, then the browser keeps sending smaller ones as the
 *  scroll glides (momentum). A swipe should turn exactly one page, its glide none, and a new swipe one
 *  more, even if it starts while the last one is still gliding. `feed` returns +1 or -1 when a page
 *  should turn, otherwise 0.
 *
 *  New gestures are recognised by:
 *  - a real pause (one where the page kept drawing frames, so it wasn't just busy and bunching events);
 *  - a change of direction (momentum never reverses);
 *  - the browser's own flag where it has one (WheelEvent.momentum: the first event without it after a
 *    glide is fresh fingers);
 *  - otherwise, once a flick is clearly gliding, a hole in its steady event rhythm or a sharp speed-up.
 *
 *  Prototyped and tuned against 1,975 simulated macOS trackpad streams with no double turns. */

export interface WheelSample {
  /** event.timeStamp: when the input happened, in ms. */
  t: number;
  /** Signed distance on the main axis, in px. */
  d: number;
  /** WheelEvent.momentum where the browser provides it. */
  momentum?: boolean;
}

const P = {
  GAP: 120, // ms of real silence that ends a gesture
  TURN_PX: 4, // px a clean new gesture travels before it turns (a light scroll or one mouse notch)
  MIN_INTERVAL: 160, // ms between two turns
  // Used only when the browser gives no momentum flag:
  PEAK_MIN: 0.8, // px/ms a gesture must reach for its slowing down to count as a glide (a real flick)
  COAST_N: 4, // slowing samples in a row, under COAST_FRAC of the peak, to call it gliding
  COAST_FRAC: 0.85,
  MICRO_GAP: 45, // ms: while gliding, a hole this long in the 8–17ms rhythm means fingers touched down
  RISE: 2, // speed over the glide's slowest point that marks a new flick
  V_ABS: 0.35, // px/ms a flick detected that way must reach before it turns (about 6px a frame)
};

interface Gesture {
  dir: number;
  kind: 'clean' | 'armed';
  spent: boolean;
  acc: number;
  peak: number;
  coasting: boolean;
  flat: number;
  floor: number;
  prevV: number;
}

export function createWheelGesture() {
  let lastT = -Infinity;
  let lastTurnT = -Infinity;
  let prevMomentum = false;
  let flagMode = false;
  let g: Gesture | null = null;
  let hist: Array<{ t: number; a: number }> = [];
  const start = (dir: number, kind: Gesture['kind']): Gesture => ({
    dir,
    kind,
    spent: false,
    acc: 0,
    peak: 0,
    coasting: false,
    flat: 0,
    floor: Infinity,
    prevV: 0,
  });

  /** `frameAfter(t)`: whether the page drew a frame after time t, to tell a real pause from a busy page. */
  return function feed(e: WheelSample, frameAfter: (t: number) => boolean = () => true): -1 | 0 | 1 {
    const { d, t } = e;
    if (!(Math.abs(d) >= 0.5)) return 0;
    if (e.momentum === true) flagMode = true;
    const dir = Math.sign(d);
    const dt = t - lastT;
    hist.push({ t, a: Math.abs(d) });
    if (hist.length > 3) hist.shift();
    // Speed over the last two intervals: survives bunched events (summed delta, newest time) and timer jitter.
    const v =
      hist.length === 3 ? (hist[1].a + hist[2].a) / Math.max(t - hist[0].t, 12) : Math.abs(d) / Math.max(Math.min(dt, 50), 12);
    const quiet = (ms: number) => dt > ms && (dt > 600 || frameAfter(lastT + Math.min(ms, 40)));

    let kind: Gesture['kind'] | null = null;
    if (!g || quiet(P.GAP)) kind = 'clean';
    else if (dir !== g.dir && Math.abs(d) >= 2) kind = 'clean';
    else if (flagMode) {
      if (e.momentum === false && prevMomentum) kind = 'clean';
    } else if (g.coasting) {
      if (quiet(P.MICRO_GAP)) kind = 'armed';
      else if (v >= P.RISE * g.floor && v >= P.V_ABS) kind = 'armed';
    }
    if (kind) {
      g = start(dir, kind);
      if (dt > P.GAP) hist = [{ t, a: Math.abs(d) }];
    }
    const cur = g!;
    lastT = t;
    prevMomentum = e.momentum === true;

    cur.peak = Math.max(cur.peak, v);
    cur.flat = v <= cur.prevV * 1.02 ? cur.flat + 1 : 0;
    cur.prevV = v;
    if (!cur.coasting && cur.peak >= P.PEAK_MIN && cur.flat >= P.COAST_N && v <= P.COAST_FRAC * cur.peak) cur.coasting = true;
    if (cur.coasting) cur.floor = Math.min(cur.floor, v);

    if (e.momentum === true || cur.spent) return 0; // a glide never turns a page
    cur.acc += d;
    const ready = cur.kind === 'clean' ? Math.abs(cur.acc) >= P.TURN_PX : v >= P.V_ABS && Math.abs(cur.acc) >= 3 * P.TURN_PX;
    if (ready && t - lastTurnT >= P.MIN_INTERVAL) {
      cur.spent = true;
      lastTurnT = t;
      return dir as -1 | 1;
    }
    return 0;
  };
}

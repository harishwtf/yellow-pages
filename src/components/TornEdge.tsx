interface TornEdgeProps {
  /** Which edge of the parent this sits on. The jagged shape is filled with `fill`. */
  edge: 'bottom' | 'top' | 'left';
  fill: string;
  seed?: number;
  className?: string;
}

const LENGTH = 1200;
const DEPTH = 24;
const SEGMENTS = 70;

function tearProfile(seed: number): Array<[number, number]> {
  let state = seed;
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const along = (i / SEGMENTS) * LENGTH;
    const depth = DEPTH * 0.2 + random() * DEPTH * 0.7;
    points.push([along, depth]);
  }
  return points;
}

/** A torn-paper edge. For `bottom` and `top` the fill covers the area below the tear;
 *  for `left` it covers the area to the right of it. */
export function TornEdge({ edge, fill, seed = 11, className }: TornEdgeProps) {
  const profile = tearProfile(seed);
  const vertical = edge === 'left';
  const line = profile.map(([along, depth]) => (vertical ? `${depth},${along}` : `${along},${depth}`)).join(' ');
  const polygon = vertical ? `${DEPTH},0 ${line} ${DEPTH},${LENGTH}` : `0,${DEPTH} ${line} ${LENGTH},${DEPTH}`;
  const viewBox = vertical ? `0 0 ${DEPTH} ${LENGTH}` : `0 0 ${LENGTH} ${DEPTH}`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="none"
      style={
        vertical
          ? { position: 'absolute', top: 0, bottom: 0, left: 0, width: DEPTH, height: '100%' }
          : {
              position: 'absolute',
              left: 0,
              right: 0,
              width: '100%',
              height: DEPTH,
              ...(edge === 'bottom' ? { bottom: -1 } : { top: 0 }),
            }
      }
    >
      <polygon points={polygon} style={{ fill }} />
      <polyline points={line} fill="none" stroke="rgba(28,26,23,0.08)" strokeWidth="4" vectorEffect="non-scaling-stroke" />
      <polyline points={line} fill="none" stroke="rgba(28,26,23,0.22)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

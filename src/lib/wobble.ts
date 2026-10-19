/** Deterministic pseudo-random value in [-max, max] for a given seed (stable across renders). */
export function wobble(seed: string, max = 0.6): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (((h % 1000) / 1000) * 2 - 1) * max;
}

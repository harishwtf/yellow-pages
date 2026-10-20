/** A random index into `count` items that is never `last` (the one shown last time; -1 for none). */
export function pickNew(count: number, last: number): number {
  if (count <= 1) return 0;
  let next = Math.floor(Math.random() * (count - 1));
  if (next >= last && last >= 0) next += 1;
  return next;
}

/** Groups listings under their category, in the order the categories first appear. */
export function groupByCategory<T extends { category: string }>(items: T[]): Array<{ category: string; items: T[] }> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category)!.push(item);
  }
  return Array.from(groups, ([category, list]) => ({ category, items: list }));
}

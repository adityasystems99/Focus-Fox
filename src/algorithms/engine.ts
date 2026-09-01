import type { SortEvent } from "../types/sorting";

export const compare = (indices: [number, number], line: number, text?: string): SortEvent => ({ type: "compare", indices, line, text });
export const swap = (indices: [number, number], line: number, text?: string): SortEvent => ({ type: "swap", indices, line, text });
export const overwrite = (index: number, value: number, line: number, text?: string): SortEvent => ({ type: "overwrite", index, value, line, text });
export const markSorted = (indices: number[], text?: string): SortEvent => ({ type: "markSorted", indices, text });
export const message = (text: string, line = 0): SortEvent => ({ type: "message", text, line });

export function applyEvent(array: number[], event: SortEvent): void {
  if (event.type === "swap") [array[event.indices[0]], array[event.indices[1]]] = [array[event.indices[1]], array[event.indices[0]]];
  if (event.type === "overwrite") array[event.index] = event.value;
}

export function consumeEvents(input: number[], events: Iterable<SortEvent>) {
  const array = [...input];
  const stats = { comparisons: 0, swaps: 0, writes: 0, iterations: 0 };
  const collected: SortEvent[] = [];
  for (const event of events) { collected.push(event); applyEvent(array, event); if (event.type === "compare") stats.comparisons++; if (event.type === "swap") { stats.swaps++; stats.writes += 2; } if (event.type === "overwrite") stats.writes++; if (["compare", "swap", "overwrite"].includes(event.type)) stats.iterations++; }
  return { array, stats, events: collected };
}
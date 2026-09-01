import type { SortEvent } from "../sorting";

// Compare two indices
export function* compare(
  indices: [number, number],
  line: number,
  text?: string
): IterableIterator<SortEvent> {
  yield {
    type: "compare",
    indices,
    line,
    text,
  };
}

// Swap two indices
export function* swap(
  indices: [number, number],
  line: number,
  text?: string
): IterableIterator<SortEvent> {
  yield {
    type: "swap",
    indices,
    line,
    text,
  };
}

// Overwrite a value at a given index
export function* overwrite(
  index: number,
  value: number,
  line: number,
  text?: string
): IterableIterator<SortEvent> {
  yield {
    type: "overwrite",
    index,
    value,
    line,
    text,
  };
}

// Mark indices as sorted
export function* sorted(
  indices: number[],
  line: number = 0,
  text?: string
): IterableIterator<SortEvent> {
  yield {
    type: "markSorted",
    indices,
    line,
    text,
  };
}

// Display a message
export function* message(
  text: string,
  line: number = 0
): IterableIterator<SortEvent> {
  yield {
    type: "message",
    text,
    line,
  };
}

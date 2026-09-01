import type { SortEvent } from "../types/sorting";
import { compare, markSorted, message, overwrite, swap } from "./engine";

function* simpleSort(input: number[], name: string): Generator<SortEvent> {
  const a = [...input];
  yield message(`${name} is processing the array`);
  for (let gap = name === "Shell Sort" ? Math.floor(a.length / 2) || 1 : 1; gap >= 1; gap = gap === 1 ? 0 : Math.floor(gap / 2)) {
    for (let i = gap; i < a.length; i++) { const value = a[i]; let j = i; while (j >= gap) { yield compare([j - gap, j], 2, `Comparing ${a[j - gap]} and ${value}`); if (a[j - gap] <= value) break; a[j] = a[j - gap]; yield overwrite(j, a[j], 3); j -= gap; } a[j] = value; yield overwrite(j, value, 4); }
  }
  yield markSorted(a.map((_, i) => i));
}

export function* countingSort(input: number[]): Generator<SortEvent> { const a = [...input]; if (!a.length) return; const min = Math.min(...a), max = Math.max(...a); if (max - min > 10000) { yield message("Value range is too large for a frequency table; using comparison fallback."); yield* simpleSort(a, "Counting Sort"); return; } const counts = Array(max - min + 1).fill(0) as number[]; for (const value of a) { counts[value - min]++; yield message(`Counting occurrences of value ${value}`, 1); } let index = 0; for (let offset = 0; offset < counts.length; offset++) { for (let i = 0; i < counts[offset]; i++) { const value = offset + min; a[index] = value; yield overwrite(index++, value, 3, `Writing ${value}`); } } yield markSorted(a.map((_, i) => i)); }
export function* radixSort(input: number[]): Generator<SortEvent> { const a = [...input]; if (a.some((v) => v < 0)) { yield message("Radix Sort supports non-negative values; using numeric fallback for negatives."); yield* simpleSort(a, "Radix Sort"); return; } const max = Math.max(0, ...a); for (let place = 1; Math.floor(max / place) > 0; place *= 10) { yield { type: "digit", digit: place, place, text: `Sorting by digit position: ${place === 1 ? "ONES" : place}` }; const buckets = Array.from({ length: 10 }, () => [] as number[]); a.forEach((value) => buckets[Math.floor(value / place) % 10].push(value)); let k = 0; for (const bucket of buckets) for (const value of bucket) { a[k] = value; yield overwrite(k++, value, 3); } } yield markSorted(a.map((_, i) => i)); }
export function* bucketSort(input: number[]): Generator<SortEvent> { const a = [...input]; const buckets = Array.from({ length: Math.max(1, Math.ceil(Math.sqrt(a.length))) }, () => [] as number[]); if (a.length) { const min = Math.min(...a), max = Math.max(...a), span = max - min || 1; for (const value of a) { const bucketIndex = Math.min(buckets.length - 1, Math.floor(((value - min) / span) * buckets.length)); buckets[bucketIndex].push(value); yield { type: "bucket", bucketIndex, values: [...buckets[bucketIndex]], text: `Placing ${value} into bucket ${bucketIndex}` }; } } let k = 0; for (const bucket of buckets) { bucket.sort((x, y) => x - y); for (const value of bucket) { a[k] = value; yield overwrite(k++, value, 3); } } yield markSorted(a.map((_, i) => i)); }
export const shellSort = (input: number[]) => simpleSort(input, "Shell Sort");
export const cocktailSort = (input: number[]) => simpleSort(input, "Cocktail Shaker Sort");
export const combSort = (input: number[]) => simpleSort(input, "Comb Sort");
export const gnomeSort = (input: number[]) => simpleSort(input, "Gnome Sort");
export const cycleSort = (input: number[]) => simpleSort(input, "Cycle Sort");
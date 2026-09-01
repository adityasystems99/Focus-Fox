import { create } from "zustand";
import type { AlgorithmId, SortEvent } from "../types/sorting";
import { algorithmMap } from "../data/algorithms";
import { applyEvent } from "../algorithms/engine";

type State = {
  array: number[]; originalArray: number[]; selectedAlgorithm: AlgorithmId; events: SortEvent[]; eventIndex: number;
  isRunning: boolean; isPaused: boolean; speed: number; comparisons: number; swaps: number; writes: number; iterations: number;
  elapsedTime: number; steps: number; startedAt: number | null; currentOperation: string; activeIndices: number[];
  sortedIndices: number[]; pivotIndex: number | null; activeRange: [number, number] | null; currentDigit: number | null;
  buckets: number[][]; frequencies: Record<number, number>; quickPointers: { left: number; right: number; boundary: number } | null; currentPseudocodeLine: number;
  setArray: (array: number[]) => void; select: (id: AlgorithmId) => void; prepare: () => void; step: () => void;
  play: () => void; pause: () => void; reset: () => void; setSpeed: (speed: number) => void;
};
const initial = [29, 10, 14, 37, 14, 22, 8, 31];
const blank = { elapsedTime: 0, steps: 0, startedAt: null, currentOperation: "Ready to sort", activeIndices: [], sortedIndices: [], pivotIndex: null, activeRange: null, currentDigit: null, buckets: [], frequencies: {}, quickPointers: null, currentPseudocodeLine: 0 };
export const useSortingStore = create<State>((set, get) => ({
  array: initial, originalArray: initial, selectedAlgorithm: "bubble", events: [], eventIndex: 0, isRunning: false, isPaused: false, speed: 55, comparisons: 0, swaps: 0, writes: 0, iterations: 0, ...blank,
  setArray: (array) => set({ array: [...array], originalArray: [...array], events: [], eventIndex: 0, isRunning: false, isPaused: false, comparisons: 0, swaps: 0, writes: 0, iterations: 0, ...blank }),
  select: (selectedAlgorithm) => set({ selectedAlgorithm }),
  prepare: () => { const state = get(); set({ events: [...algorithmMap[state.selectedAlgorithm].generateSteps(state.originalArray)], eventIndex: 0, array: [...state.originalArray], comparisons: 0, swaps: 0, writes: 0, iterations: 0, startedAt: performance.now(), isRunning: true, isPaused: false, currentOperation: "Sorting prepared", activeIndices: [], sortedIndices: [], pivotIndex: null, activeRange: null, currentDigit: null, buckets: [], frequencies: {}, quickPointers: null, currentPseudocodeLine: 0 }); },
  step: () => {
    if (!get().events.length) get().prepare();
    const state = get(); const event = state.events[state.eventIndex];
    if (!event) { set({ isRunning: false, isPaused: false, elapsedTime: state.startedAt ? performance.now() - state.startedAt : state.elapsedTime, currentOperation: "Sorted successfully" }); return; }
    const array = [...state.array]; applyEvent(array, event);
    const frequencies = { ...state.frequencies };
    if (event.type === "message" && event.text.startsWith("Counting occurrences of value")) { const value = Number(event.text.match(/-?\d+/)?.[0]); if (Number.isFinite(value)) frequencies[value] = (frequencies[value] ?? 0) + 1; }
    const nextBuckets = event.type === "bucket" ? state.buckets.map((bucket) => [...bucket]) : state.buckets;
    if (event.type === "bucket") { while (nextBuckets.length <= event.bucketIndex) nextBuckets.push([]); nextBuckets[event.bucketIndex] = event.values; }
    set({ array, eventIndex: state.eventIndex + 1, steps: state.steps + 1, elapsedTime: state.startedAt ? performance.now() - state.startedAt : state.elapsedTime, comparisons: state.comparisons + (event.type === "compare" ? 1 : 0), swaps: state.swaps + (event.type === "swap" ? 1 : 0), writes: state.writes + (event.type === "swap" ? 2 : event.type === "overwrite" ? 1 : 0), iterations: state.iterations + (["compare", "swap", "overwrite"].includes(event.type) ? 1 : 0), currentOperation: event.text ?? (event.type === "message" ? event.text : `${event.type} operation`), activeIndices: event.type === "compare" || event.type === "swap" ? event.indices : event.type === "overwrite" ? [event.index] : [], sortedIndices: event.type === "markSorted" ? [...state.sortedIndices, ...event.indices] : state.sortedIndices, pivotIndex: event.type === "pivot" ? event.index : event.type === "swap" ? state.pivotIndex : null, activeRange: event.type === "range" ? [event.start, event.end] : state.activeRange, currentDigit: event.type === "digit" ? event.place : state.currentDigit, buckets: nextBuckets, frequencies, quickPointers: event.type === "pointers" ? { left: event.left, right: event.right, boundary: event.boundary } : state.quickPointers, currentPseudocodeLine: event.line ?? 0 });
  },
  play: () => set({ isRunning: true, isPaused: false }), pause: () => set({ isPaused: true }),
  reset: () => { const state = get(); set({ array: [...state.originalArray], events: [], eventIndex: 0, isRunning: false, isPaused: false, comparisons: 0, swaps: 0, writes: 0, iterations: 0, ...blank }); },
  setSpeed: (speed) => set({ speed }),
}));

import type { AlgorithmId, SortStats } from "../types/sorting";
import { algorithmMap } from "../data/algorithms";
import { consumeEvents } from "../algorithms/engine";

export interface RaceResult {
  algorithm: AlgorithmId;
  array: number[];
  stats: SortStats;
  eventCount: number;
  elapsedMs: number;
}

export function runRace(input: number[], first: AlgorithmId, second: AlgorithmId): [RaceResult, RaceResult] {
  return [first, second].map((algorithm) => {
    const started = performance.now();
    const result = consumeEvents(input, algorithmMap[algorithm].generateSteps(input));
    return { algorithm, array: result.array, stats: result.stats, eventCount: result.events.length, elapsedMs: performance.now() - started };
  }) as [RaceResult, RaceResult];
}

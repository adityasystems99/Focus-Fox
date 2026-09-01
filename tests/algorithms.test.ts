import { describe, expect, it } from "vitest";
import { algorithms } from "../src/data/algorithms";
import { consumeEvents } from "../src/algorithms/engine";

const cases = [[], [5], [1, 1, 1, 1], [5, 4, 3, 2, 1], [10, 5, 10, 2, 5], [-5, 3, -1, 8], [1, 2, 3, 4, 5]];
const randomCases = Array.from({ length: 12 }, () => Array.from({ length: 18 }, () => Math.floor(Math.random() * 201) - 100));
describe("sorting algorithms", () => {
  for (const algorithm of algorithms) it(`${algorithm.name} sorts and reports real events`, () => {
    for (const input of [...cases, ...randomCases]) { const result = consumeEvents(input, algorithm.generateSteps(input)); expect(result.array).toEqual([...input].sort((a, b) => a - b)); expect(result.events.length).toBeGreaterThanOrEqual(input.length ? 1 : 0); expect(result.stats.comparisons).toBe(result.events.filter((event) => event.type === "compare").length); expect(result.stats.swaps).toBe(result.events.filter((event) => event.type === "swap").length); expect(result.stats.writes).toBe(result.events.filter((event) => event.type === "overwrite").length + result.stats.swaps * 2); }
  });
});
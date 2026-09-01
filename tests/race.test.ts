import { describe, expect, it } from "vitest";
import { runRace } from "../src/utils/race";

describe("algorithm race", () => {
  it("replays both real generators against the same input", () => {
    const input = [9, -2, 4, 4, 1];
    const [first, second] = runRace(input, "bubble", "quick");
    expect(first.array).toEqual([-2, 1, 4, 4, 9]);
    expect(second.array).toEqual(first.array);
    expect(first.eventCount).toBeGreaterThan(0);
    expect(second.eventCount).toBeGreaterThan(0);
    expect(first.stats.comparisons).toBeGreaterThan(0);
    expect(second.stats.comparisons).toBeGreaterThan(0);
  });
});
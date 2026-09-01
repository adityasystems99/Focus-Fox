export type AlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap"
  | "counting"
  | "radix"
  | "bucket"
  | "shell"
  | "cocktail"
  | "comb"
  | "gnome"
  | "cycle";

export type SortEvent =
  | {
      type: "compare";
      indices: [number, number];
      line?: number;
      text?: string;
    }
  | {
      type: "swap";
      indices: [number, number];
      line?: number;
      text?: string;
    }
  | {
      type: "overwrite";
      index: number;
      value: number;
      line?: number;
      text?: string;
    }
  | {
      type: "markSorted";
      indices: number[];
      line?: number;
      text?: string;
    }
  | {
      type: "pivot";
      index: number;
      line?: number;
      text?: string;
    }
  | {
      type: "range";
      start: number;
      end: number;
      line?: number;
      text?: string;
    }
  | {
      type: "message";
      text: string;
      line?: number;
    }
  | {
      type: "bucket";
      bucketIndex: number;
      values: number[];
      line?: number;
      text?: string;
    }
  | {
      type: "digit";
      digit: number;
      place: number;
      line?: number;
      text?: string;
    }
  | {
      type: "pointers";
      left: number;
      right: number;
      boundary: number;
      line?: number;
      text?: string;
    };

export interface Complexity {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: string;
  inPlace: string;
}

export interface PseudocodeLine {
  line: number;
  text: string;
}

export interface SortingAlgorithm {
  id: AlgorithmId;
  name: string;
  category: string;
  description: string;
  complexity: Complexity;
  pseudocode: PseudocodeLine[];

  generateSteps(
    input: number[]
  ): Generator<SortEvent>;
}

export interface SortStats {
  comparisons: number;
  swaps: number;
  writes: number;
  iterations: number;
}
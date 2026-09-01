# FF Sort Lab

FF is a browser-based sorting algorithm visualizer built for studying the mechanics behind classic array algorithms. It turns each comparison, swap, overwrite, pivot, range, digit, and bucket operation into an event that drives the animation and real-time statistics.

## Features

- 14 real sorting algorithms with shared event-based execution
- Play, pause, resume, single-step, reset, speed, random, custom-array, and size controls
- Animated vertical bars with value, index, active, pivot, and sorted states
- Live merge ranges, Quick Sort pointers, heap levels, counting reconstruction, radix digit strips, and bucket distribution
- Algorithm race mode compares two real event streams on the same input
- Algorithm metadata, pseudocode highlighting, operation feed, and live counters
- Dark/light theme persisted with `localStorage`
- Responsive desktop and mobile layout

## Technology

React, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, Lucide React, and Vitest.

## Algorithms

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Bubble Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection Sort | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Counting Sort | O(n + k) | O(n + k) | O(n + k) | O(k) | Yes |
| Radix Sort | O(dn) | O(dn) | O(dn) | O(n) | Yes |
| Bucket Sort | O(n + k) | O(n + k) | O(n + k) | O(n + k) | Yes |
| Shell Sort | O(n log n) | O(n^2) | O(n^2) | O(1) | No |
| Cocktail Shaker Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Comb Sort | O(n) | O(n^2) | O(n^2) | O(1) | No |
| Gnome Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Cycle Sort | O(n^2) | O(n^2) | O(n^2) | O(1) | No |

## Architecture

Algorithms generate `SortEvent` values without knowing about React. Zustand owns the array and playback state, applies one event at a time, and exposes selectors to the visualizer. Framer Motion animates changes to the resulting state.

## Run locally

```bash
npm install
npm run dev
npm run build
npm run test
```

## Project structure

`src/algorithms` contains generators and event utilities, `src/data` contains metadata, `src/store` contains playback state, and `src/components` contains the visual surface. Tests live in `tests/`.

## Testing

Vitest replays every emitted event for all 14 algorithms and checks sorted output, event-derived statistics, edge cases, duplicates, negative values, sorted/reverse arrays, and randomized arrays.

## Screenshots

The app is designed to be viewed directly through the Vite development server; screenshots can be added here when publishing a deployment.

## Future improvements

Deployment screenshots and optional cloud hosting can build on the existing browser-only project without changing algorithm correctness.
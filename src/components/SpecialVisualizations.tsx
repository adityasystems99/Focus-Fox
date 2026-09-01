import { motion } from "framer-motion";
import { useSortingStore } from "../store/sortingStore";
import "./special.css";
import "./special-details.css";

export function HeapVisualizer() {
  const array = useSortingStore((state) => state.array);
  const rows = [0, 1, 3, 7].map((start, level) => array.slice(start, Math.min(start + 2 ** level, 15)));
  return <div className="special panel"><div className="eyebrow">HEAP VIEW · LIVE ARRAY</div><div className="heap-tree">{rows.map((row, level) => <div className="heap-level" key={level}>{row.map((value, offset) => { const index = [0, 1, 3, 7][level] + offset; return <motion.span layout className="heap-node" key={`${index}-${value}`}><b>{value}</b><small>index {index}</small></motion.span>; })}</div>)}</div></div>;
}

export function CountingVisualizer() {
  const original = useSortingStore((state) => state.originalArray);
  const array = useSortingStore((state) => state.array);
  const frequencies = useSortingStore((state) => state.frequencies);
  const entries = Object.entries(frequencies).sort((a, b) => Number(a[0]) - Number(b[0]));
  return <div className="special panel"><div className="eyebrow">COUNTING TABLE · RECONSTRUCTION</div><div className="mini-array"><b>Original</b><span>{original.join("  ") || "empty"}</span></div><div className="frequency-table">{entries.length ? entries.map(([value, count]) => <motion.span layout key={value}><b>{value}</b><i style={{ height: `${Math.max(8, count * 18)}px` }} />{count}</motion.span>) : <small>Frequency events appear during the counting pass.</small>}</div><div className="mini-array"><b>Current</b><span>{array.join("  ") || "empty"}</span></div></div>;
}

export function BucketVisualizer() {
  const buckets = useSortingStore((state) => state.buckets);
  return <div className="special panel"><div className="eyebrow">BUCKETS · DISTRIBUTION</div><div className="bucket-row">{buckets.length ? buckets.map((bucket, index) => <motion.div layout key={index}><b>Bucket {index}</b><span>{bucket.join("  ") || "-"}</span></motion.div>) : <small>Bucket insertion events appear during distribution.</small>}</div></div>;
}

export function RadixVisualizer() {
  const digit = useSortingStore((state) => state.currentDigit);
  const array = useSortingStore((state) => state.array);
  return <div className="special panel"><div className="eyebrow">RADIX PASS · DIGIT BUCKETING</div><strong>{digit === null ? "Waiting for a digit pass" : `Current place: ${digit === 1 ? "ONES" : digit}`}</strong><div className="digit-strip">{array.map((value, index) => <motion.span layout key={`${index}-${value}`}>{digit ? Math.floor(Math.abs(value) / digit) % 10 : "-"}</motion.span>)}</div></div>;
}

import { useState } from "react";
import { Flag, Play } from "lucide-react";
import { algorithms } from "../data/algorithms";
import { useSortingStore } from "../store/sortingStore";
import { runRace, type RaceResult } from "../utils/race";
import "./race.css";

function RaceCard({ result }: { result: RaceResult }) {
  const name = algorithms.find((algorithm) => algorithm.id === result.algorithm)?.name;
  return <article className="race-card"><div className="race-name"><Flag size={15} />{name}</div><div className="race-stats"><span><b>{result.stats.comparisons}</b> comparisons</span><span><b>{result.stats.swaps}</b> swaps</span><span><b>{result.stats.writes}</b> writes</span><span><b>{result.eventCount}</b> events</span><span><b>{result.elapsedMs.toFixed(2)} ms</b> generation</span></div><code>{result.array.join(", ")}</code></article>;
}

export function RacePanel() {
  const input = useSortingStore((state) => state.originalArray);
  const [first, setFirst] = useState("bubble");
  const [second, setSecond] = useState("quick");
  const [results, setResults] = useState<[RaceResult, RaceResult] | null>(null);
  const run = () => setResults(runRace(input, first as typeof algorithms[number]["id"], second as typeof algorithms[number]["id"]));
  return <section className="race panel"><div className="race-head"><div><div className="eyebrow">ALGORITHM RACE</div><h2>Same array. Different strategies.</h2></div><button onClick={run}><Play size={15} />Run race</button></div><div className="race-selects"><label>Runner A<select value={first} onChange={(event) => setFirst(event.target.value)}>{algorithms.map((algorithm) => <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>)}</select></label><label>Runner B<select value={second} onChange={(event) => setSecond(event.target.value)}>{algorithms.map((algorithm) => <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>)}</select></label></div>{results ? <div className="race-results">{results.map((result) => <RaceCard key={result.algorithm} result={result} />)}</div> : <p className="race-empty">Run both real event streams against the current original array to compare their work.</p>}</section>;
}

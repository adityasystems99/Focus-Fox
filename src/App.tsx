import { useEffect, useState } from "react";
import { Menu, Moon, Pause, Play, RotateCcw, Shuffle, StepForward, Sun } from "lucide-react";
import { algorithms } from "./data/algorithms";
import { useSortingStore } from "./store/sortingStore";
import { useSorting } from "./hooks/useSorting";
import { ArrayVisualizer } from "./components/ArrayVisualizer";
import { InfoPanel, Sidebar, Stats } from "./components/AppPanels";
import { BucketVisualizer, CountingVisualizer, HeapVisualizer, RadixVisualizer } from "./components/SpecialVisualizations";
import { ComplexityTable } from "./components/ComplexityTable";
import { RacePanel } from "./components/RacePanel";
import "./index.css";
import "./components/drawer.css";

function shuffle(values: number[]) { const result = [...values]; for (let index = result.length - 1; index > 0; index--) { const target = Math.floor(Math.random() * (index + 1)); [result[index], result[target]] = [result[target], result[index]]; } return result; }
function parseArray(value: string) { if (!value.trim()) return []; const values = value.split(",").map((item) => Number(item.trim())); return values.every(Number.isFinite) && values.length <= 100 ? values : null; }

export default function App() {
  const state = useSorting();
  const [input, setInput] = useState(state.originalArray.join(", "));
  const [inputError, setInputError] = useState("");
  const [dark, setDark] = useState(() => localStorage.getItem("ff-theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const locked = state.isRunning;
  useEffect(() => setInput(state.originalArray.join(", ")), [state.originalArray]);
  const applyCustom = () => { const values = parseArray(input); if (values === null) { setInputError("Use up to 100 comma-separated numbers."); return; } setInputError(""); state.setArray(values); };
  const randomize = () => state.setArray(Array.from({ length: state.array.length || 8 }, () => Math.floor(Math.random() * 90) + 8));
  const toggleTheme = () => { const next = !dark; setDark(next); localStorage.setItem("ff-theme", next ? "dark" : "light"); };
  const selected = algorithms.find((algorithm) => algorithm.id === state.selectedAlgorithm)!;
  return <div className={dark ? "app dark" : "app"}>
    <header><div className="brand"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open algorithm menu"><Menu size={20} /></button><span>FF</span><div><b>Sort Lab</b><small>ALGORITHM VISUALIZER</small></div></div><div className="header-actions"><span className="status"><i /> EVENT ENGINE ONLINE</span><button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark and light mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button></div></header>
    <div className={menuOpen ? "layout drawer-active" : "layout"}><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><main><div className="topline"><div><div className="eyebrow">INTERACTIVE STUDY DECK</div><h1>Sorting, made visible.</h1></div><select aria-label="Select sorting algorithm" value={state.selectedAlgorithm} disabled={locked} onChange={(event) => state.select(event.target.value as typeof state.selectedAlgorithm)}>{algorithms.map((algorithm) => <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>)}</select></div>
      <div className="toolbar panel"><button onClick={state.play} disabled={!state.events.length || !state.isPaused}><Play size={16} />Resume</button><button onClick={() => { if (!state.events.length) state.prepare(); state.play(); }} disabled={locked && !state.isPaused}><Play size={16} />Play</button><button onClick={state.pause} disabled={!locked || state.isPaused}><Pause size={16} />Pause</button><button onClick={state.step} disabled={locked && !state.isPaused}><StepForward size={16} />Step</button><button onClick={state.reset}><RotateCcw size={16} />Reset</button><label>Speed <input aria-label="Animation speed" type="range" min="5" max="95" value={state.speed} onChange={(event) => state.setSpeed(Number(event.target.value))} /></label></div>
      <div className="panel stage"><div className="stage-head"><span>ARRAY STATE <b>{state.array.length} ITEMS</b></span><span className="operation">{state.currentOperation}</span></div><ArrayVisualizer /></div>
      <div className="controls panel"><button disabled={locked} onClick={randomize}><Shuffle size={16} />Generate random</button><button disabled={locked} onClick={() => state.setArray(shuffle(state.originalArray))}><Shuffle size={16} />Shuffle</button><div className="input-group"><label htmlFor="custom">Custom array</label><input id="custom" value={input} disabled={locked} onChange={(event) => setInput(event.target.value)} onBlur={applyCustom} onKeyDown={(event) => { if (event.key === "Enter") applyCustom(); }} />{inputError && <small className="input-error">{inputError}</small>}</div><label className="size">Size <input aria-label="Array size" disabled={locked} type="range" min="0" max="40" value={state.array.length} onChange={(event) => state.setArray(Array.from({ length: Number(event.target.value) }, () => Math.floor(Math.random() * 90) + 8))} /></label></div>
      <div className="special-grid">{state.selectedAlgorithm === "heap" && <HeapVisualizer />}{state.selectedAlgorithm === "counting" && <CountingVisualizer />}{state.selectedAlgorithm === "radix" && <RadixVisualizer />}{state.selectedAlgorithm === "bucket" && <BucketVisualizer />}{["merge", "quick"].includes(state.selectedAlgorithm) && <div className="special panel"><div className="eyebrow">ACTIVE RANGE</div><strong>{state.activeRange ? `[${state.activeRange[0]}, ${state.activeRange[1]}]` : "Waiting for a range event"}</strong></div>}{state.selectedAlgorithm === "quick" && <div className="special panel"><div className="eyebrow">PARTITION POINTERS</div><strong>{state.quickPointers ? `Left ${state.quickPointers.left} · Right ${state.quickPointers.right} · Boundary ${state.quickPointers.boundary}` : "Waiting for pointer events"}</strong></div>}</div>
      <div className="grid-panels"><InfoPanel /><Stats /><div className="panel pseudocode"><div className="eyebrow">PSEUDOCODE · {selected.name}</div>{selected.pseudocode.map((line) => <div className={line.line === state.currentPseudocodeLine ? "code-line current" : "code-line"} key={line.line}><i>{line.line}</i>{line.text}</div>)}</div><ComplexityTable /><RacePanel /></div>
    </main></div>
  </div>;
}

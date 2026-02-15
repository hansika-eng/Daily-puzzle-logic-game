import { useEffect, useState } from "react";
import { saveActivity, markSolved } from "./storage";

export default function NumberGrid({ goBack }: { goBack: () => void }) {
  const [time, setTime] = useState(0);
  const [hints, setHints] = useState(3);
  const [grid, setGrid] = useState([
    ["", "", "6", ""],
    ["6", "9", "2", "5"],
    ["2", "", "", "9"],
    ["9", "", "7", "5"],
  ]);

  useEffect(() => {
    // start timer
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    // record activity for today when user opens puzzle
    const today = new Date().toISOString().slice(0, 10);
    saveActivity(today);
    return () => clearInterval(timer);
  }, []);

  const updateCell = (r: number, c: number, value: string) => {
    const copy = [...grid];
    copy[r][c] = value;
    setGrid(copy);
  };

  const check = () => {
    const today = new Date().toISOString().slice(0, 10);
    const ok = markSolved(today, 10);
    if (ok) alert("Solution submitted — marked as solved! (+10 pts)");
    else alert("Already marked solved for today.");
  };

  const useHint = () => {
    if (hints <= 0) return;
    // fill first empty cell with a placeholder hint (demo)
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (!grid[r][c]) {
          updateCell(r, c, "1");
          setHints((h) => h - 1);
          return;
        }
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <button onClick={goBack} className="mb-4 text-sm text-gray-400">
        ← Back to Dashboard
      </button>

      <div className="bg-slate-800 p-6 rounded-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>⏱ {time}s</div>
          <div className="text-sm text-gray-300">💡 {hints} hints left</div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <input
                key={`${r}-${c}`}
                value={cell}
                onChange={(e) => updateCell(r, c, e.target.value)}
                className="w-12 h-12 text-center bg-slate-700 rounded"
              />
            ))
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={useHint} className="flex-1 bg-yellow-500 py-2 rounded-lg">Use Hint</button>
          <button onClick={check} className="flex-2 w-2/3 bg-orange-500 py-2 rounded-lg">Check Solution</button>
        </div>
      </div>
    </div>
  );
}

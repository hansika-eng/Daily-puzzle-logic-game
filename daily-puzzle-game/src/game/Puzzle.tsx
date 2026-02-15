import { useEffect, useState } from "react";
import { updateStreak } from "./streak";
import { unlockBadge } from "./badges";
import { getTodayPuzzle } from "./puzzles";

export default function Puzzle() {
  const today = new Date().toISOString().slice(0, 10);

  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  // ⏱ Timer
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  // 🎁 Hint system
  const [hintsLeft, setHintsLeft] = useState(2);

  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");

  // 🔥 Deterministic puzzle
 const puzzle = getTodayPuzzle();

  // 🔄 Load local progress
  useEffect(() => {
    const activity = JSON.parse(localStorage.getItem("activity") || "{}");

    if (activity[today]) setCompleted(true);

    const savedStreak = Number(localStorage.getItem("streak") || 0);
    setStreak(savedStreak);

    const savedHints = Number(localStorage.getItem("hints_" + today) || 2);
    setHintsLeft(savedHints);
  }, []);

  // ⏱ Timer logic
  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const startPuzzle = () => {
    if (!running) setRunning(true);
  };

  // 🎁 Hint usage
  const useHint = () => {
    if (hintsLeft <= 0) return;

    const newHints = hintsLeft - 1;
    setHintsLeft(newHints);
    localStorage.setItem("hints_" + today, String(newHints));
  };

  // ✅ Validate solution
  const solvePuzzle = () => {
    if (completed) return;

    if (userAnswer.toLowerCase() !== puzzle.answer) {
      setError("Wrong answer. Try again!");
      return;
    }

    setRunning(false);

    // 🎯 Score formula
    const base = 1000;
    const timePenalty = time * 2;
    const hintPenalty = (2 - hintsLeft) * 50;
    const score = Math.max(base - timePenalty - hintPenalty, 100);

    console.log("Score:", score);

    // 🔥 Save activity (heatmap)
    const activity = JSON.parse(localStorage.getItem("activity") || "{}");
    activity[today] = 4;
    localStorage.setItem("activity", JSON.stringify(activity));

    setCompleted(true);

    // 🔥 Streak update
    const newStreak = updateStreak();
    setStreak(newStreak);

    // 🎁 Badge
    unlockBadge(newStreak);

    setShowCongrats(true);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg max-w-xl w-full">
      <h2 className="text-xl font-bold mb-4">🧩 Daily Puzzle</h2>

      {!completed ? (
        <>
          <p className="text-gray-300 mb-4">{puzzle.question}</p>

          <div className="flex gap-3 mb-4">
            <button
              onClick={startPuzzle}
              className="px-4 py-2 bg-blue-500 rounded-lg"
            >
              Start
            </button>

            <button
              onClick={useHint}
              disabled={hintsLeft === 0}
              className="px-4 py-2 bg-yellow-500 rounded-lg"
            >
              Hint ({hintsLeft})
            </button>
          </div>

          <p className="mb-2">⏱ Time: {time}s</p>

          <input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter answer"
            className="p-2 rounded bg-slate-700 mb-3 w-full"
          />

          {error && <p className="text-red-400">{error}</p>}

          <button
            onClick={solvePuzzle}
            className="px-4 py-2 bg-green-500 text-black rounded-lg"
          >
            Submit
          </button>
        </>
      ) : (
        <div>
          <p className="text-green-400 font-semibold">Completed ✅</p>
          <p className="mt-2">🔥 Streak: {streak}</p>
        </div>
      )}

      {/* 🎉 Popup */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-slate-900 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-green-400">
              🎉 Congratulations!
            </h2>
            <p>You solved today’s Daily Puzzle.</p>

            <button
              onClick={() => setShowCongrats(false)}
              className="mt-4 px-5 py-2 bg-green-500 text-black rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

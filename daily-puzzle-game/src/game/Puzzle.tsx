import { useEffect, useState } from "react";
import { updateStreak } from "./streak";
import { unlockBadge } from "./badges";

export default function Puzzle() {
  const [completed, setCompleted] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [streak, setStreak] = useState(0);

  const today = new Date().toISOString().slice(0, 10);

  // 🔥 Load completion state (offline first)
  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem("activity") || "{}");

    if (progress[today]) {
      setCompleted(true);
    }

    const savedStreak = Number(localStorage.getItem("streak") || 0);
    setStreak(savedStreak);
  }, []);

  // 🎯 Demo puzzle solver (temporary)
  const solvePuzzle = () => {
    if (completed) return;

    // Mark completed locally
    const activity = JSON.parse(localStorage.getItem("activity") || "{}");
    activity[today] = 4; // intensity level
    localStorage.setItem("activity", JSON.stringify(activity));

    setCompleted(true);

    // 🔥 Update streak
    const newStreak = updateStreak();
    setStreak(newStreak);

    // 🎁 Unlock badge
    unlockBadge(newStreak);

    // 🎉 Show popup
    setShowCongrats(true);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg max-w-xl w-full">
      <h2 className="text-xl font-bold mb-4">🧩 Daily Puzzle</h2>

      {!completed ? (
        <>
          <p className="text-gray-300 mb-4">
            Demo puzzle: Click solve to complete today’s challenge.
          </p>

          <button
            onClick={solvePuzzle}
            className="px-4 py-2 bg-green-500 text-black rounded-lg"
          >
            Solve Puzzle
          </button>
        </>
      ) : (
        <div>
          <p className="text-green-400 font-semibold">Completed ✅</p>
          <p className="mt-2">🔥 Streak: {streak}</p>
        </div>
      )}

      {/* 🎉 Congratulations popup */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-xl text-center shadow-xl">
            <h2 className="text-2xl font-bold text-green-400 mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-gray-300">
              You solved today’s Daily Puzzle.
            </p>

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

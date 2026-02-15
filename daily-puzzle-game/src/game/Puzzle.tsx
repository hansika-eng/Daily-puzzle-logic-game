import { useEffect, useState } from "react";
import { getTodayPuzzle } from "./puzzles";
import { updateStreak, getStreak } from "./streak";
import type { User } from "firebase/auth";

type Props = {
  user: User;
};

export default function Puzzle({ user }: Props) {
  const [answer, setAnswer] = useState("");
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [saving, setSaving] = useState(false);

  const puzzle = getTodayPuzzle();

  // 🔁 Restore progress (offline)
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const progress = localStorage.getItem("progress-" + today);

    if (progress) {
      setCompleted(true);
    }

    setStreak(getStreak());
  }, []);

  // ⏱ Timer
  useEffect(() => {
    if (!started || completed) return;

    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, completed]);

  // 🎯 Validate puzzle
  const handleSubmit = async () => {
    if (answer.trim() !== puzzle.answer) {
      alert("Wrong answer ❌");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    // Save progress
    localStorage.setItem("progress-" + today, "done");

    // 🔥 Update heatmap
    const activity = JSON.parse(localStorage.getItem("activity") || "{}");
    activity[today] = true;
    localStorage.setItem("activity", JSON.stringify(activity));

    // 🔥 Update streak
    const newStreak = updateStreak();
    setStreak(newStreak);

    setCompleted(true);

    // 🌐 Backend sync
    try {
      setSaving(true);

      await fetch("/api/save-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          score: 100 - timer,
        }),
      });

    } catch (err) {
      console.log("Offline sync later");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 p-5 rounded-xl mt-6 text-left">

      <h2 className="text-xl font-bold mb-2">🧩 Daily Puzzle</h2>

      {completed ? (
        <div className="space-y-2">
          <p className="text-green-400">Completed ✅</p>
          <p>🔥 Streak: {streak}</p>
        </div>
      ) : (
        <>
          <p className="mb-2">{puzzle.question}</p>

          <input
            className="w-full p-2 rounded text-black"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (!started) setStarted(true);
            }}
          />

          <p className="text-sm mt-2">⏱ Time: {timer}s</p>

          <button
            onClick={handleSubmit}
            className="mt-3 px-4 py-2 bg-green-500 text-black rounded"
          >
            Submit
          </button>

          {saving && (
            <p className="text-xs text-gray-400 mt-1">
              Syncing...
            </p>
          )}
        </>
      )}
    </div>
  );
}

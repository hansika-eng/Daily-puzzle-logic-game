import { useEffect, useState } from "react";
import { saveActivity, markSolved } from "./storage";

const words = [
  { scrambled: "ENTOK", answer: "TOKEN", hint: "Authentication piece" },
  { scrambled: "ATSDAEBA", answer: "DATABASE", hint: "Organized data" },
  { scrambled: "UEQEU", answer: "QUEUE", hint: "FIFO structure" },
];

export default function WordScramble({ goBack }: { goBack: () => void }) {
  const [answers, setAnswers] = useState(["", "", ""]);
  const [hints, setHints] = useState(3);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    saveActivity(today);
  }, []);

  const update = (i: number, val: string) => {
    const copy = [...answers];
    copy[i] = val.toUpperCase();
    setAnswers(copy);
  };

  const useHint = () => {
    if (hints > 0) setHints(hints - 1);
  };

  const checkAll = () => {
    const allCorrect = words.every((w, i) => answers[i] === w.answer);
    if (allCorrect) {
      const today = new Date().toISOString().slice(0, 10);
      const ok = markSolved(today, 10);
      if (ok) alert("All correct — marked as solved! (+10 pts)");
      else alert("Already solved for today.");
    } else {
      alert("Some answers are incorrect. Keep trying!");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <button onClick={goBack} className="mb-4 text-sm text-gray-400">
        ← Back to Dashboard
      </button>

      <div className="bg-slate-800 p-6 rounded-xl">
        <div className="mb-4">💡 {hints} hints left</div>

        {words.map((w, i) => {
          const correct = answers[i] === w.answer;

          return (
            <div key={i} className="mb-4">
              <div className="flex gap-2 mb-1">
                {w.scrambled.split("").map((l, idx) => (
                  <span key={idx} className="bg-slate-700 px-2 rounded">
                    {l}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-400">{w.hint}</p>

              <input
                value={answers[i]}
                onChange={(e) => update(i, e.target.value)}
                className={`w-full mt-2 p-2 rounded ${
                  correct ? "border-green-500" : "border-slate-600"
                } border bg-slate-900`}
              />
            </div>
          );
        })}

        <div className="flex gap-3 mt-4">
          <button onClick={useHint} className="bg-yellow-500 px-4 py-1 rounded">Use Hint</button>
          <button onClick={checkAll} className="bg-orange-500 px-4 py-1 rounded">Check Solution</button>
        </div>
      </div>
    </div>
  );
}

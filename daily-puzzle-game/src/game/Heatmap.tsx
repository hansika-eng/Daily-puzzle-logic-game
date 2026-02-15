import { useEffect, useState } from "react";

export default function Heatmap() {
  const [activity, setActivity] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("activity") || "{}");
    setActivity(stored);
  }, []);

  const days = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);

    days.push({
      date: key,
      active: activity[key],
    });
  }

  return (
    <div className="mt-8">
      <h3 className="mb-2">🔥 Daily Activity</h3>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <div
            key={d.date}
            title={d.date}
            className={`w-4 h-4 rounded ${
              d.active ? "bg-green-500" : "bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}


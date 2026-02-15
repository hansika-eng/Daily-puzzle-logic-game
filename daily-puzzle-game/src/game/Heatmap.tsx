import { useEffect, useState } from "react";

export default function Heatmap() {
  const [activity, setActivity] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("activity") || "{}");
    setActivity(stored);
  }, []);

  const today = new Date();

  // 🔥 Generate last 365 days (today first)
  const days: Date[] = [];
  for (let i = 0; i <= 364; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // 👉 Align first column to week start
  const firstDay = days[0].getDay();
  const paddedDays = [...Array(firstDay).fill(null), ...days];

  // Group into weeks
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  const getColor = (date: string) => {
    const level = activity[date] || 0;

    const colors = [
      "bg-gray-700",
      "bg-green-400",
      "bg-green-500",
      "bg-green-600",
      "bg-green-700",
    ];

    return colors[level];
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <h3 className="text-sm text-gray-400 mb-4">🔥 Daily Activity</h3>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((day, j) => {
              if (!day)
                return (
                  <div
                    key={j}
                    className="w-3 h-3 rounded-sm bg-transparent"
                  />
                );

              const date = day.toISOString().slice(0, 10);

              return (
                <div
                  key={date}
                  title={date}
                  className={`w-3 h-3 rounded-sm ${getColor(date)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

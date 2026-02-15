import { useMemo, useState } from "react";
import NumberGrid from "./NumberGrid";
import WordScramble from "./WordScramble";
import { getActivity, getStats } from "./storage";

type ActiveView = "home" | "grid" | "word";

// Status dot removed (global top nav shows online status)

function ArrowRight(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 text-orange-400" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.5} />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.5} />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.5} />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

function IconText() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 text-orange-400" fill="none">
      <path d="M4 7h16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M4 12h10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M4 17h16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-orange-400" fill="none">
      <path d="M12 3s4 3 4 7a4 4 0 0 1-8 0c0-4 4-7 4-7z" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14s1 3 4 3 4-3 4-3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex-1 bg-slate-900/40 backdrop-blur rounded-xl p-4 shadow-md hover:scale-[1.01] transition-transform">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}


export default function Dashboard() {
  const [active, setActive] = useState<ActiveView>("home");
  const activity = getActivity();
  const stats = getStats();
  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  // Build weeks for heatmap layout (columns = weeks)
  const weeks: { days: { date: Date; count: number }[] }[] = [];
  // Start from oldest date (365 days ago)
  const start = new Date();
  start.setDate(start.getDate() - 364);
  // move to previous Sunday to align weeks
  const dayOffset = start.getDay();
  start.setDate(start.getDate() - dayOffset);

  const totalWeeks = 53; // show ~53 weeks
  let cursor = new Date(start);
  for (let w = 0; w < totalWeeks; w++) {
    const weekDays: { date: Date; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const key = cursor.toISOString().slice(0, 10);
      const count = activity[key] || 0;
      weekDays.push({ date: new Date(cursor), count });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push({ days: weekDays });
  }

  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];
    weeks.forEach((w, i) => {
      const first = w.days[0].date;
      if (first.getDate() <= 7) {
        const m = first.toLocaleString(undefined, { month: "short" });
        labels.push({ index: i, label: m });
      }
    });
    return labels;
  }, [weeks]);

  if (active === "grid") return <NumberGrid goBack={() => setActive("home")} />;
  if (active === "word") return <WordScramble goBack={() => setActive("home")} />;

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-black via-slate-900 to-slate-800 text-slate-200">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-bold">Today’s <span className="text-orange-400">Challenge</span></h2>
          <div className="text-sm text-slate-400 mt-1">{dateLabel} — Difficulty: <span className="font-medium">Easy</span></div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setActive("grid")}
                className="group flex items-center gap-4 p-4 bg-slate-900/40 backdrop-blur rounded-xl shadow hover:scale-[1.01] transition transform"
              >
                <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-center">
                  <IconGrid />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">Number Grid</div>
                      <div className="h-1 mt-2 w-24 bg-slate-700 rounded overflow-hidden">
                        <div className="h-1 bg-orange-400 w-1/3 transition-all duration-500" />
                      </div>
                    </div>
                    <div className="text-slate-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-3">Fill the grid so rows &amp; columns hit the targets</p>
                </div>
              </button>

              <button
                onClick={() => setActive("word")}
                className="group flex items-center gap-4 p-4 bg-slate-900/40 backdrop-blur rounded-xl shadow hover:scale-[1.01] transition transform"
              >
                <div className="p-3 bg-slate-800 rounded-lg flex items-center justify-center">
                  <IconText />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">Word Scramble</div>
                      <div className="h-1 mt-2 w-24 bg-slate-700 rounded overflow-hidden">
                        <div className="h-1 bg-orange-400 w-1/4 transition-all duration-500" />
                      </div>
                    </div>
                    <div className="text-slate-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-3">Unscramble the tech words</p>
                </div>
              </button>
            </div>

            <div className="bg-slate-900/30 backdrop-blur rounded-xl p-4 shadow-md">
              <div className="text-sm text-slate-400 font-semibold mb-3">Activity — Last 365 Days</div>
              <div className="relative">
                <div className="flex gap-2 items-center mb-2 px-2">
                  {monthLabels.map(m => (
                    <div key={m.index} className="text-xs text-slate-400 w-12 text-center" style={{ marginLeft: m.index === 0 ? 0 : 4 }}>
                      {m.label}
                    </div>
                  ))}
                </div>

                <div className="overflow-x-auto -mx-2 p-2">
                  <div className="inline-block bg-transparent p-2 rounded" style={{ minWidth: 800 }}>
                    <div className="grid grid-flow-col auto-cols-max gap-1">
                      {weeks.map((w, wi) => (
                        <div key={wi} className="grid grid-rows-7 gap-1">
                          {w.days.map((d, di) => {
                            const intensity = d.count;
                            const color = intensity === 0 ? "bg-slate-800" : intensity === 1 ? "bg-yellow-500/60" : intensity === 2 ? "bg-yellow-600/80" : "bg-orange-500";
                            return (
                              <div
                                key={di}
                                title={`${d.date.toDateString()} — ${d.count} solved`}
                                className={`w-4 h-4 rounded-sm ${color} transition-transform transform hover:scale-110`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-400">
                  <span className="px-2">Less</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-slate-800 rounded-sm" />
                    <div className="w-4 h-4 bg-yellow-500/60 rounded-sm" />
                    <div className="w-4 h-4 bg-yellow-600/80 rounded-sm" />
                    <div className="w-4 h-4 bg-orange-500 rounded-sm" />
                  </div>
                  <span className="px-2">More</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Puzzles Solved" value={stats.puzzlesSolved} />
              <StatCard label="Total Score" value={stats.totalScore} />
              <StatCard label="Longest Streak" value={stats.longestStreak} />
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-slate-900/40 backdrop-blur rounded-xl p-6 shadow-md flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-slate-800 mb-3">
                <FlameIcon />
              </div>
              <div className="text-4xl font-bold">{stats.currentStreak}</div>
              <div className="text-slate-400 mt-2">Start your streak!</div>
              <div className="mt-4 w-full flex justify-between text-sm text-slate-400">
                <div>
                  <div className="text-xs">Best</div>
                  <div className="font-semibold text-white">{stats.longestStreak}</div>
                </div>
                <div>
                  <div className="text-xs">Today</div>
                  <div className="font-semibold text-white">{weeks.some(w => w.days.some(d => d.date.toISOString().slice(0,10) === new Date().toISOString().slice(0,10) && d.count>0)) ? '✓' : '—'}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 backdrop-blur rounded-xl p-4 shadow-md">
              <div className="text-sm text-slate-400 mb-2">Overview</div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Puzzles solved</span>
                  <span className="font-semibold">{stats.puzzlesSolved}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Total score</span>
                  <span className="font-semibold">{stats.totalScore}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Longest streak</span>
                  <span className="font-semibold">{stats.longestStreak}</span>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

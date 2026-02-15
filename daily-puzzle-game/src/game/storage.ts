export function saveActivity(date: string) {
  let data: any;
  try {
    data = JSON.parse(localStorage.getItem("activity") || "{}");
  } catch {
    data = {};
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) data = {};
  data[date] = (data[date] || 0) + 1;
  localStorage.setItem("activity", JSON.stringify(data));
}

export function getActivity() {
  try {
    const data = JSON.parse(localStorage.getItem("activity") || "{}");
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return data;
  } catch {
    return {};
  }
}

export function saveProgress(date: string) {
  localStorage.setItem("progress-" + date, "done");
}

export function isCompleted(date: string) {
  return localStorage.getItem("progress-" + date) === "done";
}

export type Stats = {
  puzzlesSolved: number;
  totalScore: number;
  longestStreak: number;
  currentStreak: number;
};

const defaultStats: Stats = { puzzlesSolved: 0, totalScore: 0, longestStreak: 0, currentStreak: 0 };

export function getStats(): Stats {
  try {
    const raw = localStorage.getItem("stats");
    if (!raw) return { ...defaultStats };
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return { ...defaultStats };
    return {
      puzzlesSolved: Number(data.puzzlesSolved || 0),
      totalScore: Number(data.totalScore || 0),
      longestStreak: Number(data.longestStreak || 0),
      currentStreak: Number(data.currentStreak || 0),
    };
  } catch {
    return { ...defaultStats };
  }
}

export function incrementSolved(amount = 1) {
  const s = getStats();
  s.puzzlesSolved = s.puzzlesSolved + amount;
  localStorage.setItem("stats", JSON.stringify(s));
}

export function addScore(points = 0) {
  const s = getStats();
  s.totalScore = s.totalScore + points;
  localStorage.setItem("stats", JSON.stringify(s));
}

function getCompletedDates(): string[] {
  const dates: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) as string;
    if (key && key.startsWith("progress-")) {
      dates.push(key.replace("progress-", ""));
    }
  }
  return dates;
}

function computeCurrentStreak(todayStr?: string) {
  const set = new Set(getCompletedDates());
  const today = todayStr || new Date().toISOString().slice(0, 10);
  let count = 0;
  let cursor = new Date(today);
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (set.has(key)) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

function computeLongestStreak() {
  const dates = getCompletedDates().sort();
  if (dates.length === 0) return 0;
  const toNum = (d: string) => new Date(d).getTime();
  let longest = 0;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = toNum(dates[i - 1]);
    const cur = toNum(dates[i]);
    // if cur is next day after prev
    if (cur - prev === 24 * 60 * 60 * 1000) {
      current++;
    } else {
      if (current > longest) longest = current;
      current = 1;
    }
  }
  if (current > longest) longest = current;
  return longest;
}

export function markSolved(date: string, points = 0) {
  if (isCompleted(date)) return false;
  saveProgress(date);
  incrementSolved(1);
  if (points) addScore(points);
  // recompute streaks after marking progress
  const current = computeCurrentStreak();
  const longest = computeLongestStreak();
  const s = getStats();
  s.currentStreak = current;
  s.longestStreak = Math.max(s.longestStreak, longest);
  localStorage.setItem("stats", JSON.stringify(s));
  return true;
}

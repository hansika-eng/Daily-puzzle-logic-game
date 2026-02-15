// 🔥 Deterministic puzzle generator (demo ready)

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

// 🎯 Daily seed
export function getTodaySeed() {
  const today = new Date().toISOString().slice(0, 10);
  return hashCode(today + "secret_key");
}

// 🔥 Decide puzzle type (Requirement: 2 puzzle types)
export function getPuzzleType() {
  const seed = getTodaySeed();
  return seed % 2 === 0 ? "math" : "memory";
}

// 🧩 Puzzle type 1 → Math / Logic
export function getMathPuzzle() {
  const seed = getTodaySeed();

  const puzzles = [
    { question: "What is 7 + 5?", answer: "12" },
    { question: "What is 9 × 3?", answer: "27" },
    { question: "What is 15 - 4?", answer: "11" },
    { question: "5 + 7 ?", answer: "12" },
    { question: "10 - 3 ?", answer: "7" },
    { question: "6 * 4 ?", answer: "24" },
    { question: "20 / 5 ?", answer: "4" },
  ];

  return puzzles[seed % puzzles.length];
}

// 🧠 Puzzle type 2 → Memory / Pattern
export function getMemoryPuzzle() {
  const seed = getTodaySeed();

  const puzzles = [
    {
      question: "Remember: 🔴 🟢 🔵. Enter the middle color.",
      answer: "green",
    },
    {
      question: "Remember: 🟡 ⚫ 🟠. Enter the first color.",
      answer: "yellow",
    },
    {
      question: "Remember: ⭐ 🌙 ☀️. Enter the last symbol.",
      answer: "sun",
    },
  ];

  return puzzles[seed % puzzles.length];
}

// 🎯 Main daily puzzle (used in Puzzle.tsx)
export function getTodayPuzzle() {
  const type = getPuzzleType();

  if (type === "math") return getMathPuzzle();
  return getMemoryPuzzle();
}

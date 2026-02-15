// Simple deterministic puzzle generator (fast demo version)

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

export function getTodaySeed() {
  const today = new Date().toISOString().slice(0, 10);
  return hashCode(today + "secret_key");
}

export function getTodayPuzzle() {
  const seed = getTodaySeed();

  const puzzles = [
    {
      question: "What is 7 + 5?",
      answer: "12",
    },
    {
      question: "Reverse 'code'",
      answer: "edoc",
    },
    {
      question: "What is 9 × 3?",
      answer: "27",
    },
    {
      question: "What is 15 - 4?",
      answer: "11",
    },
    { question: "5 + 7 ?", answer: "12" },
    { question: "10 - 3 ?", answer: "7" },
    { question: "6 * 4 ?", answer: "24" },
    { question: "20 / 5 ?", answer: "4" },
  ];

  return puzzles[seed % puzzles.length];
}

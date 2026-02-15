export function unlockBadge(streak: number) {
  const badges = JSON.parse(localStorage.getItem("badges") || "[]");

  if (streak === 1 && !badges.includes("first")) {
    badges.push("first");
  }

  if (streak === 7 && !badges.includes("weekly")) {
    badges.push("weekly");
  }

  if (streak === 30 && !badges.includes("monthly")) {
    badges.push("monthly");
  }

  localStorage.setItem("badges", JSON.stringify(badges));
}

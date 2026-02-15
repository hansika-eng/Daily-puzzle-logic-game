export function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const last = localStorage.getItem("lastDate");
  let streak = Number(localStorage.getItem("streak") || 0);

  if (last === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const y = yesterday.toISOString().slice(0, 10);

  if (last === y) {
    streak++;
  } else {
    streak = 1;
  }

  localStorage.setItem("lastDate", today);
  localStorage.setItem("streak", String(streak));

  return streak;
}

export function getStreak() {
  return Number(localStorage.getItem("streak") || 0);
}

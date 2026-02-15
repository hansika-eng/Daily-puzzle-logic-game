export function saveActivity(date: string) {
  const data = JSON.parse(localStorage.getItem("activity") || "{}");
  data[date] = true;
  localStorage.setItem("activity", JSON.stringify(data));
}

export function getActivity() {
  return JSON.parse(localStorage.getItem("activity") || "{}");
}

export function saveProgress(date: string) {
  localStorage.setItem("progress-" + date, "done");
}

export function isCompleted(date: string) {
  return localStorage.getItem("progress-" + date) === "done";
}

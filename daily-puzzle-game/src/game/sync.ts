export async function trySync(userEmail: string) {
  const pending = JSON.parse(localStorage.getItem("pending") || "[]");

  for (const p of pending) {
    try {
      await fetch("/api/save-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          email: userEmail, // ✅ use it here
        }),
      });
    } catch {}
  }

  localStorage.removeItem("pending");
}

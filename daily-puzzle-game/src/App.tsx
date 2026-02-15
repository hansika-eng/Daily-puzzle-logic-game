import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./auth/firebase";
import Login from "./auth/Login";
import Heatmap from "./game/Heatmap";
import Dashboard from "./game/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 💾 Save user in DB
  useEffect(() => {
    if (!user) return;

    fetch("/api/save-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
      }),
    }).catch(console.error);
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (!user) return <Login />;

  // 🎁 Badge display
  const badges = JSON.parse(localStorage.getItem("badges") || "[]");

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user.displayName}
      </h1>

      <p className="text-gray-400 mb-4">{user.email}</p>

      <button
        onClick={handleLogout}
        className="mb-6 px-5 py-2 bg-red-500 rounded-lg"
      >
        Logout
      </button>

      {/* 🎯 Puzzle */}
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>

      {/* 🎁 Badges */}
      {badges.length > 0 && (
        <div className="mt-4 flex gap-2">
          {badges.includes("first") && (
            <span className="px-3 py-1 bg-yellow-500 text-black rounded-full">
              🏆 First Win
            </span>
          )}
          {badges.includes("weekly") && (
            <span className="px-3 py-1 bg-purple-500 rounded-full">
              🔥 7 Day Streak
            </span>
          )}
        </div>
      )}

      {/* 🔥 Heatmap */}
      <div className="mt-8 w-full max-w-4xl">
        <Heatmap />
      </div>
    </div>
  );
}

export default App;
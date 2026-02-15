import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./auth/firebase";
import Login from "./auth/Login";
import Puzzle from "./game/Puzzle";
import Heatmap from "./game/Heatmap";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 💾 Save user to Neon
  useEffect(() => {
    const saveUser = async () => {
      if (!user) return;

      try {
        await fetch("/api/save-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
          }),
        });
      } catch (err) {
        console.error("User Save Error:", err);
      }
    };

    saveUser();
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

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-4">
      <div className="max-w-lg w-full space-y-6 text-center">

        <h1 className="text-3xl font-bold">
          Welcome, {user.displayName}
        </h1>

        <p>{user.email}</p>

        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

        {/* 🎮 Daily Puzzle */}
        <Puzzle user={user} />

        {/* 📊 Heatmap */}
        <Heatmap />

      </div>
    </div>
  );
}

export default App;

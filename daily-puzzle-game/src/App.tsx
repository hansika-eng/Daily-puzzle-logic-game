import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./auth/firebase";
import Login from "./auth/Login";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingScore, setSavingScore] = useState(false);

  // 🔐 Listen for authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 💾 Save user to Neon DB after login
  useEffect(() => {
    const saveUser = async () => {
      if (!user) return;

      try {
        await fetch("/api/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
          }),
        });
      } catch (error) {
        console.error("User Save Error:", error);
      }
    };

    saveUser();
  }, [user]);

  // 🎯 Save test score (temporary)
  const handleSaveScore = async () => {
    if (!user) return;

    setSavingScore(true);

    try {
      const finalScore = 100; // temporary test score

      const response = await fetch("/api/save-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          score: finalScore,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score");
      }

      alert("Score saved successfully!");
    } catch (error) {
      console.error("Score Save Error:", error);
      alert("Error saving score");
    } finally {
      setSavingScore(false);
    }
  };

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Welcome, {user.displayName}
        </h1>

        <p>{user.email}</p>

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={handleSaveScore}
            disabled={savingScore}
            className="px-5 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600"
          >
            {savingScore ? "Saving..." : "Save Test Score"}
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-500 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

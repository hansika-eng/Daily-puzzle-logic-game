import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./auth/firebase";
import Login from "./auth/Login";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Login />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user.displayName}
        </h1>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

export default App;

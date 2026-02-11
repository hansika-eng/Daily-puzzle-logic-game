import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export default function Login() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // 🔥 Send user data to backend (Neon DB)
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

      console.log("User saved to database");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200"
      >
        Sign in with Google
      </button>
    </div>
  );
}

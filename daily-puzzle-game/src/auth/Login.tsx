import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export default function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
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

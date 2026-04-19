import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
  setUser(firebaseUser);
  setLoading(false);
  
  // Sync Google access token to backend so Gmail API works
  if (firebaseUser) {
    try {
      const googleToken = (firebaseUser as any).stsTokenManager?.accessToken || "";
      if (googleToken) {
        const idToken = await firebaseUser.getIdToken();
        await fetch(`${import.meta.env.VITE_API_URL}/auth/sync-google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ googleAccessToken: googleToken }),
        });
      }
    } catch (e) {
      console.error("Failed to sync Google token:", e);
    }
  }
});
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn: handleSignIn, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

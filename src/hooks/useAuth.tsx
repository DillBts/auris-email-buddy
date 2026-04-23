import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { auth, googleProvider } from "@/lib/firebase";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/hooks";

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
  const qc = useQueryClient();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      localStorage.setItem("google_access_token", credential.accessToken);
      await api.post("/auth/sync-google", { googleAccessToken: credential.accessToken });
      const status = await api.get<{ gmailConnected: boolean; hasRefreshToken: boolean }>("/auth/status");
      if (!status.hasRefreshToken) {
        const uid = result.user.uid;
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/gmail?uid=${uid}`;
        return;
      }
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
    }
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

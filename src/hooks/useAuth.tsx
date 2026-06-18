import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/hooks";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      const accessToken = result.credential?.accessToken;
      const idToken = result.credential?.idToken;

      if (accessToken) {
        // Web flow: full OAuth access token available
        localStorage.setItem("google_access_token", accessToken);
        await api.post("/auth/sync-google", { googleAccessToken: accessToken });
        const status = await api.get<{ gmailConnected: boolean; hasRefreshToken: boolean }>("/auth/status");
        if (!status.hasRefreshToken) {
          const uid = result.user?.uid;
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/gmail?uid=${uid}`;
          return;
        }
        qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
      } else if (idToken) {
        // Native Android flow: only idToken available — establish Firebase session then redirect for Gmail OAuth
        await signInWithCredential(auth, GoogleAuthProvider.credential(idToken, null));
        const uid = result.user?.uid;
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/gmail?uid=${uid}`;
      }
    } catch (error) {
      toast({ title: "Sign in failed", description: "Sign in failed. Please try again.", variant: "destructive" });
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

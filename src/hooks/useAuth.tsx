import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut, signInWithCredential, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { isNative, signInWithGoogleNative } from "@/lib/capacitor";
import { useQueryClient } from "@tanstack/react-query";
import { auth, googleProvider } from "@/lib/firebase";
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
      if (isNative()) {
        const result = await signInWithGoogleNative();
        const idToken = result.credential?.idToken;
        await signInWithCredential(auth, GoogleAuthProvider.credential(idToken, null));
        const uid = result.user?.uid;
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/gmail?uid=${uid}`;
        return;
      }

      // Web flow
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      localStorage.setItem("google_access_token", accessToken ?? "");
      await api.post("/auth/sync-google", { googleAccessToken: accessToken });
      const status = await api.get<{ gmailConnected: boolean; hasRefreshToken: boolean }>("/auth/status");
      if (!status.hasRefreshToken) {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/gmail?uid=${result.user?.uid}`;
        return;
      }
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: `${error?.message ?? String(error)}\n\n${error?.stack ?? ""}`,
        variant: "destructive",
      });
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

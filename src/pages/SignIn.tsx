import { motion } from "framer-motion";
import { Headphones, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRedirectResult } from "firebase/auth";
import { auth } from "../../firebase";

const SignIn = () => {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingRedirect, setCheckingRedirect] = useState(true);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate("/", { replace: true });
        }
      })
      .catch((e) => {
        setError(e?.message ?? "Sign in failed");
      })
      .finally(() => {
        setCheckingRedirect(false);
      });
  }, []);

  useEffect(() => {
    if (user && !loading && !checkingRedirect) {
      navigate("/", { replace: true });
    }
  }, [user, loading, checkingRedirect, navigate]);

  if (loading || checkingRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signIn();
    } catch (e: any) {
      setError(e?.message ?? "Sign in failed");
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-surface rounded-3xl p-8 md:p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-soft"
        >
          <Headphones className="w-8 h-8 text-primary-foreground" />
        </motion.div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Auris</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Connect your Google account to start listening to your emails.
        </p>

        <Button
          onClick={handleSignIn}
          disabled={signingIn}
          size="lg"
          className="w-full gradient-primary text-primary-foreground shadow-soft gap-2 h-12"
        >
          {signingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Continue with Google
            </>
          )}
        </Button>

        {error && (
          <p className="text-xs text-destructive mt-4">{error}</p>
        )}

        <p className="text-xs text-muted-foreground mt-6">
          We'll only read the emails you choose to listen to.
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
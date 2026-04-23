import { useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Mail, Bell, Headphones, Volume2, Zap, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuthStatus, useDisconnectGmail, useUserPrefs, useUpdatePrefs, queryKeys } from "@/lib/api/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import type { VoiceSpeed } from "@/lib/api/types";

const SettingsPage = () => {
  const { data: authStatus, isLoading: authLoading } = useAuthStatus();
  const { data: prefsData, isLoading: prefsLoading } = useUserPrefs();
  const disconnectMutation = useDisconnectGmail();
  const updatePrefsMutation = useUpdatePrefs();
  const qc = useQueryClient();
  const { toast } = useToast();
  const prefs = prefsData?.prefs;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("gmail_connected");
    const error = params.get("gmail_error");

    if (connected === "true") {
      toast({ title: "Gmail connected", description: "Your inbox is ready." });
      qc.invalidateQueries({ queryKey: queryKeys.authStatus() });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error) {
      toast({ title: "Gmail connection failed", description: error, variant: "destructive" });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleConnectGmail = () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/gmail?uid=${uid}`;
  };

  const handlePref = (key: string, value: boolean | string) => {
    updatePrefsMutation.mutate({ [key]: value } as any);
  };

  if (prefsLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border/50">
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-2xl space-y-4 md:space-y-6">

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-surface rounded-2xl p-4 md:p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-primary" />
              Email Account
            </h3>
            {authStatus?.gmailConnected ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{authStatus.email}</p>
                    <p className="text-xs text-muted-foreground">Connected via Gmail</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => disconnectMutation.mutate()} disabled={disconnectMutation.isPending} className="shrink-0">
                  {disconnectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disconnect"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">Connect your email to get started</p>
                <Button onClick={handleConnectGmail} className="gradient-primary text-primary-foreground shadow-soft gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Connect Gmail
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-surface rounded-2xl p-4 md:p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Headphones className="w-4 h-4 text-primary" />
              Listening Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Auto-play on open</p>
                  <p className="text-xs text-muted-foreground">Start reading emails automatically</p>
                </div>
                <Switch checked={prefs?.autoListen ?? false} onCheckedChange={(v) => handlePref("autoListen", v)} disabled={updatePrefsMutation.isPending} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Voice Speed
                </p>
                <div className="flex gap-2">
                  {(["slow", "normal", "fast"] as VoiceSpeed[]).map((s) => (
                    <button key={s} onClick={() => handlePref("voiceSpeed", s)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${prefs?.voiceSpeed === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-surface rounded-2xl p-4 md:p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              Smart Features
            </h3>
            <div className="space-y-4">
              {[
                { key: "smartPriority", label: "AI Priority Detection", desc: "Automatically classify email importance" },
                { key: "dailySummary", label: "Daily Summary", desc: "Get a summary each morning" },
                { key: "weeklySummary", label: "Weekly Digest", desc: "Receive a weekly email overview" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={prefs?.[key as keyof typeof prefs] as boolean ?? true}
                    onCheckedChange={(v) => handlePref(key, v)}
                    disabled={updatePrefsMutation.isPending}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-surface rounded-2xl p-4 md:p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-primary" />
              Notifications
            </h3>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified for important emails</p>
              </div>
              <Switch checked={prefs?.notifications ?? true} onCheckedChange={(v) => handlePref("notifications", v)} disabled={updatePrefsMutation.isPending} />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
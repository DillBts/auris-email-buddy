import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Mail, Bell, Shield, Headphones, Volume2, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoListen, setAutoListen] = useState(false);
  const [smartPriority, setSmartPriority] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState("normal");

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-border/50">
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* Account */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-surface rounded-2xl p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-primary" />
              Email Account
            </h3>
            {connected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">user@gmail.com</p>
                    <p className="text-xs text-muted-foreground">Connected via Gmail</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setConnected(false)}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">Connect your email to get started</p>
                <Button onClick={() => setConnected(true)} className="gradient-primary text-primary-foreground shadow-soft gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Connect Gmail
                </Button>
              </div>
            )}
          </motion.div>

          {/* Listening */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-surface rounded-2xl p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Headphones className="w-4 h-4 text-primary" />
              Listening Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-play on open</p>
                  <p className="text-xs text-muted-foreground">Start reading emails automatically</p>
                </div>
                <Switch checked={autoListen} onCheckedChange={setAutoListen} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Voice Speed
                </p>
                <div className="flex gap-2">
                  {["slow", "normal", "fast"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setVoiceSpeed(s)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                        voiceSpeed === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Smart features */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-surface rounded-2xl p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              Smart Features
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">AI Priority Detection</p>
                  <p className="text-xs text-muted-foreground">Automatically classify email importance</p>
                </div>
                <Switch checked={smartPriority} onCheckedChange={setSmartPriority} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Daily Summary</p>
                  <p className="text-xs text-muted-foreground">Get a summary each morning</p>
                </div>
                <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Weekly Digest</p>
                  <p className="text-xs text-muted-foreground">Receive a weekly email overview</p>
                </div>
                <Switch checked={weeklySummary} onCheckedChange={setWeeklySummary} />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-surface rounded-2xl p-6">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-primary" />
              Notifications
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified for important emails</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

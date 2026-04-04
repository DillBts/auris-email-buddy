import { useState } from "react";
import { motion } from "framer-motion";
import { Headphones, Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { mockEmails } from "@/lib/mockData";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";

const Listen = () => {
  const emails = mockEmails.filter((e) => !e.trashed);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"full" | "summary">("summary");

  const current = emails[currentIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border/50">
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Headphones className="w-5 h-5 text-primary" />
          Listen Mode
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Hands-free email listening</p>
      </div>

      <div className="flex-1 overflow-y-auto flex items-start md:items-center justify-center p-4 md:p-8">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          {/* Now playing card */}
          <div className="glass-surface rounded-2xl p-5 md:p-8 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-soft">
              <span className="text-xl md:text-2xl font-bold text-primary-foreground">{current.from[0]}</span>
            </div>

            <PriorityBadge priority={current.priority} />
            <h2 className="text-base md:text-lg font-bold text-foreground mt-3 mb-1 line-clamp-2">{current.subject}</h2>
            <p className="text-sm text-muted-foreground mb-1">From {current.from}</p>
            <p className="text-xs text-muted-foreground">{current.date} · {current.time}</p>

            {/* Mode toggle */}
            <div className="flex items-center justify-center gap-2 mt-5 md:mt-6 mb-5 md:mb-6">
              <button
                onClick={() => setMode("summary")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "summary" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setMode("full")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  mode === "full" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                Full Email
              </button>
            </div>

            {/* Preview text */}
            <div className="bg-muted/50 rounded-xl p-4 mb-5 md:mb-6 text-left max-h-32 md:max-h-40 overflow-y-auto">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {mode === "summary" ? current.preview : current.body}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-muted rounded-full mb-5 md:mb-6">
              <div className="h-1 bg-primary rounded-full w-1/3 transition-all" />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                className="p-3 rounded-full hover:bg-muted transition-colors text-foreground/60"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <Button
                onClick={() => setPlaying(!playing)}
                className="w-14 h-14 rounded-full gradient-primary shadow-soft"
                size="icon"
              >
                {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </Button>
              <button
                onClick={() => setCurrentIndex(Math.min(emails.length - 1, currentIndex + 1))}
                className="p-3 rounded-full hover:bg-muted transition-colors text-foreground/60"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <div className="w-24 h-1 bg-muted rounded-full">
                <div className="h-1 bg-primary/50 rounded-full w-3/4" />
              </div>
            </div>
          </div>

          {/* Queue */}
          <div className="mt-5 md:mt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Up Next ({emails.length - currentIndex - 1} remaining)
            </p>
            <div className="space-y-2">
              {emails.slice(currentIndex + 1, currentIndex + 4).map((email) => (
                <div key={email.id} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/30">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                    {email.from[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{email.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">{email.from}</p>
                  </div>
                  <PriorityBadge priority={email.priority} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Listen;

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Play, Pause, SkipForward, SkipBack, Loader2, Trash2, ChevronDown } from "lucide-react";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";
import { useInbox, useGenerateAudio, useAudioUrls, useUserPrefs, useUpdatePrefs, useTrashEmail } from "@/lib/api/hooks";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import type { VoiceSpeed, VoiceType } from "@/lib/api/types";

const VOICE_NAMES: Record<VoiceType, string> = {
  "en-US-Neural2-A": "Marianne",
  "en-US-Neural2-B": "James",
  "en-US-Neural2-C": "Sophie",
  "en-US-Neural2-D": "Default",
};

const SPEED_LABELS: Record<VoiceSpeed, string> = {
  slow: "0.8x",
  normal: "1.0x",
  fast: "1.2x",
};

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

const Listen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"full" | "summary">("summary");
  const [audioReady, setAudioReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoPlayRef = useRef(false);
  const didAutoStart = useRef(false);
  const { toast } = useToast();

  const [searchParams] = useSearchParams();
  const deepLinkId = searchParams.get("emailId");
  const deepLinkMode = searchParams.get("mode") as "full" | "summary" | null;

  const { data: inboxData, isLoading: inboxLoading } = useInbox();
  const { data: prefsData } = useUserPrefs();
  const updatePrefsMutation = useUpdatePrefs();
  const trashMutation = useTrashEmail();
  const emails = inboxData?.emails ?? [];
  const current = emails[currentIndex];
  const speed: VoiceSpeed = prefsData?.prefs?.voiceSpeed ?? "normal";
  const voiceType: VoiceType = prefsData?.prefs?.voiceType ?? "en-US-Neural2-A";

  const generateMutation = useGenerateAudio();
  const { data: audioUrls } = useAudioUrls(current?.id ?? "", speed, audioReady);

  useEffect(() => {
    if (!deepLinkId || emails.length === 0) return;
    const idx = emails.findIndex((e) => e.id === deepLinkId);
    if (idx !== -1) setCurrentIndex(idx);
    if (deepLinkMode) setMode(deepLinkMode);
  }, [deepLinkId, emails.length]);

  useEffect(() => {
    if (!deepLinkId || didAutoStart.current || !current || current.id !== deepLinkId) return;
    didAutoStart.current = true;
    autoPlayRef.current = true;
    generateMutation.mutate(
      { emailId: current.id, speed },
      {
        onSuccess: () => setAudioReady(true),
        onError: () => {
          autoPlayRef.current = false;
          toast({ title: "Failed to generate audio", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  }, [current?.id, deepLinkId]);

  useEffect(() => {
    if (!audioReady || !autoPlayRef.current || !audioRef.current) return;
    const url = mode === "summary" ? audioUrls?.summaryUrl : audioUrls?.fullUrl;
    if (!url) return;
    autoPlayRef.current = false;
    audioRef.current.src = url;
    audioRef.current.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [audioUrls]);

  useEffect(() => {
    if (!audioReady || !audioRef.current) return;
    const url = mode === "summary" ? audioUrls?.summaryUrl : audioUrls?.fullUrl;
    if (!url) return;
    audioRef.current.pause();
    audioRef.current.src = url;
    setPlaying(false);
  }, [mode]);

  const goTo = (index: number) => {
    audioRef.current?.pause();
    setPlaying(false);
    setAudioReady(false);
    setCurrentTime(0);
    setDuration(0);
    generateMutation.reset();
    setCurrentIndex(index);
  };

  const handlePlay = () => {
    if (!current) return;
    if (!audioReady) {
      autoPlayRef.current = true;
      generateMutation.mutate(
        { emailId: current.id, speed },
        {
          onSuccess: () => setAudioReady(true),
          onError: () => {
            autoPlayRef.current = false;
            toast({ title: "Failed to generate audio", description: "Please try again.", variant: "destructive" });
          },
        }
      );
      return;
    }
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleSkip = () => {
    if (currentIndex < emails.length - 1) goTo(currentIndex + 1);
  };

  const handleArchive = async () => {
    if (!current) return;
    try {
      await trashMutation.mutateAsync(current.id);
      if (currentIndex < emails.length - 1) goTo(currentIndex + 1);
      else goTo(Math.max(0, currentIndex - 1));
    } catch {
      toast({ title: "Failed to archive email", variant: "destructive" });
    }
  };

  const remainingMins = Math.round((emails.length - currentIndex - 1) * 1.5);
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isGenerating = generateMutation.isPending;

  if (inboxLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No emails to listen to.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => {
          setPlaying(false);
          if (currentIndex < emails.length - 1) goTo(currentIndex + 1);
        }}
      />

      {/* Header with session progress */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            Listen Mode
          </h1>
          <span className="text-sm text-muted-foreground">
            Email {currentIndex + 1} of {emails.length}
            {remainingMins > 0 && <> · <span className="text-foreground/60">{remainingMins} min remaining</span></>}
          </span>
        </div>

        {/* Session progress line */}
        <div className="mt-2.5 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: emails.length > 0 ? `${((currentIndex + 1) / emails.length) * 100}%` : "0%" }}
          />
        </div>
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

            {/* Audio progress bar */}
            <div className="mb-5 md:mb-6">
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {duration > 0 && (
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground tabular-nums">{fmt(currentTime)}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{fmt(duration)}</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => goTo(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="p-3 rounded-full hover:bg-muted transition-colors text-foreground/50 disabled:opacity-30"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <Button
                onClick={handlePlay}
                disabled={isGenerating}
                className="w-20 h-20 rounded-full gradient-primary shadow-soft"
                size="icon"
              >
                {isGenerating
                  ? <Loader2 className="w-8 h-8 animate-spin" />
                  : playing
                    ? <Pause className="w-8 h-8" />
                    : <Play className="w-8 h-8 ml-1" />}
              </Button>

              <button
                onClick={() => goTo(Math.min(emails.length - 1, currentIndex + 1))}
                disabled={currentIndex === emails.length - 1}
                className="p-3 rounded-full hover:bg-muted transition-colors text-foreground/50 disabled:opacity-30"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Voice & speed selector */}
            <div className="mt-4">
              <button
                onClick={() => setShowVoicePanel((v) => !v)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Voice: {VOICE_NAMES[voiceType]} · {SPEED_LABELS[speed]}
                <ChevronDown className={`w-3 h-3 transition-transform ${showVoicePanel ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showVoicePanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-3 bg-muted/50 rounded-xl text-left space-y-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Voice</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(Object.entries(VOICE_NAMES) as [VoiceType, string][]).map(([val, name]) => (
                            <button
                              key={val}
                              onClick={() => updatePrefsMutation.mutate({ voiceType: val })}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                voiceType === val ? "bg-primary text-primary-foreground" : "bg-background text-foreground/70 hover:bg-muted"
                              }`}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Speed</p>
                        <div className="flex gap-1.5">
                          {(Object.entries(SPEED_LABELS) as [VoiceSpeed, string][]).map(([val, label]) => (
                            <button
                              key={val}
                              onClick={() => updatePrefsMutation.mutate({ voiceSpeed: val })}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                speed === val ? "bg-primary text-primary-foreground" : "bg-background text-foreground/70 hover:bg-muted"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick actions */}
            <div className="flex items-center justify-center gap-3 mt-5 pt-5 border-t border-border/40">
              <button
                onClick={handleSkip}
                disabled={currentIndex === emails.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30"
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </button>
              <button
                onClick={handleArchive}
                disabled={trashMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Archive
              </button>
            </div>
          </div>

          {/* Queue */}
          <div className="mt-5 md:mt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Up Next ({emails.length - currentIndex - 1} remaining)
            </p>
            <div className="space-y-2">
              {emails.slice(currentIndex + 1, currentIndex + 4).map((email) => (
                <div
                  key={email.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => goTo(emails.indexOf(email))}
                >
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

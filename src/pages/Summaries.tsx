import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Calendar, TrendingUp, Headphones, AlertCircle, CheckCircle, Loader2, Pause } from "lucide-react";
import { useDailySummaries, useWeeklySummary, useGenerateSummaryAudio, useUserPrefs } from "@/lib/api/hooks";

const WEEKLY_ID = "__weekly__";

const Summaries = () => {
  const [tab, setTab] = useState<"daily" | "weekly">("daily");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: dailyData } = useDailySummaries(7);
  const { data: weeklyData } = useWeeklySummary();
  const { data: prefsData } = useUserPrefs();
  const generateAudio = useGenerateSummaryAudio();

  const voiceSpeed = prefsData?.prefs?.voiceSpeed ?? "normal";

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const mockDailySummaries = dailyData?.summaries ?? [];
  const mockWeeklySummary = weeklyData?.summary ?? {
    week: "",
    totalEmails: 0,
    veryImportant: 0,
    important: 0,
    notImportant: 0,
    summary: "",
    actionItems: [] as string[],
    topSenders: [] as { name: string; count: number }[],
  };

  const handleListen = async (trackId: string, summaryId: string, text: string, type: "daily" | "weekly") => {
    if (playingId === trackId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
    setErrorId(null);
    setLoadingId(trackId);
    try {
      console.log("[handleListen] summaryId being sent:", summaryId);
      const result = await generateAudio.mutateAsync({ summaryId, text, type, speed: voiceSpeed });
      const audio = new Audio(result.url);
      audioRef.current = audio;
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => { setPlayingId(null); setErrorId(trackId); };
      await audio.play();
      setPlayingId(trackId);
    } catch {
      setErrorId(trackId);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Email Summaries
            </h1>
            <p className="text-sm text-muted-foreground mt-1">AI-powered email insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-4">
          {(["daily", "weekly"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              {t === "daily" ? <><Calendar className="w-4 h-4 inline mr-1.5" />Daily</> : <><TrendingUp className="w-4 h-4 inline mr-1.5" />Weekly</>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {tab === "daily" ? (
          <div className="space-y-4 max-w-3xl">
            {mockDailySummaries.map((day, i) => (
              <motion.div key={day.date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-surface rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">{day.date}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{day.totalEmails} emails</span>
                    <button
                      onClick={() => {
                        if (!day.date || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
                          console.error("[Summaries] invalid daily summaryId:", day.date);
                          return;
                        }
                        handleListen(day.date, day.date, day.audioSummary, "daily");
                      }}
                      disabled={loadingId === day.date}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-60 ${errorId === day.date ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                    >
                      {loadingId === day.date ? <><Loader2 className="w-3 h-3 animate-spin" />Generating…</>
                        : playingId === day.date ? <><Pause className="w-3 h-3" />Pause</>
                        : errorId === day.date ? <><AlertCircle className="w-3 h-3" />Retry</>
                        : <><Headphones className="w-3 h-3" />Listen</>}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
                  <div className="bg-destructive/10 rounded-xl p-2 md:p-3 text-center">
                    <p className="text-xl md:text-2xl font-bold text-destructive">{day.veryImportant}</p>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-destructive/70 font-semibold">Urgent</p>
                  </div>
                  <div className="bg-priority-medium/10 rounded-xl p-2 md:p-3 text-center">
                    <p className="text-xl md:text-2xl font-bold text-priority-medium">{day.important}</p>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-priority-medium/70 font-semibold">Important</p>
                  </div>
                  <div className="bg-priority-low/10 rounded-xl p-2 md:p-3 text-center">
                    <p className="text-xl md:text-2xl font-bold text-priority-low">{day.notImportant}</p>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-priority-low/70 font-semibold">Low Priority</p>
                  </div>
                </div>
                {day.highlights.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Highlights</p>
                    <ul className="space-y-2">
                      {day.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                          <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="glass-surface rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-foreground">{mockWeeklySummary.week}</h3>
                <button
                  onClick={() => {
                    const weekStart = weeklyData?.summary?.weekStart;
                    if (!weekStart) {
                      console.error("[Summaries] weekStart missing — full summary object:", weeklyData?.summary);
                      return;
                    }
                    handleListen(WEEKLY_ID, weekStart, mockWeeklySummary.audioSummary, "weekly");
                  }}
                  disabled={loadingId === WEEKLY_ID}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${errorId === WEEKLY_ID ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                >
                  {loadingId === WEEKLY_ID ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</>
                    : playingId === WEEKLY_ID ? <><Pause className="w-4 h-4" />Pause</>
                    : errorId === WEEKLY_ID ? <><AlertCircle className="w-4 h-4" />Retry</>
                    : <><Headphones className="w-4 h-4" />Listen to Summary</>}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-5">{mockWeeklySummary.totalEmails} total emails</p>
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                <div className="bg-destructive/10 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xl md:text-2xl font-bold text-destructive">{mockWeeklySummary.veryImportant}</p>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-destructive/70 font-semibold">Urgent</p>
                </div>
                <div className="bg-priority-medium/10 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xl md:text-2xl font-bold text-priority-medium">{mockWeeklySummary.important}</p>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-priority-medium/70 font-semibold">Important</p>
                </div>
                <div className="bg-priority-low/10 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xl md:text-2xl font-bold text-priority-low">{mockWeeklySummary.notImportant}</p>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-priority-low/70 font-semibold">Low Priority</p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed bg-muted/30 rounded-xl p-4">{mockWeeklySummary.summary}</p>
            </div>
            <div className="glass-surface rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Action Items</h4>
              <ul className="space-y-2">
                {mockWeeklySummary.actionItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                    <div className="w-5 h-5 rounded border-2 border-primary/30 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-surface rounded-2xl p-4 md:p-6">
              <h4 className="font-bold text-foreground mb-3">Top Senders</h4>
              <div className="space-y-3">
                {mockWeeklySummary.topSenders.map((sender) => (
                  <div key={sender.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">{sender.name[0]}</div>
                    <span className="text-sm font-medium text-foreground flex-1 min-w-0 truncate">{sender.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{sender.count}</span>
                    <div className="w-16 md:w-20 h-1.5 bg-muted rounded-full shrink-0">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${(sender.count / 15) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Summaries;

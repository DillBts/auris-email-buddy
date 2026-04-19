import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Calendar, TrendingUp, Headphones, AlertCircle, CheckCircle } from "lucide-react";
import { mockDailySummaries, mockWeeklySummary } from "@/lib/mockData";

const Summaries = () => {
  const [tab, setTab] = useState<"daily" | "weekly">("daily");

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
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                      <Headphones className="w-3 h-3" />
                      Listen
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
                  <div className="bg-destructive/10 rounded-xl p-2 md:p-3 text-center">
                    <p className="text-xl md:text-2xl font-bold text-destructive">{day.veryImportant}</p>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-destructive/70 font-semibold">Very Important</p>
                  </div>
                  <div className="bg-priority-medium/10 rounded-xl p-2 md:p-3 text-center">
                    <p className="text-xl md:text-2xl font-bold text-priority-medium">{day.important}</p>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-priority-medium/70 font-semibold">Important</p>
                  </div>
                  <div className="bg-priority-low/10 rounded-xl p-2 md:p-3 text-center">
                    <p className="text-xl md:text-2xl font-bold text-priority-low">{day.notImportant}</p>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-priority-low/70 font-semibold">Not Important</p>
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
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                  <Headphones className="w-4 h-4" />
                  Listen to Summary
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-5">{mockWeeklySummary.totalEmails} total emails</p>
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                <div className="bg-destructive/10 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xl md:text-2xl font-bold text-destructive">{mockWeeklySummary.veryImportant}</p>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-destructive/70 font-semibold">Very Important</p>
                </div>
                <div className="bg-priority-medium/10 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xl md:text-2xl font-bold text-priority-medium">{mockWeeklySummary.important}</p>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-priority-medium/70 font-semibold">Important</p>
                </div>
                <div className="bg-priority-low/10 rounded-xl p-2 md:p-3 text-center">
                  <p className="text-xl md:text-2xl font-bold text-priority-low">{mockWeeklySummary.notImportant}</p>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-priority-low/70 font-semibold">Not Important</p>
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

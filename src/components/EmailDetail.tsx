import { motion } from "framer-motion";
import { Headphones, Trash2, Star, ArrowLeft, Volume2 } from "lucide-react";
import type { Email } from "@/lib/mockData";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "./ui/button";

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  onTrash: (id: string) => void;
}

export function EmailDetail({ email, onBack, onTrash }: EmailDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/30 hover:bg-primary/10">
            <Volume2 className="w-4 h-4" />
            Listen
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/30 hover:bg-primary/10">
            <Headphones className="w-4 h-4" />
            Summary
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Star className={`w-4 h-4 ${email.starred ? "fill-priority-medium text-priority-medium" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => onTrash(email.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-2xl">
          <div className="flex items-start gap-2 mb-1">
            <h1 className="text-xl font-bold text-foreground">{email.subject}</h1>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <PriorityBadge priority={email.priority} />
            {email.labels.map((l) => (
              <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                {l}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {email.from[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{email.from}</p>
              <p className="text-xs text-muted-foreground">{email.fromEmail}</p>
            </div>
            <span className="ml-auto text-xs text-muted-foreground">
              {email.date} at {email.time}
            </span>
          </div>

          <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
            {email.body}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { Star, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import type { Email } from "@/lib/mockData";
import { PriorityBadge } from "./PriorityBadge";

interface EmailRowProps {
  email: Email;
  selected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

export function EmailRow({ email, selected, onSelect, index }: EmailRowProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      onClick={() => onSelect(email.id)}
      className={`w-full text-left flex items-start gap-4 px-5 py-4 border-b border-border/50 transition-all duration-200 group ${
        selected
          ? "bg-primary/8 border-l-2 border-l-primary"
          : "hover:bg-muted/50 border-l-2 border-l-transparent"
      } ${!email.read ? "bg-card" : ""}`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0 mt-0.5">
        {email.from[0]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-sm truncate ${!email.read ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
            {email.from}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">{email.time}</span>
        </div>
        <p className={`text-sm truncate mb-1.5 ${!email.read ? "font-semibold text-foreground" : "text-foreground/70"}`}>
          {email.subject}
        </p>
        <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
        <div className="flex items-center gap-2 mt-2">
          <PriorityBadge priority={email.priority} />
          {email.starred && <Star className="w-3.5 h-3.5 text-priority-medium fill-priority-medium" />}
        </div>
      </div>

      {/* Listen button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-primary/10 text-primary shrink-0 mt-1"
        title="Listen to email"
      >
        <Headphones className="w-4 h-4" />
      </button>
    </motion.button>
  );
}

import { Star, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import type { Email } from "@/lib/mockData";
import type { Priority } from "@/lib/api/types";

const AVATAR_PALETTES = [
  { bg: "#EDE9FE", text: "#6D28D9" }, // purple
  { bg: "#CCFBF1", text: "#0D9488" }, // teal
  { bg: "#FFE4E6", text: "#E11D48" }, // coral/rose
  { bg: "#FEF3C7", text: "#D97706" }, // amber
  { bg: "#DCFCE7", text: "#16A34A" }, // green
  { bg: "#DBEAFE", text: "#2563EB" }, // blue
  { bg: "#FCE7F3", text: "#DB2777" }, // pink
  { bg: "#F3E8FF", text: "#9333EA" }, // violet
];

function avatarPalette(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

const priorityMeta: Record<Priority, { label: string; color: string }> = {
  "very-important": { label: "Urgent", color: "hsl(0 72% 60%)" },
  important:        { label: "Important", color: "hsl(38 90% 55%)" },
  "not-important":  { label: "Low Priority", color: "hsl(220 5% 55%)" },
};

interface EmailRowProps {
  email: Email;
  selected: boolean;
  onSelect: (id: string) => void;
  onListen?: (id: string) => void;
  index: number;
}

export function EmailRow({ email, selected, onSelect, onListen, index }: EmailRowProps) {
  const meta = priorityMeta[email.priority];
  const palette = avatarPalette(email.from);

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      onClick={() => onSelect(email.id)}
      className={`w-full text-left flex items-start gap-4 px-5 py-5 border-b border-border/50 transition-all duration-200 group ${
        selected
          ? "bg-primary/8 border-l-2 border-l-primary"
          : "hover:bg-muted/50 border-l-2 border-l-transparent"
      } ${!email.read ? "bg-card" : ""}`}
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
        style={{ backgroundColor: palette.bg, color: palette.text }}
      >
        {email.from[0]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className={`text-sm leading-snug truncate ${!email.read ? "font-bold text-foreground" : "font-medium text-foreground/75"}`}>
          {email.from}
        </span>
        <p className={`text-sm leading-snug truncate ${!email.read ? "font-semibold text-foreground/90" : "font-normal text-foreground/60"}`}>
          {email.subject}
        </p>
        <p className="text-xs text-muted-foreground/70 truncate leading-snug">{email.preview}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="rounded-full shrink-0"
            style={{ width: 6, height: 6, backgroundColor: meta.color }}
          />
          <span className="text-[11px] text-muted-foreground/60 font-medium">
            {meta.label} · {email.time}
          </span>
          {email.starred && (
            <Star className="w-3 h-3 text-priority-medium fill-priority-medium ml-1 shrink-0" />
          )}
        </div>
      </div>

      {/* Listen button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onListen?.(email.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-primary/10 text-primary shrink-0 mt-0.5"
        title="Listen to email"
      >
        <Headphones className="w-4 h-4" />
      </button>
    </motion.button>
  );
}

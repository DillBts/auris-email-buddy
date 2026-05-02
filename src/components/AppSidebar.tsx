import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Inbox,
  BarChart3,
  Trash2,
  Settings,
  Star,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: Inbox, label: "Inbox", path: "/" },
  { icon: Star, label: "Starred", path: "/starred" },
  { icon: Headphones, label: "Listen", path: "/listen" },
  { icon: BarChart3, label: "Summaries", path: "/summaries" },
  { icon: Trash2, label: "Trash", path: "/trash" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-screen flex flex-col border-r border-sidebar-border"
      style={{ background: "var(--gradient-sidebar)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 shrink-0">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <defs>
            <linearGradient id="auris-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          {/* Envelope body — rounded rect */}
          <rect x="1.5" y="7.5" width="19" height="14" rx="2.5" stroke="url(#auris-grad)" strokeWidth="1.6" />
          {/* Envelope flap V */}
          <polyline points="1.5,9 11,16 20.5,9" stroke="url(#auris-grad)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          {/* Waveform bars — 5 bars of varying heights, right of envelope */}
          <line x1="24" y1="13" x2="24" y2="19" stroke="url(#auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="26.5" y1="11" x2="26.5" y2="21" stroke="url(#auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="29" y1="14" x2="29" y2="18" stroke="url(#auris-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="31.2" y1="12.5" x2="31.2" y2="19.5" stroke="url(#auris-grad)" strokeWidth="1" strokeLinecap="round" />
        </svg>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col leading-tight"
          >
            <span className="font-bold text-lg text-sidebar-foreground tracking-tight">Auris</span>
            <span className="text-[10px] text-sidebar-foreground/45 font-medium tracking-wide">Listen only to what matters</span>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-3 mt-4">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}

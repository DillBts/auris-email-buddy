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
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 gap-[2px]">
          {[1, 1.6, 1, 0.6, 1].map((scale, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-primary-foreground"
              animate={{ scaleY: [scale, scale * 2.2, scale] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
              style={{ height: 10, transformOrigin: "center" }}
            />
          ))}
        </div>
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

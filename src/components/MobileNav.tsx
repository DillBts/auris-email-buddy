import { useNavigate, useLocation } from "react-router-dom";
import { navItems } from "@/lib/navItems";

const MOBILE_PATHS = new Set(["/", "/listen", "/summaries", "/settings"]);
const mobileNavItems = navItems.filter((item) => MOBILE_PATHS.has(item.path));

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-lg safe-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {mobileNavItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors min-w-0 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

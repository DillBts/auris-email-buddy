import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <main className="flex-1 overflow-hidden pb-16 md:pb-0">
        <Outlet />
      </main>
      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}

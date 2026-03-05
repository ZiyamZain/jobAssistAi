import { useState } from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../contexts/ThemeContext";
import {
  Target,
  Sun,
  Moon,
  FileText,
  MessageSquare,
  BarChart,
  Briefcase,
  Settings,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MENU_ITEMS = [
  { id: "tracker", label: "Job Tracker", path: "/dashboard", icon: Target },
  {
    id: "resume",
    label: "Resume Optimizer",
    path: "/dashboard/resume",
    icon: FileText,
  },
  {
    id: "interviews",
    label: "Mock Interviews",
    path: "/dashboard/interviews",
    icon: MessageSquare,
  },
  {
    id: "skills",
    label: "Skill Analysis",
    path: "/dashboard/skills",
    icon: BarChart,
  },
  {
    id: "tools",
    label: "Cover Letters",
    path: "/dashboard/letters",
    icon: Briefcase,
  },
];

export default function DashboardLayout() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((s) => s.user);
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-white antialiased overflow-hidden transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#0F0F0F] shrink-0 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white dark:text-black" />
          </div>
          <span className="font-semibold tracking-tight text-sm">
            JobAssistAI
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-zinc-50 dark:bg-[#0F0F0F] border-r border-zinc-200 dark:border-white/5 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo Area (Hidden on mobile inside sidebar as it's in the mobile header, visible on desktop) */}
        <div className="hidden md:flex h-16 items-center px-6 border-b border-zinc-200 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white dark:text-black" />
            </div>
            <span className="font-semibold tracking-tight text-sm">
              JobAssistAI
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
          <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-3">
            Features
          </div>

          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative overflow-hidden
                  ${
                    isActive
                      ? "bg-zinc-200/50 dark:bg-white/10 text-zinc-900 dark:text-white font-medium"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-300"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-zinc-900 dark:bg-white rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-400"}`}
                />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-8 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-3">
            Settings
          </div>
          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-300
             ${location.pathname === "/dashboard/settings" ? "bg-zinc-200/50 dark:bg-white/10 text-zinc-900 dark:text-white font-medium" : ""}`}
          >
            <Settings className="w-4 h-4 text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-400" />
            Preferences
          </Link>
        </nav>

        {/* User / Theme Toggle Area bottom */}
        <div className="p-4 border-t border-zinc-200 dark:border-white/5 shrink-0 flex items-center justify-between">
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-3 overflow-hidden p-1.5 -ml-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Avatar className="w-9 h-9 border border-zinc-200 dark:border-white/10 shrink-0">
              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate group-hover:text-zinc-900 dark:group-hover:text-white">
                {user?.name}
              </span>
              <span className="text-xs text-zinc-500 truncate">
                {user?.email}
              </span>
            </div>
          </Link>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all group relative"
          >
            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </div>
      </aside>

      {/* Main Feature Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-white dark:bg-[#0A0A0A]">
        <Outlet />
      </main>
    </div>
  );
}

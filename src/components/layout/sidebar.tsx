"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Activity,
  LayoutGrid,
  BarChart3,
  Package,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import type { Session } from "next-auth";

interface SidebarProps {
  user: Session["user"];
}

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Boards",    href: "/boards" },
  { icon: BarChart3,  label: "Analytics", href: "/analytics" },
  { icon: Package,    label: "Sources",   href: "/sources" },
  { icon: Users,      label: "Team",      href: "/team" },
  { icon: Settings,   label: "Settings",  href: "/settings" },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const initials = (user?.name ?? user?.email ?? "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="
      fixed left-0 top-0 bottom-0 z-40
      flex flex-col
      w-[72px] hover:w-56
      transition-all duration-300 ease-in-out
      overflow-hidden
      group/sidebar
    ">
      {/* Glass panel */}
      <div className="
        flex flex-col flex-1 m-2 rounded-2xl
        bg-white/90 dark:bg-zinc-900/40
        backdrop-blur-xl
        border border-black/[0.08] dark:border-white/[0.07]
        shadow-lg shadow-black/5 dark:shadow-xl dark:shadow-black/20
      ">

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            PulseBoard
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1 p-2 pt-3">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-150 group/item",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-zinc-800/50 border border-transparent"
                )}
              >
                <Icon
                  className={cn(
                    "flex-shrink-0 h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-foreground/50 group-hover/item:text-foreground"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span className={cn(
                  "text-sm font-medium whitespace-nowrap overflow-hidden",
                  "opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200",
                  isActive ? "text-primary" : ""
                )}>
                  {label}
                </span>

                {/* Active dot indicator (visible in collapsed state) */}
                {isActive && (
                  <span className="flex-shrink-0 ml-auto w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover/sidebar:opacity-0 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-2 pb-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-1">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl w-full text-foreground/50 hover:text-foreground hover:bg-black/5 dark:hover:bg-zinc-800/50 transition-all duration-150"
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <Sun className="flex-shrink-0 h-5 w-5" strokeWidth={1.8} />
              : <Moon className="flex-shrink-0 h-5 w-5" strokeWidth={1.8} />
            }
            <span className="text-sm font-medium whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl w-full text-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut className="flex-shrink-0 h-5 w-5" strokeWidth={1.8} />
            <span className="text-sm font-medium whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              Sign out
            </span>
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-3 px-2.5 py-2.5 mt-1 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
            <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 border border-primary/30 text-[11px] font-bold text-primary">
              {initials}
            </div>
            <div className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 overflow-hidden min-w-0">
              <p className="text-xs font-semibold truncate text-foreground">
                {user?.name ?? "User"}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

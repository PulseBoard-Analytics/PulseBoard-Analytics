"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Activity, LogOut, Moon, Sun, User, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";

interface AppNavProps {
  user: Session["user"];
}

export function AppNav({ user }: AppNavProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const initials = (user?.name ?? user?.email ?? "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 glass border-b">
      <div className="container mx-auto px-4 max-w-7xl flex h-14 items-center justify-between">
        {/* Left — logo + nav */}
        <div className="flex items-center gap-6">
          <Link href="/boards" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary shadow-sm transition-transform group-hover:scale-105">
              <Activity className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight text-sm">PulseBoard</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/boards"
              className={cn(
                "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors",
                pathname.startsWith("/boards")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Boards
            </Link>
          </nav>
        </div>

        {/* Right — theme + user */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 gap-2 px-2 text-muted-foreground hover:text-foreground"
                aria-label="User menu"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {initials}
                </div>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-foreground">{user?.name ?? "User"}</span>
                  <span className="text-xs font-normal text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive gap-2"
                onSelect={() => signOut({ callbackUrl: "/auth/signin" })}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

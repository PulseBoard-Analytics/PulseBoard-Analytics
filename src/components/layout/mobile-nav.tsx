"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, BarChart3, Package, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Boards",    href: "/boards" },
  { icon: BarChart3,  label: "Analytics", href: "/analytics" },
  { icon: Package,    label: "Metrics",   href: "/metrics" },
  { icon: Users,      label: "Team",      href: "/team" },
  { icon: Settings,   label: "Settings",  href: "/settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

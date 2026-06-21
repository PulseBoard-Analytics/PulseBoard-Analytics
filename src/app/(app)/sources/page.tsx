import type { Metadata } from "next";
import { Upload, FileText, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Sources" };

const SOURCES = [
  {
    icon: FileText,
    name: "CSV Import",
    description: "Upload a CSV file with name, value, unit, and timestamp columns.",
    status: "Available",
    statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    action: "Use from any board",
    href: "/boards",
  },
  {
    icon: Upload,
    name: "Manual Entry",
    description: "Add individual metrics directly from the board dashboard.",
    status: "Available",
    statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    action: "Use from any board",
    href: "/boards",
  },
  {
    icon: Zap,
    name: "Webhook / API",
    description: "Push metrics programmatically via HTTP POST. Coming soon.",
    status: "Coming soon",
    statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    action: null,
    href: null,
  },
  {
    icon: Plus,
    name: "Google Sheets",
    description: "Sync metrics directly from a Google Sheet on a schedule.",
    status: "Coming soon",
    statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    action: null,
    href: null,
  },
];

export default function SourcesPage() {
  return (
    <div className="space-y-8">
      <div className="pb-2 border-b">
        <h1 className="text-2xl font-extrabold tracking-tight">Data Sources</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your data to PulseBoard
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SOURCES.map(({ icon: Icon, name, description, status, statusColor, action, href }) => (
          <div key={name} className="rounded-2xl border glass-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusColor}`}>
                {status}
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold">{name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
            {action && href ? (
              <Button asChild size="sm" variant="outline" className="rounded-xl w-full">
                <Link href={href}>{action}</Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="rounded-xl w-full" disabled>
                Coming soon
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

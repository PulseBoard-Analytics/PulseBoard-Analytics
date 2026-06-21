import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ShareDashboard } from "@/components/share/share-dashboard";
import { Activity } from "lucide-react";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const board = await db.board.findUnique({
    where: { shareToken: token, isPublic: true },
    select: { name: true, description: true },
  });
  if (!board) return { title: "Board not found" };
  return {
    title: `${board.name} — PulseBoard`,
    description: board.description ?? "Live analytics dashboard",
  };
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;

  const board = await db.board.findUnique({
    where: { shareToken: token, isPublic: true },
    include: {
      metrics: { orderBy: { timestamp: "asc" } },
      owner: { select: { name: true } },
    },
  });

  if (!board) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <header className="glass border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 max-w-7xl flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary transition-transform group-hover:scale-105">
              <Activity className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight text-sm">PulseBoard</span>
          </Link>
          <span className="text-xs font-medium text-muted-foreground border rounded-full px-3 py-1 bg-background/50">
            Read-only view
          </span>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <ShareDashboard board={board} token={token} />
      </main>
    </div>
  );
}

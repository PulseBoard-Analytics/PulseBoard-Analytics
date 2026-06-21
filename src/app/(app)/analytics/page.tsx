import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AnalyticsView } from "@/components/analytics/analytics-view";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [totalBoards, totalMetrics, recentMetrics] = await Promise.all([
    db.board.count({ where: { ownerId: session.user.id } }),
    db.metric.count({
      where: { board: { ownerId: session.user.id } },
    }),
    db.metric.findMany({
      where: { board: { ownerId: session.user.id } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { board: { select: { name: true } } },
    }),
  ]);

  return (
    <AnalyticsView
      totalBoards={totalBoards}
      totalMetrics={totalMetrics}
      recentMetrics={recentMetrics}
    />
  );
}

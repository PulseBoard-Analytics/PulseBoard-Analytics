import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Users, Crown, Mail, Github } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: { select: { provider: true } },
      _count: { select: { boards: true } },
    },
  });

  if (!user) redirect("/auth/signin");

  return (
    <div className="space-y-8">
      <div className="pb-2 border-b">
        <h1 className="text-2xl font-extrabold tracking-tight">Team</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and collaborators
        </p>
      </div>

      {/* Current user card */}
      <div className="rounded-2xl border glass-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Your account
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-lg font-black text-primary">
            {(user.name ?? user.email ?? "U").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-base">{user.name ?? "Unnamed"}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Crown className="h-2.5 w-2.5" /> Owner
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">
                Joined {formatDate(user.createdAt)}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span className="text-xs text-muted-foreground">
                {user._count.boards} board{user._count.boards !== 1 ? "s" : ""}
              </span>
              {user.accounts.length > 0 && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {user.accounts[0].provider === "github"
                      ? <Github className="h-3 w-3" />
                      : <Mail className="h-3 w-3" />}
                    {user.accounts[0].provider === "github" ? "GitHub" : "Email"} login
                  </span>
                </>
              )}
              {user.passwordHash && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" /> Email login
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collaborators — coming soon */}
      <div className="rounded-2xl border border-dashed bg-muted/10 p-10 text-center space-y-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted mx-auto">
          <Users className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-base">Team collaboration coming soon</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Invite team members to collaborate on boards with role-based permissions.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          On the roadmap · Q3 2025
        </div>
      </div>
    </div>
  );
}

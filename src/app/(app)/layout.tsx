import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar user={session.user} />

      {/* Main content — offset by collapsed sidebar width (72px) + margin (8px each side) = 88px */}
      <main className="flex-1 ml-[88px] transition-all duration-300">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}

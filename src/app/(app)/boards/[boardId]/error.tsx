"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function BoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Failed to load board</h2>
        <p className="text-sm text-muted-foreground max-w-sm">{error.message}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild className="rounded-xl">
          <Link href="/boards">← Back to Boards</Link>
        </Button>
        <Button onClick={reset} className="rounded-xl btn-glow">Try Again</Button>
      </div>
    </div>
  );
}

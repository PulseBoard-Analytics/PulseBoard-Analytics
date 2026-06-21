import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, BarChart3 } from "lucide-react";

export default function ShareNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="text-center space-y-6 max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">PulseBoard</span>
        </Link>
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mx-auto">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Board not found</h1>
          <p className="text-sm text-muted-foreground">
            This board doesn&apos;t exist or is no longer public.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

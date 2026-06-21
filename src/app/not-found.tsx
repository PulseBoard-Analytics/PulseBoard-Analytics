import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="text-center space-y-6 max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">PulseBoard</span>
        </Link>

        <div>
          <p className="text-8xl font-extrabold gradient-text leading-none">404</p>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or was moved.
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild className="rounded-xl btn-glow">
            <Link href="/boards">My boards</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

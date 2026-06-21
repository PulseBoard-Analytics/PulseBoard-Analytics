import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Auth Error" };

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 px-4">
      <div className="text-center space-y-6 max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">PulseBoard</span>
        </Link>
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mx-auto">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-sm text-muted-foreground">
            Something went wrong during sign in. Please try again.
          </p>
        </div>
        <Button asChild className="rounded-xl btn-glow w-full font-semibold">
          <Link href="/auth/signin">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}

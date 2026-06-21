import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Activity } from "lucide-react";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  // Always show GitHub button — works once AUTH_GITHUB_ID/SECRET are set
  const githubEnabled = true;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-primary/80 via-teal-600 to-teal-800 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">PulseBoard</span>
        </div>

        <div className="relative space-y-4">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Your data,<br />streaming live.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Real-time analytics dashboards with instant sharing.
          </p>
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {["1,930 DAU", "4.1% CVR", "$19.2k MRR"].map((stat) => (
              <div key={stat} className="rounded-lg bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs text-white font-medium">
                {stat}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">
          Free forever · No credit card · Deploy in minutes
        </p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">PulseBoard</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <SignInForm githubEnabled={githubEnabled} />

          <p className="text-center text-sm text-muted-foreground">
            No account yet?{" "}
            <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

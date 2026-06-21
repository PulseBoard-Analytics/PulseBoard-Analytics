import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Activity, Check } from "lucide-react";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-primary via-violet-600 to-indigo-700 flex-col justify-between p-12">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">PulseBoard</span>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Metrics that<br />move fast.
          </h2>
          <ul className="space-y-3">
            {[
              "Real-time SSE push — zero latency",
              "CSV import up to 500 rows",
              "Public share links, no login needed",
              "Dark mode, fully responsive",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-sm text-white/80">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-white/40 text-xs">
          Free forever · No credit card · Deploy in minutes
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">PulseBoard</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Start building analytics dashboards in seconds
            </p>
          </div>

          <SignUpForm />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

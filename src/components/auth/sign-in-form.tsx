"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Github, Loader2 } from "lucide-react";

interface SignInFormProps {
  githubEnabled?: boolean;
}

export function SignInForm({ githubEnabled = false }: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/boards";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        toast({ title: "Sign in failed", description: "Invalid email or password.", variant: "destructive" });
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    setGithubLoading(true);
    try {
      await signIn("github", { callbackUrl });
    } catch {
      toast({
        title: "GitHub login not configured",
        description: "Add AUTH_GITHUB_ID and AUTH_GITHUB_SECRET to .env.local",
        variant: "destructive",
      });
      setGithubLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {githubEnabled && (
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 rounded-xl gap-2 font-medium"
            onClick={handleGitHub}
            disabled={githubLoading}
          >
            {githubLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
            Continue with GitHub
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-1">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleCredentials} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 rounded-xl"
          />
        </div>
        <Button type="submit" className="w-full h-11 rounded-xl font-semibold btn-glow mt-2" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </div>
  );
}

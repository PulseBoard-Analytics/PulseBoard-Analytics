"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { registerUser } from "@/server/actions/auth";
import { Loader2 } from "lucide-react";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await registerUser({ name, email, password });
      if (!result.success) {
        toast({ title: "Registration failed", description: result.error, variant: "destructive" });
        return;
      }
      const signInResult = await signIn("credentials", { email, password, redirect: false });
      if (signInResult?.error) {
        toast({ title: "Account created", description: "Please sign in." });
        router.push("/auth/signin");
      } else {
        router.push("/boards");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Full name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          className="h-11 rounded-xl"
        />
      </div>
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
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="h-11 rounded-xl"
        />
      </div>
      <Button type="submit" className="w-full h-11 rounded-xl font-semibold btn-glow mt-2" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}

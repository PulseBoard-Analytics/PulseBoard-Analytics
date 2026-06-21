"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Monitor, Shield, Bell, Palette, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SettingsUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

export function SettingsView({ user }: { user: SettingsUser }) {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user.name ?? "");
  const [saving, setSaving] = useState(false);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({ title: "Profile updated" });
  };

  const THEMES = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark",  label: "Dark",  icon: Moon },
    { value: "system",label: "System",icon: Monitor },
  ] as const;

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="pb-2 border-b">
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Profile</h2>
        </div>

        <form onSubmit={handleSaveName} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Display name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl max-w-sm"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </Label>
            <Input
              value={user.email}
              disabled
              className="h-11 rounded-xl max-w-sm opacity-60"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Member since
            </Label>
            <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
          </div>
          <Button type="submit" disabled={saving} className="rounded-xl btn-glow font-semibold">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </section>

      {/* Appearance */}
      <section className="rounded-2xl border glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Appearance</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-150",
                theme === value
                  ? "border-primary/40 bg-primary/5 text-primary"
                  : "border-border hover:border-primary/20 hover:bg-muted/30 text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={theme === value ? 2.5 : 1.8} />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="rounded-2xl border glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground mt-0.5">Last changed: unknown</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => toast({ title: "Password change coming soon" })}>
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => toast({ title: "2FA coming soon" })}>
              Enable
            </Button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border glass-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Notifications</h2>
        </div>
        <div className="p-4 rounded-xl border border-dashed bg-muted/10 text-center">
          <p className="text-sm text-muted-foreground">Notification preferences coming soon</p>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-red-500">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all data</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-red-500/30 text-red-500 hover:bg-red-500/10"
            onClick={() => toast({ title: "Contact support to delete your account", variant: "destructive" })}
          >
            Delete account
          </Button>
        </div>
      </section>
    </div>
  );
}

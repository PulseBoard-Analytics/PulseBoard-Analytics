import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Activity, BarChart3, Globe, Zap, ArrowRight,
  Sparkles, Check, Star, TrendingUp, Users, Shield, Clock,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/boards");

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-6 max-w-7xl flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">PulseBoard</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/auth/signin">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="btn-glow rounded-lg font-semibold">
              <Link href="/auth/signup">
                Get started free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative container mx-auto px-6 max-w-5xl pt-24 pb-16 text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trusted by 2,400+ teams worldwide
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Analytics that move{" "}
              <span className="gradient-text">at your speed</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create stunning dashboards in minutes. Stream metrics in real-time to
              every stakeholder. Share with one link — no login required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button size="lg" asChild className="btn-glow h-12 px-8 text-base rounded-xl font-semibold">
                <Link href="/auth/signup">
                  Start free — no credit card
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base rounded-xl">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Free forever · No credit card · Setup in 2 minutes
            </p>

            {/* Dashboard preview */}
            <div className="relative mx-auto mt-8 max-w-4xl rounded-2xl border bg-card shadow-2xl overflow-hidden dark:shadow-primary/5">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">pulseboard.app/boards/product-metrics</span>
                <div className="ml-auto flex items-center gap-1 text-xs text-emerald-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </div>
              </div>
              {/* KPI tiles mock */}
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Daily Active Users", value: "1,930", change: "+8.4%", up: true },
                  { label: "Revenue",            value: "$19.2k", change: "+21.5%", up: true },
                  { label: "Conversion Rate",    value: "4.1%",   change: "+7.9%",  up: true },
                  { label: "Avg Session",        value: "165s",   change: "+4.4%",  up: true },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border bg-background p-3 space-y-1.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{stat.label}</p>
                    <p className="text-xl font-black tabular-nums text-primary">{stat.value}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      <TrendingUp className="h-2.5 w-2.5" />{stat.change}
                    </span>
                  </div>
                ))}
              </div>
              {/* Chart mock */}
              <div className="px-5 pb-5">
                <div className="rounded-xl border bg-background p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trend over time</span>
                    <span className="text-xs text-muted-foreground">Last 7 weeks</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-20">
                    {[35, 52, 48, 72, 61, 84, 78, 96, 88, 100, 94, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                          height: `${h}%`,
                          background: `rgba(20, 184, 166, ${0.3 + (h / 100) * 0.6})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-6 max-w-5xl py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: "2,400+", label: "Boards created" },
                { value: "180k+", label: "Metrics tracked" },
                { value: "99.9%", label: "Uptime SLA" },
                { value: "<50ms", label: "Avg. SSE latency" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-extrabold text-primary tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="container mx-auto px-6 max-w-6xl py-24">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Everything you need
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Built for speed, built for teams</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From solo founders tracking one metric to teams sharing live dashboards — PulseBoard scales with you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: BarChart3,
                title: "Beautiful charts",
                body: "Area charts, bar charts, and KPI tiles that update live as data flows in. Powered by Recharts.",
                color: "bg-primary/10 text-primary border-primary/20",
              },
              {
                icon: Zap,
                title: "Real-time, zero latency",
                body: "Server-Sent Events push every change to all viewers in under 50ms. No polling. No refresh.",
                color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
              },
              {
                icon: Globe,
                title: "One-click sharing",
                body: "Toggle a board public and share a tokenized read-only URL. No login required for viewers.",
                color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
              },
              {
                icon: Users,
                title: "Team collaboration",
                body: "Multiple viewers on the same board see every update simultaneously in real-time.",
                color: "bg-violet-500/10 text-violet-500 border-violet-500/20",
              },
              {
                icon: Shield,
                title: "Secure by default",
                body: "JWT auth, bcrypt passwords, Zod-validated inputs, and private boards only visible to owners.",
                color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
              },
              {
                icon: Clock,
                title: "CSV import",
                body: "Import up to 500 rows from any CSV with name, value, unit, and timestamp columns.",
                color: "bg-sky-500/10 text-sky-500 border-sky-500/20",
              },
            ].map(({ icon: Icon, title, body, color }) => (
              <div
                key={title}
                className="group rounded-2xl border bg-card p-6 space-y-4 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 glass-card"
              >
                <div className={`inline-flex items-center justify-center rounded-xl border p-2.5 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="border-t bg-muted/10">
          <div className="container mx-auto px-6 max-w-6xl py-24">
            <div className="text-center mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                Loved by teams
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">What our users say</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  quote: "PulseBoard replaced three different tools for us. The real-time updates mean our whole team is always looking at the same data.",
                  name: "Sarah Chen",
                  role: "Head of Growth · Finloop",
                  avatar: "SC",
                  color: "bg-primary/10 text-primary",
                },
                {
                  quote: "I set up a public share link for our investors. They can check our KPIs any time without asking me for a report. Game changer.",
                  name: "Marcus Okonkwo",
                  role: "Founder · Tradepath",
                  avatar: "MO",
                  color: "bg-violet-500/10 text-violet-500",
                },
                {
                  quote: "The CSV import saved us hours. We pulled data from our warehouse, imported it, and had a live dashboard in under 10 minutes.",
                  name: "Priya Nair",
                  role: "Data Lead · Stackr",
                  avatar: "PN",
                  color: "bg-emerald-500/10 text-emerald-500",
                },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl border bg-card p-6 space-y-4 glass-card">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <div className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold ${t.color}`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="container mx-auto px-6 max-w-5xl py-24">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              Simple pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Start free, scale when ready</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No hidden fees. No per-seat gotchas. Upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for individuals and side projects.",
                features: [
                  "3 boards",
                  "500 metrics per board",
                  "CSV import",
                  "Public share links",
                  "Real-time updates",
                ],
                cta: "Get started",
                href: "/auth/signup",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$12",
                period: "per month",
                description: "For founders and small teams who need more.",
                features: [
                  "Unlimited boards",
                  "Unlimited metrics",
                  "CSV import",
                  "Public share links",
                  "Real-time updates",
                  "Priority support",
                  "Custom domains",
                ],
                cta: "Start Pro free",
                href: "/auth/signup",
                highlight: true,
              },
              {
                name: "Team",
                price: "$39",
                period: "per month",
                description: "For growing teams with advanced needs.",
                features: [
                  "Everything in Pro",
                  "Up to 10 members",
                  "Board-level permissions",
                  "Audit logs",
                  "SSO / SAML",
                  "SLA guarantee",
                  "Dedicated support",
                ],
                cta: "Contact sales",
                href: "/auth/signup",
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 space-y-5 glass-card flex flex-col ${
                  plan.highlight
                    ? "border-primary/40 dark:border-primary/30 teal-glow"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-4xl font-extrabold tabular-nums ${plan.highlight ? "text-primary" : "text-foreground"}`}>
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className={`h-4 w-4 flex-shrink-0 ${plan.highlight ? "text-primary" : "text-emerald-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full rounded-xl font-semibold ${plan.highlight ? "btn-glow" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="border-t">
          <div className="container mx-auto px-6 max-w-3xl py-24 text-center space-y-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
              <Activity className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to pulse?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join 2,400+ teams already using PulseBoard to track what matters.
              Free forever, no credit card required.
            </p>
            <Button size="lg" asChild className="btn-glow h-12 px-10 text-base rounded-xl font-semibold">
              <Link href="/auth/signup">
                Create your first board
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t bg-muted/10">
        <div className="container mx-auto px-6 max-w-7xl py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
                  <Activity className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold text-sm">PulseBoard</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
                Real-time analytics dashboards for teams that move fast.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Changelog", "Roadmap"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"],
              },
            ].map((col) => (
              <div key={col.title} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>© 2025 PulseBoard. All rights reserved.</span>
            <span>Built with Next.js · Supabase · Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

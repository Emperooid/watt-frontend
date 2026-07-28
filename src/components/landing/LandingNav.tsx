import Link from "next/link";
import { Bell, Zap } from "lucide-react";

const LINKS = [
  { label: "How It Works", href: "#calculator" },
  { label: "Energy Tips", href: "#energy-tips" },
  { label: "About", href: "#about" },
  { label: "Coming Soon (V2)", href: "#waitlist" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Zap className="h-4 w-4 text-white" fill="white" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">WattAmIUsing</p>
            <p className="hidden sm:block text-[11px] text-foreground/50">
              Know your power. Control your costs.
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-foreground/70">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#waitlist"
          className="flex items-center gap-1.5 rounded-full bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark whitespace-nowrap"
        >
          <Bell className="h-3.5 w-3.5" />
          Notify Me
        </a>
      </div>
    </header>
  );
}

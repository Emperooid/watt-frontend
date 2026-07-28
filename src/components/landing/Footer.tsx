import Link from "next/link";
import { AtSign, Globe, Mail, MessageCircle, Zap } from "lucide-react";
import { WaitlistForm } from "./WaitlistForm";

const QUICK_LINKS = [
  { label: "How It Works", href: "#calculator" },
  { label: "Energy Tips", href: "#energy-tips" },
  { label: "Coming Soon (V2)", href: "#waitlist" },
  { label: "About Us", href: "#about" },
  { label: "Home Planner", href: "/planner" },
];

const RESOURCE_LINKS = ["FAQs", "Glossary", "Tariff Information", "Contact Us"];

export function Footer() {
  return (
    <footer className="bg-sidebar-bg text-sidebar-fg">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </span>
              <p className="font-semibold text-white">WattAmIUsing</p>
            </div>
            <p className="mt-3 text-sm text-sidebar-fg-muted">
              A free tool for every Nigerian to understand and manage electricity consumption.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {[Globe, MessageCircle, AtSign, Mail].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-bg-hover text-sidebar-fg-muted"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-sidebar-fg-muted">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="hover:text-white">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Resources</p>
            <ul className="mt-3 space-y-2 text-sm text-sidebar-fg-muted">
              {RESOURCE_LINKS.map((label) => (
                <li key={label}>
                  <span className="cursor-not-allowed" title="Coming soon">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Be the first to know about Version 2</p>
            <div className="mt-3">
              <WaitlistForm compact />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-sidebar-bg-hover pt-6 text-xs text-sidebar-fg-muted">
          <p>© {new Date().getFullYear()} WattAmIUsing. All rights reserved.</p>
          <p>Built with 💚 for Nigeria</p>
        </div>
      </div>
    </footer>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, BarChart2, Rocket } from "lucide-react";

const nav = [
  { href: "/simulator", label: "Simulator", icon: BarChart2 },
  { href: "/wachstum",  label: "Growth",    icon: Rocket },
];

export function SiteHeader() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-primary" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-sm tracking-tight text-foreground">
            Dividend<span className="text-primary">Watch</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

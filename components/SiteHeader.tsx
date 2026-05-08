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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl">
      <div className="h-[3px] bg-primary" />
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-sans font-semibold text-sm tracking-tight text-foreground">
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
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

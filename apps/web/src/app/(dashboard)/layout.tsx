"use client";

import Link from "next/link";
import { Dice1, Bell } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-DEFAULT bg-mesh font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-surface-border mx-4 mt-4 rounded-xl max-w-7xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center">
              <Dice1 className="w-6 h-6 text-text-inverse" />
            </div>
            <span className="font-display text-heading-lg gradient-text">
              Ludo Nexus
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-text-secondary hover:text-text-primary transition-colors text-body-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/game-modes"
              className="text-text-secondary hover:text-text-primary transition-colors text-body-sm font-medium"
            >
              Play
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow/20 to-accent-magenta/20 flex items-center justify-center border border-surface-borderGlow">
              <span className="font-display text-heading-sm gradient-text">
                P1
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-body-sm text-text-muted">
          <p>© 2024 Ludo Nexus. Demo mode only. Play responsibly.</p>
        </div>
      </footer>
    </div>
  );
}

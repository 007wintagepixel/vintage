"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Wallet,
  Trophy,
  FileText,
  ArrowLeft,
  Dice1,
  Shield,
  Bell,
} from "lucide-react";

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Matches", href: "/admin/matches", icon: Gamepad2 },
  { label: "Transactions", href: "/admin/transactions", icon: Wallet },
  { label: "Tournaments", href: "/admin/tournaments", icon: Trophy },
  { label: "Audit Logs", href: "/admin/audit", icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background-DEFAULT bg-mesh font-sans">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass-panel-strong border-r border-surface-border z-50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-surface-border">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center">
              <Dice1 className="w-6 h-6 text-text-inverse" />
            </div>
            <div>
              <div className="font-display text-heading-sm gradient-text leading-none">
                Ludo Nexus
              </div>
              <div className="text-caption text-text-muted mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-accent-red" />
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {adminNavItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-glow/15 text-primary-glow border border-primary-glow/30 shadow-glow"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="admin-active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-glow"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to Site */}
        <div className="p-4 border-t border-surface-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass-panel border-b border-surface-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-heading-md gradient-text">
              Admin Panel
            </h1>
            <p className="text-caption text-text-muted mt-0.5">
              Platform management & oversight
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red rounded-full text-caption text-white flex items-center justify-center font-bold">
                5
              </span>
            </button>
            <div className="flex items-center gap-3 glass-panel px-3 py-2 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-red to-accent-magenta flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="text-body-sm font-medium text-text-primary leading-none">
                  Admin User
                </div>
                <div className="text-caption text-text-muted mt-1">
                  Super Admin
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

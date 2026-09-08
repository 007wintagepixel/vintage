"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Trophy,
  DollarSign,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Matches", href: "/matches", icon: Gamepad2 },
  { name: "Tournaments", href: "/tournaments", icon: Trophy },
  { name: "Transactions", href: "/transactions", icon: DollarSign },
  { name: "Audit Logs", href: "/audit", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Ludo Nexus
        </h1>
        <span className="text-xs text-gray-500 dark:text-gray-400">Admin</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
              }`}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              Admin User
            </p>
            <p className="text-xs truncate">admin@ludonexus.com</p>
          </div>
        </div>
        <button className="mt-3 flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700">
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

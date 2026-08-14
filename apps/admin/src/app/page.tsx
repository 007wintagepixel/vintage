"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Trophy,
  DollarSign,
  ShieldCheck,
  Activity,
  Settings,
  AlertTriangle,
  Wallet,
  Zap,
  Eye,
  Edit,
  Ban,
  Unlock,
  Loader2,
  RefreshCw,
  TrendingUp,
  Clock,
  CreditCard,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getDashboardStats,
  getUsers,
  getMatches,
  getTransactions,
  getPendingKYC,
  getFraudAlerts,
  getGameSettings,
  approveWithdrawal,
  rejectWithdrawal,
  reviewKYC,
  updateFraudAlert,
} from "@/lib/api";

export const dynamic = "force-dynamic";

const STAT_CARDS = [
  {
    title: "Total Users",
    value: "12,345",
    change: "+12%",
    icon: Users,
    color: "cyan",
    key: "totalUsers",
  },
  {
    title: "Active (24h)",
    value: "3,421",
    change: "+8%",
    icon: Activity,
    color: "green",
    key: "activeUsers24h",
  },
  {
    title: "Total Matches",
    value: "45,678",
    change: "+23%",
    icon: Gamepad2,
    color: "blue",
    key: "totalMatches",
  },
  {
    title: "Revenue (30d)",
    value: "$89,234",
    change: "+15%",
    icon: DollarSign,
    color: "amber",
    key: "revenue30d",
  },
];

const QUICK_ACTIONS = [
  {
    title: "Create Tournament",
    icon: Trophy,
    href: "/admin/tournaments/new",
    color: "purple",
  },
  {
    title: "Ban User",
    icon: Ban,
    href: "/admin/users?action=ban",
    color: "red",
  },
  {
    title: "Approve Withdrawal",
    icon: DollarSign,
    href: "/admin/withdrawals",
    color: "green",
  },
  { title: "Review KYC", icon: ShieldCheck, href: "/admin/kyc", color: "blue" },
  {
    title: "Game Settings",
    icon: Settings,
    href: "/admin/settings",
    color: "cyan",
  },
  {
    title: "View Audit Logs",
    icon: Activity,
    href: "/admin/audit",
    color: "amber",
  },
];

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const colorMap = {
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
  };
  const c = colorMap[color as keyof typeof colorMap] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("glass rounded-2xl p-6", c.border)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={cn("p-3 rounded-xl", c.bg)}>
          <Icon className={cn("w-6 h-6", c.text)} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-green-400 text-sm font-medium">{change}</span>
        <span className="text-slate-500 text-sm">vs last period</span>
      </div>
    </motion.div>
  );
}

function QuickActionCard({
  title,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}) {
  const colorMap = {
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      hover: "hover:bg-purple-500/20",
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      hover: "hover:bg-red-500/20",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      hover: "hover:bg-green-500/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      hover: "hover:bg-blue-500/20",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      hover: "hover:bg-cyan-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      hover: "hover:bg-amber-500/20",
    },
  };
  const c = colorMap[color as keyof typeof colorMap] || colorMap.cyan;

  return (
    <Link
      href={href}
      className={cn(
        "glass rounded-xl p-5 text-center transition-all duration-300 group",
        c.bg,
        c.hover,
        "border-slate-700/50 hover:border-cyan-500/50",
      )}
    >
      <div
        className={cn(
          "w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform",
          c.bg,
        )}
      >
        <Icon className={cn("w-6 h-6", c.text)} />
      </div>
      <p className="font-semibold text-white">{title}</p>
    </Link>
  );
}

function DataTable({
  columns,
  data,
  keyField,
  actions,
  emptyMessage = "No data available",
  loading = false,
}: {
  columns: {
    key: string;
    header: string;
    render?: (row: any) => React.ReactNode;
  }[];
  data: any[];
  keyField: string;
  actions?: (row: any) => React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
        <p className="text-slate-400 mt-4">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {data.map((row) => (
              <tr
                key={row[keyField]}
                className="hover:bg-slate-800/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-slate-300"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right">{actions(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  _type = "default",
}: {
  status: string;
  _type?: "default" | "user" | "match" | "withdrawal" | "kyc" | "fraud";
}) {
  const configs: Record<
    string,
    {
      bg: string;
      text: string;
      icon?: React.ComponentType<{ className?: string }>;
    }
  > = {
    active: { bg: "bg-green-500/10", text: "text-green-400", icon: CheckCircle },
    inactive: { bg: "bg-slate-500/10", text: "text-slate-400", icon: Clock },
    banned: { bg: "bg-red-500/10", text: "text-red-400", icon: Ban },
    pending: { bg: "bg-amber-500/10", text: "text-amber-400", icon: Clock },
    verified: { bg: "bg-green-500/10", text: "text-green-400", icon: Shield },
    rejected: { bg: "bg-red-500/10", text: "text-red-400", icon: XCircle },
    not_started: { bg: "bg-slate-500/10", text: "text-slate-400", icon: Clock },
    under_review: { bg: "bg-blue-500/10", text: "text-blue-400", icon: AlertCircle },
    additional_info: { bg: "bg-purple-500/10", text: "text-purple-400", icon: AlertTriangle },
    completed: { bg: "bg-green-500/10", text: "text-green-400", icon: CheckCircle },
    in_progress: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Gamepad2 },
    cancelled: { bg: "bg-red-500/10", text: "text-red-400", icon: XCircle },
    open: { bg: "bg-red-500/10", text: "text-red-400", icon: AlertTriangle },
    investigating: { bg: "bg-amber-500/10", text: "text-amber-400", icon: AlertCircle },
    resolved: { bg: "bg-green-500/10", text: "text-green-400", icon: CheckCircle },
    low: { bg: "bg-green-500/10", text: "text-green-400" },
    medium: { bg: "bg-amber-500/10", text: "text-amber-400" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400", icon: AlertTriangle },
    critical: { bg: "bg-red-500/10", text: "text-red-400", icon: AlertCircle },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon || Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [pendingKYC, setPendingKYC] = useState<any[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        dashboardStats,
        usersRes,
        matchesRes,
        transactionsRes,
        kycRes,
        fraudRes,
      ] = await Promise.all([
        getDashboardStats(),
        getUsers({ page: 1, limit: 5 }),
        getMatches({ page: 1, limit: 5 }),
        getTransactions({ page: 1, limit: 5 }),
        getPendingKYC(1, 5),
        getFraudAlerts({ page: 1, limit: 5 }),
      ]);

      setStats(dashboardStats);
      setRecentUsers(usersRes.data || []);
      setRecentMatches(matchesRes.data || []);
      setPendingWithdrawals(transactionsRes.data || []);
      setPendingKYC(kycRes.data || []);
      setFraudAlerts(fraudRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 glass-strong border-r border-slate-700/50 hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700/50">
            <h1 className="text-xl font-bold text-gradient">Ludo Nexus</h1>
            <p className="text-slate-500 text-sm mt-1">Admin Panel</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-cyan-500/10 border border-cyan-500/20 transition-all"
            >
              <LayoutDashboard className="w-5 h-5 text-cyan-400" />
              <span className="font-medium text-white">Dashboard</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <Users className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">Users</span>
            </Link>

            <Link
              href="/admin/matches"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <Gamepad2 className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">Matches</span>
            </Link>

            <Link
              href="/admin/tournaments"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <Trophy className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">Tournaments</span>
            </Link>

            <Link
              href="/admin/transactions"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <DollarSign className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">Transactions</span>
            </Link>

            <Link
              href="/admin/withdrawals"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <Wallet className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">Withdrawals</span>
            </Link>

            <Link
              href="/admin/kyc"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">KYC Review</span>
            </Link>

            <Link
              href="/admin/fraud"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <AlertTriangle className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">Fraud Alerts</span>
            </Link>

            <Link
              href="/admin/audit"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <Activity className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">Audit Logs</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-slate-700/50 transition-all"
            >
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-300">Settings</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-700/50">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-slate-500 text-sm">Demo Mode</p>
              <p className="text-cyan-400 text-xs mt-1">All data is simulated</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Platform overview and quick actions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Refresh data"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </button>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-red-500/20 bg-red-500/5 rounded-xl p-4 mb-8 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
            <button
              onClick={fetchData}
              disabled={loading}
              className="ml-auto btn-ghost p-2 rounded-lg text-xs"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats ? (
            Object.entries(stats).map(([key, value]) => {
              const cardConfig = STAT_CARDS.find((c) => c.key === key);
              if (!cardConfig) return null;
              return (
                <StatCard
                  key={key}
                  title={cardConfig.title}
                  value={typeof value === "number" ? formatNumber(value) : String(value)}
                  change={cardConfig.change}
                  icon={cardConfig.icon}
                  color={cardConfig.color}
                />
              );
            })
          ) : (
            STAT_CARDS.map((card) => (
              <StatCard
                key={card.key}
                title={card.title}
                value={card.value}
                change={card.change}
                icon={card.icon}
                color={card.color}
              />
            ))
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {QUICK_ACTIONS.map((action) => (
            <QuickActionCard
              key={action.title}
              title={action.title}
              icon={action.icon}
              href={action.href}
              color={action.color}
            />
          ))}
        </motion.div>

        {/* Data Sections */}
        <div className="space-y-8">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl"
          >
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Recent Users</h2>
              </div>
              <Link
                href="/admin/users"
                className="btn-ghost text-sm gap-1"
              >
                View All
                <Zap className="w-4 h-4" />
              </Link>
            </div>
            <DataTable
              columns={[
                {
                  key: "username",
                  header: "User",
                  render: (row) => (
                    <div>
                      <div className="font-medium text-white flex items-center gap-2">
                        {row.username}
                        <StatusBadge status={row.status || "active"} />
                      </div>
                      <div className="text-body-sm text-slate-400">{row.email}</div>
                    </div>
                  ),
                },
                {
                  key: "level",
                  header: "Level",
                },
                {
                  key: "kycStatus",
                  header: "KYC",
                  render: (row) => <StatusBadge status={row.kycStatus || "not_started"} />,
                },
                {
                  key: "totalMatches",
                  header: "Matches",
                  render: (row) => row._count?.matches ?? row.totalMatches ?? 0,
                },
                {
                  key: "lastLoginAt",
                  header: "Last Login",
                  render: (row) => row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleDateString() : "Never",
                },
              ]}
              data={recentUsers}
              keyField="id"
              loading={loading}
              actions={(row) => (
                <Link
                  href={`/admin/users/${row.id}`}
                  className="btn-ghost p-2 rounded-xl"
                  aria-label="View user"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              )}
            />
          </motion.div>

          {/* Recent Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl"
          >
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Gamepad2 className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Recent Matches</h2>
              </div>
              <Link
                href="/admin/matches"
                className="btn-ghost text-sm gap-1"
              >
                View All
                <Zap className="w-4 h-4" />
              </Link>
            </div>
            <DataTable
              columns={[
                {
                  key: "id",
                  header: "Match ID",
                  render: (row) => <code className="text-cyan-300">{row.id.slice(0, 8)}...</code>,
                },
                {
                  key: "mode",
                  header: "Mode",
                  render: (row) => <StatusBadge status={row.mode || "vs_human"} />,
                },
                {
                  key: "players",
                  header: "Players",
                  render: (row) => row.players?.length ?? row._count?.players ?? 0,
                },
                {
                  key: "entryFee",
                  header: "Entry Fee",
                  render: (row) => formatCurrency(Number(row.entryFee) || 0),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status || "completed"} />,
                },
                {
                  key: "createdAt",
                  header: "Time",
                  render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
                },
              ]}
              data={recentMatches}
              keyField="id"
              loading={loading}
              actions={(row) => (
                <Link
                  href={`/admin/matches/${row.id}/replay`}
                  className="btn-ghost p-2 rounded-xl"
                  aria-label="View replay"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              )}
            />
          </motion.div>

          {/* Pending Withdrawals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl"
          >
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <Wallet className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Pending Withdrawals</h2>
              </div>
              <Link
                href="/admin/withdrawals"
                className="btn-ghost text-sm gap-1"
              >
                View All
                <Zap className="w-4 h-4" />
              </Link>
            </div>
            <DataTable
              columns={[
                {
                  key: "user",
                  header: "User",
                  render: (row) => (
                    <div>
                      <div className="font-medium text-white">{row.user?.username || row.username}</div>
                      <div className="text-body-sm text-slate-400">{row.user?.email || row.email}</div>
                    </div>
                  ),
                },
                {
                  key: "amount",
                  header: "Amount",
                  render: (row) => (
                    <span className="font-medium text-amber-300">
                      {formatCurrency(Number(row.amount) || 0)}
                    </span>
                  ),
                },
                {
                  key: "method",
                  header: "Method",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status || "pending"} />,
                },
                {
                  key: "createdAt",
                  header: "Requested",
                  render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
                },
              ]}
              data={pendingWithdrawals}
              keyField="id"
              loading={loading}
              actions={(row) => (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => approveWithdrawal(row.id)}
                    className="btn-ghost p-2 rounded-xl text-green-400 hover:bg-green-500/10"
                    aria-label="Approve"
                    title="Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => rejectWithdrawal(row.id, "Admin rejection")}
                    className="btn-ghost p-2 rounded-xl text-red-400 hover:bg-red-500/10"
                    aria-label="Reject"
                    title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            />
          </motion.div>

          {/* Pending KYC */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl"
          >
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Pending KYC Reviews</h2>
              </div>
              <Link
                href="/admin/kyc"
                className="btn-ghost text-sm gap-1"
              >
                View All
                <Zap className="w-4 h-4" />
              </Link>
            </div>
            <DataTable
              columns={[
                {
                  key: "user",
                  header: "User",
                  render: (row) => (
                    <div>
                      <div className="font-medium text-white">{row.user?.username || row.username}</div>
                      <div className="text-body-sm text-slate-400">{row.user?.email || row.email}</div>
                    </div>
                  ),
                },
                {
                  key: "documents",
                  header: "Documents",
                  render: (row) => row.documents?.length || row.documentCount || 0,
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status || "under_review"} />,
                },
                {
                  key: "createdAt",
                  header: "Submitted",
                  render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
                },
              ]}
              data={pendingKYC}
              keyField="id"
              loading={loading}
              actions={(row) => (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => reviewKYC(row.id, "approve")}
                    className="btn-ghost p-2 rounded-xl text-green-400 hover:bg-green-500/10"
                    aria-label="Approve"
                    title="Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => reviewKYC(row.id, "reject")}
                    className="btn-ghost p-2 rounded-xl text-red-400 hover:bg-red-500/10"
                    aria-label="Reject"
                    title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            />
          </motion.div>

          {/* Fraud Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl"
          >
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Fraud Alerts</h2>
              </div>
              <Link
                href="/admin/fraud"
                className="btn-ghost text-sm gap-1"
              >
                View All
                <Zap className="w-4 h-4" />
              </Link>
            </div>
            <DataTable
              columns={[
                {
                  key: "user",
                  header: "User",
                  render: (row) => (
                    <div>
                      <div className="font-medium text-white">{row.user?.username || row.username}</div>
                      <div className="text-body-sm text-slate-400">{row.user?.email || row.email}</div>
                    </div>
                  ),
                },
                {
                  key: "type",
                  header: "Type",
                  render: (row) => (
                    <span className="text-body-sm capitalize">{row.type?.replace("_", " ") || "-"}</span>
                  ),
                },
                {
                  key: "severity",
                  header: "Severity",
                  render: (row) => <StatusBadge status={row.severity || "low"} />,
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status || "open"} />,
                },
                {
                  key: "createdAt",
                  header: "Detected",
                  render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
                },
              ]}
              data={fraudAlerts}
              keyField="id"
              loading={loading}
              actions={(row) => (
                <button
                  onClick={() => updateFraudAlert(row.id, { status: "investigating" })}
                  className="btn-ghost p-2 rounded-xl text-blue-400 hover:bg-blue-500/10"
                  aria-label="Investigate"
                  title="Investigate"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
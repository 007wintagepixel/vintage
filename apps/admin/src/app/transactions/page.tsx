"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Gamepad2,
  Play,
  Flag,
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Download,
  Clock,
  Users,
  Calendar,
  CreditCard,
  Receipt,
  CheckCircle,
  XCircle,
  AlertTriangle as AlertTriangleIcon,
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
  Loader2 as Loader2Icon,
  RefreshCw as RefreshCwIcon,
  Download as DownloadIcon,
  Clock,
  Eye,
  Download as DownloadAlias,
  ArrowDown,
  ArrowUp,
  Gamepad2 as Gamepad2Icon,
  Trophy as TrophyIcon,
  Gift,
  RotateCcw,
  ArrowLeftRight,
  HelpCircle,
  RotateCcw as RotateCcwIcon,
  Clock as ClockIcon,
  CheckCircle,
  XCircle,
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  Gift,
  Loader2 as Loader2Alias,
  RefreshCw as RefreshCwAlias,
  Download as DownloadAlias,
  AlertTriangle as AlertTriangleAlias,
  Clock as ClockAlias,
} from "lucide-react";

export const dynamic = "force-dynamic";

const TRANSACTION_TYPES = [
  { value: "", label: "All Types" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "match", label: "Match" },
  { value: "tournament", label: "Tournament" },
  { value: "bonus", label: "Bonus" },
  { value: "refund", label: "Refund" },
  { value: "transfer", label: "Transfer" },
];

const TRANSACTION_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "reversed", label: "Reversed" },
];

const MOCK_TRANSACTIONS = [
  {
    id: "txn_001",
    userId: "user_1",
    username: "cyber_gamer_99",
    type: "match",
    status: "completed",
    amount: 1000,
    fee: 100,
    netAmount: 900,
    balanceType: "available",
    paymentMethod: "demo",
    paymentReference: "match_abc123",
    description: "Match win - Quick Match",
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "txn_002",
    userId: "user_2",
    username: "dice_master",
    type: "withdrawal",
    status: "pending",
    amount: 5000,
    fee: 250,
    netAmount: 4750,
    balanceType: "available",
    paymentMethod: "upi",
    paymentReference: "upi_abc123",
    description: "Withdrawal to UPI",
    createdAt: "2024-01-15T12:15:00Z",
  },
  {
    id: "txn_003",
    userId: "user_3",
    username: "ludo_king_2024",
    type: "tournament",
    status: "completed",
    amount: 10000,
    fee: 500,
    netAmount: 9500,
    balanceType: "available",
    paymentMethod: "demo",
    paymentReference: "tourney_xyz789",
    description: "Tournament prize - 1st place",
    createdAt: "2024-01-14T18:45:00Z",
  },
  {
    id: "txn_004",
    userId: "user_4",
    username: "token_tactician",
    type: "deposit",
    status: "completed",
    amount: 2000,
    fee: 0,
    netAmount: 2000,
    balanceType: "available",
    paymentMethod: "card",
    paymentReference: "card_xyz789",
    description: "Demo coins purchase",
    createdAt: "2024-01-14T10:20:00Z",
  },
  {
    id: "txn_005",
    userId: "user_5",
    username: "board_boss",
    type: "match",
    status: "failed",
    amount: 500,
    fee: 50,
    netAmount: -550,
    balanceType: "available",
    paymentMethod: "demo",
    paymentReference: "match_xyz123",
    description: "Match loss - Quick Match",
    createdAt: "2024-01-13T22:10:00Z",
  },
];

function TransactionTypeBadge({ type }: { type: string }) {
  const configs: Record<string, { bg: string; text: string; icon: any }> = {
    deposit: { bg: "bg-green-500/10", text: "text-green-400", icon: ArrowDown },
    withdrawal: { bg: "bg-blue-500/10", text: "text-blue-400", icon: ArrowUp },
    match: { bg: "bg-purple-500/10", text: "text-purple-400", icon: Gamepad2Icon },
    tournament: { bg: "bg-amber-500/10", text: "text-amber-400", icon: TrophyIcon },
    bonus: { bg: "bg-green-500/10", text: "text-green-400", icon: Gift },
    refund: { bg: "bg-blue-500/10", text: "text-blue-400", icon: RotateCcwIcon },
    transfer: { bg: "bg-cyan-500/10", text: "text-cyan-400", icon: ArrowLeftRight },
  };

  const config = configs[type] || { bg: "bg-slate-500/10", text: "text-slate-400", icon: HelpCircle };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon?: any }> = {
    pending: { bg: "bg-amber-500/10", text: "text-amber-400", icon: ClockIcon },
    processing: { bg: "bg-blue-500/10", text: "text-blue-400", icon: Loader2Icon },
    completed: { bg: "bg-green-500/10", text: "text-green-400", icon: CheckCircle },
    failed: { bg: "bg-red-500/10", text: "text-red-400", icon: XCircle },
    cancelled: { bg: "bg-red-500/10", text: "text-red-400", icon: XCircle },
    reversed: { bg: "bg-purple-500/10", text: "text-purple-400", icon: RotateCcwIcon },
    open: { bg: "bg-red-500/10", text: "text-red-400", icon: AlertTriangleIcon },
    investigating: { bg: "bg-amber-500/10", text: "text-amber-400", icon: AlertTriangleIcon },
    resolved: { bg: "bg-green-500/10", text: "text-green-400", icon: CheckCircle },
    low: { bg: "bg-green-500/10", text: "text-green-400" },
    medium: { bg: "bg-amber-500/10", text: "text-amber-400" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400" },
    critical: { bg: "bg-red-500/10", text: "text-red-400" },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon ? <Icon className="w-3 h-3" /> : null}
      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </span>
  );
}

function DataTable({ columns, data, keyField, actions, emptyMessage = "No data available", loading = false }: {
  columns: { key: string; header: string; render?: (row: any) => React.ReactNode }[];
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
                <th key={col.key} className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
              <tr key={row[keyField]} className="hover:bg-slate-800/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-slate-300">
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function PaymentMethodBadge({ method }: { method?: string }) {
  if (!method) return <span className="text-slate-400 text-sm">-</span>;

  const configs: Record<string, { bg: string; text: string }> = {
    upi: { bg: "bg-blue-500/10", text: "text-blue-400" },
    card: { bg: "bg-purple-500/10", text: "text-purple-400" },
    netbanking: { bg: "bg-green-500/10", text: "text-green-400" },
    wallet: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
    demo: { bg: "bg-amber-500/10", text: "text-amber-400" },
    internal: { bg: "bg-slate-500/10", text: "text-slate-400" },
  };

  const config = configs[method] || { bg: "bg-slate-500/10", text: "text-slate-400" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {method.toUpperCase()}
    </span>
  );
}

const transactionActions = (row: any) => (
  <div className="flex items-center justify-end gap-2">
    <Link
      href={`/admin/transactions/${row.id}`}
      className="btn-ghost p-2 rounded-xl"
      aria-label="View transaction"
    >
      <Eye className="w-4 h-4" />
    </Link>
  </div>
);

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("");
  const transactionsPerPage = 10;
  const [loading, setLoading] = useState(false);

  const filteredTransactions = MOCK_TRANSACTIONS
    .filter((txn) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          txn.id.toLowerCase().includes(query) ||
          txn.username.toLowerCase().includes(query) ||
          txn.paymentReference?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((txn) => {
      if (typeFilter === "all") return true;
      return txn.type === typeFilter;
    })
    .filter((txn) => {
      if (statusFilter === "all") return true;
      return txn.status === statusFilter;
    })
    .filter((txn) => {
      if (!dateRange) return true;
      const txnDate = new Date(txn.createdAt);
      const now = new Date();
      let startDate = new Date();
      if (dateRange === "today") {
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === "week") {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === "month") {
        startDate.setDate(now.getDate() - 30);
      } else {
        return true;
      }
      return txnDate >= startDate;
    });

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * transactionsPerPage,
    page * transactionsPerPage
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">Transactions</h1>
          <p className="text-text-secondary mt-1">
            Monitor and manage all platform transactions
          </p>
        </div>
        <Link href="/admin/transactions/export" className="btn-primary gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-strong p-4 rounded-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-auto min-w-[150px]"
            >
              {TRANSACTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-auto min-w-[150px]"
            >
              {TRANSACTION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input w-auto min-w-[150px]"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          columns={[
            {
              key: "id",
              header: "ID",
              render: (row) => <code className="text-cyan-300 text-sm">{row.id.slice(0, 8)}...</code>,
            },
            {
              key: "username",
              header: "User",
              render: (row) => (
                <div>
                  <div className="font-medium text-white">{row.username}</div>
                  <div className="text-body-sm text-text-secondary">{row.userId.slice(0, 8)}...</div>
                </div>
              ),
            },
            {
              key: "type",
              header: "Type",
              render: (row) => <TransactionTypeBadge type={row.type} />,
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: "amount",
              header: "Amount",
              render: (row) => (
                <span className="font-mono font-medium">{formatCurrency(Number(row.amount))}</span>
              ),
            },
            {
              key: "fee",
              header: "Fee",
              render: (row) => (
                <span className="text-text-secondary font-mono">{formatCurrency(Number(row.fee))}</span>
              ),
            },
            {
              key: "netAmount",
              header: "Net Amount",
              render: (row) => (
                <span className={`font-mono font-medium ${row.netAmount >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                  {row.netAmount >= 0 ? "+" : ""}{formatCurrency(Number(row.netAmount))}
                </span>
              ),
            },
            {
              key: "method",
              header: "Method",
              render: (row) => <PaymentMethodBadge method={row.paymentMethod} />,
            },
            {
              key: "createdAt",
              header: "Date",
              render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
            },
          ]}
          data={paginatedTransactions}
          keyField="id"
          loading={loading}
          actions={transactionActions}
        />
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-ghost p-2 rounded-xl disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            const isActive = page === pageNum;
            const className = `w-10 h-10 rounded-xl font-medium transition-all ${isActive ? "bg-primary-glow/20 text-primary-glow border border-primary-glow/30" : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"}`;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={className}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-ghost p-2 rounded-xl disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
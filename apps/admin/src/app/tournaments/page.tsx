"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Plus,
  Calendar,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar as CalendarIcon,
  RefreshCw as RefreshCwIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Shield as ShieldIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  Clock as ClockIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

const TOURNAMENT_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "registration_open", label: "Registration Open" },
  { value: "registration_closed", label: "Registration Closed" },
  { value: "check_in", label: "Check-in" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const TOURNAMENT_MODES = [
  { value: "", label: "All Modes" },
  { value: "vs_ai", label: "vs AI" },
  { value: "vs_human", label: "vs Human" },
  { value: "tournament", label: "Tournament" },
  { value: "group", label: "Group" },
  { value: "team", label: "Team" },
];

const MOCK_TOURNAMENTS = [
  {
    id: "t1",
    name: "Ludo Nexus Championship 2024",
    description: "Annual championship tournament with massive prize pool",
    mode: "tournament",
    maxParticipants: 64,
    entryFee: 500,
    prizeBreakdown: [
      { position: 1, percentage: 50 },
      { position: 2, percentage: 30 },
      { position: 3, percentage: 20 },
    ],
    rules: {},
    status: "registration_open",
    registrationOpensAt: "2024-01-01T00:00:00Z",
    registrationClosesAt: "2024-01-20T23:59:59Z",
    checkInStartsAt: "2024-01-21T10:00:00Z",
    checkInEndsAt: "2024-01-21T13:00:00Z",
    startedAt: null,
    completedAt: null,
    createdById: "admin_1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
    _count: { registrations: 45, matches: 0 },
  },
  {
    id: "t2",
    name: "Weekend Warriors Cup",
    description: "Weekly tournament for casual players",
    mode: "tournament",
    maxParticipants: 32,
    entryFee: 100,
    prizeBreakdown: [
      { position: 1, percentage: 60 },
      { position: 2, percentage: 30 },
      { position: 3, percentage: 20 },
    ],
    rules: {},
    status: "in_progress",
    registrationOpensAt: "2024-01-10T00:00:00Z",
    registrationClosesAt: "2024-01-19T23:59:59Z",
    checkInStartsAt: "2024-01-20T10:00:00Z",
    checkInEndsAt: "2024-01-20T12:00:00Z",
    startedAt: "2024-01-20T14:00:00Z",
    completedAt: null,
    createdById: "admin_1",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
    _count: { registrations: 32, matches: 16 },
  },
  {
    id: "t3",
    name: "New Year Ludo Bash",
    description: "Special new year tournament with big prizes",
    mode: "tournament",
    maxParticipants: 128,
    entryFee: 200,
    prizeBreakdown: [
      { position: 1, percentage: 40 },
      { position: 2, percentage: 25 },
      { position: 3, percentage: 15 },
      { position: 4, percentage: 10 },
      { position: 5, percentage: 5 },
      { position: 6, percentage: 5 },
    ],
    rules: {},
    status: "completed",
    registrationOpensAt: "2023-12-20T00:00:00Z",
    registrationClosesAt: "2024-01-01T12:00:00Z",
    checkInStartsAt: "2024-01-02T10:00:00Z",
    checkInEndsAt: "2024-01-02T14:00:00Z",
    startedAt: "2024-01-02T15:00:00Z",
    completedAt: "2024-01-05T20:30:00Z",
    createdById: "admin_1",
    createdAt: "2023-12-20T00:00:00Z",
    updatedAt: "2024-01-05T20:30:00Z",
    _count: { registrations: 98, matches: 127 },
  },
  {
    id: "t4",
    name: "Team Battle Championship",
    description: "2v2 Team tournament",
    mode: "team",
    maxParticipants: 16,
    entryFee: 200,
    prizeBreakdown: [
      { position: 1, percentage: 70 },
      { position: 2, percentage: 30 },
    ],
    rules: {},
    status: "draft",
    registrationOpensAt: "2024-02-01T00:00:00Z",
    registrationClosesAt: "2024-02-15T23:59:59Z",
    checkInStartsAt: "2024-02-16T10:00:00Z",
    checkInEndsAt: "2024-02-16T13:00:00Z",
    startedAt: null,
    completedAt: null,
    createdById: "admin_1",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    _count: { registrations: 0, matches: 0 },
  },
];

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon?: any }> = {
    draft: { bg: "bg-slate-500/10", text: "text-slate-400" },
    published: { bg: "bg-blue-500/10", text: "text-blue-400" },
    registration_open: { bg: "bg-green-500/10", text: "text-green-400" },
    registration_closed: { bg: "bg-amber-500/10", text: "text-amber-400" },
    check_in: { bg: "bg-blue-500/10", text: "text-blue-400" },
    in_progress: { bg: "bg-purple-500/10", text: "text-purple-400" },
    completed: { bg: "bg-green-500/10", text: "text-green-400" },
    cancelled: { bg: "bg-red-500/10", text: "text-red-400" },
  };

  const config = configs[status] || configs.draft;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}
    </span>
  );
}

function ModeBadge({ mode }: { mode: string }) {
  const configs: Record<string, { bg: string; text: string; icon: any }> = {
    tournament: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "Trophy" },
    group: { bg: "bg-blue-500/10", text: "text-blue-400", icon: "Users" },
    team: { bg: "bg-purple-500/10", text: "text-purple-400", icon: "Users" },
    vs_ai: { bg: "bg-green-500/10", text: "text-green-400", icon: "Bot" },
    vs_human: { bg: "bg-blue-500/10", text: "text-blue-400", icon: "Users" },
    private: { bg: "bg-purple-500/10", text: "text-purple-400", icon: "Lock" },
  };

  const config = configs[mode] || { bg: "bg-slate-500/10", text: "text-slate-400", icon: "HelpCircle" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className="w-3 h-3 bg-current rounded-full" />
      {mode.charAt(0).toUpperCase() + mode.slice(1).replace("_", " ")}
    </span>
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
        <div className="w-8 h-8 animate-spin mx-auto text-cyan-400 border-4 border-cyan-400/30 rounded-full border-t-transparent animate-spin" />
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

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon?: any }> = {
    draft: { bg: "bg-slate-500/10", text: "text-slate-400" },
    published: { bg: "bg-blue-500/10", text: "text-blue-400" },
    registration_open: { bg: "bg-green-500/10", text: "text-green-400" },
    registration_closed: { bg: "bg-amber-500/10", text: "text-amber-400" },
    check_in: { bg: "bg-blue-500/10", text: "text-blue-400" },
    in_progress: { bg: "bg-purple-500/10", text: "text-purple-400" },
    completed: { bg: "bg-green-500/10", text: "text-green-400" },
    cancelled: { bg: "bg-red-500/10", text: "text-red-400" },
  };

  const config = configs[status] || configs.draft;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}
    </span>
  );
}

function ModeBadge({ mode }: { mode: string }) {
  const configs: Record<string, { bg: string; text: string; icon: any }> = {
    tournament: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "Trophy" },
    group: { bg: "bg-blue-500/10", text: "text-blue-400", icon: "Users" },
    team: { bg: "bg-purple-500/10", text: "text-purple-400", icon: "Users" },
    vs_ai: { bg: "bg-green-500/10", text: "text-green-400", icon: "Bot" },
    vs_human: { bg: "bg-blue-500/10", text: "text-blue-400", icon: "Users" },
    private: { bg: "bg-purple-500/10", text: "text-purple-400", icon: "Lock" },
  };

  const config = configs[mode] || { bg: "bg-slate-500/10", text: "text-slate-400", icon: "HelpCircle" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className="w-3 h-3 bg-current rounded-full" />
      {mode.charAt(0).toUpperCase() + mode.slice(1).replace("_", " ")}
    </span>
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

const tournamentActions = (row: any) => (
  <div className="flex items-center justify-end gap-2">
    <Link
      href={`/admin/tournaments/${row.id}`}
      className="btn-ghost p-2 rounded-xl"
      aria-label="View tournament"
    >
      <Eye className="w-4 h-4" />
    </Link>
    <Link
      href={`/admin/tournaments/${row.id}/edit`}
      className="btn-ghost p-2 rounded-xl"
      aria-label="Edit tournament"
    >
      <Edit className="w-4 h-4" />
    </Link>
    {row.status === "registration_open" && (
      <button
        className="btn-ghost p-2 rounded-xl text-accent-gold hover:bg-amber-500/10"
        aria-label="Publish tournament"
        title="Publish tournament"
      >
        <Trophy className="w-4 h-4" />
      </button>
    )}
    {row.status === "registration_open" && (
      <button
        className="btn-ghost p-2 rounded-xl text-accent-red hover:bg-red-500/10"
        aria-label="Cancel tournament"
        title="Cancel tournament"
      >
        <XCircle className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default function AdminTournamentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const filteredTournaments = MOCK_TOURNAMENTS
    .filter((t) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((t) => {
      if (statusFilter === "all") return true;
      return t.status === statusFilter;
    })
    .filter((t) => {
      if (modeFilter === "all") return true;
      return t.mode === modeFilter;
    });

  const paginatedTournaments = filteredTournaments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredTournaments.length / pageSize);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">Tournaments</h1>
          <p className="text-text-secondary mt-1">Manage tournaments, brackets, and prize pools</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/tournaments/new" className="btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Create Tournament
          </Link>
        </div>
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
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-auto min-w-[180px]"
            >
              <option value="">All Statuses</option>
              {["draft", "published", "registration_open", "registration_closed", "check_in", "in_progress", "completed", "cancelled"].map((s) => (
                <option key={s} value={s}>{s.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</option>
              ))}
            </select>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="input w-auto min-w-[150px]"
            >
              <option value="">All Modes</option>
              {["tournament", "group", "team", "vs_ai", "vs_human", "private"].map((m) => (
                <option key={m} value={m}>{m.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tournaments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          columns={[
            {
              key: "name",
              header: "Tournament",
              render: (row) => (
                <div>
                  <div className="font-medium text-white">{row.name}</div>
                  <div className="text-body-sm text-text-secondary">{row.description}</div>
                </div>
              ),
            },
            {
              key: "mode",
              header: "Mode",
              render: (row) => <ModeBadge mode={row.mode} />,
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: "entryFee",
              header: "Entry Fee",
              render: (row) => formatCurrency(Number(row.entryFee)),
            },
            {
              key: "maxParticipants",
              header: "Max Players",
              render: (row) => `${row._count?.registrations || 0} / ${row.maxParticipants}`,
            },
            {
              key: "registrationOpensAt",
              header: "Reg. Opens",
              render: (row) => row.registrationOpensAt ? new Date(row.registrationOpensAt).toLocaleDateString() : "-",
            },
            {
              key: "registrationClosesAt",
              header: "Reg. Closes",
              render: (row) => row.registrationClosesAt ? new Date(row.registrationClosesAt).toLocaleDateString() : "-",
            },
          ]}
          data={paginatedTournaments}
          keyField="id"
          loading={loading}
          actions={tournamentActions}
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
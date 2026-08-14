"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Download,
  Eye,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Users,
  Download as DownloadIcon,
  Eye as EyeIcon,
  Shield as ShieldIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  Clock as ClockIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

const AUDIT_ACTIONS = [
  { value: "", label: "All Actions" },
  { value: "user.created", label: "User Created" },
  { value: "user.updated", label: "User Updated" },
  { value: "user.banned", label: "User Banned" },
  { value: "user.unbanned", label: "User Unbanned" },
  { value: "match.created", label: "Match Created" },
  { value: "match.completed", label: "Match Completed" },
  { value: "tournament.created", label: "Tournament Created" },
  { value: "tournament.published", label: "Tournament Published" },
  { value: "tournament.cancelled", label: "Tournament Cancelled" },
  { value: "withdrawal.requested", label: "Withdrawal Requested" },
  { value: "withdrawal.approved", label: "Withdrawal Approved" },
  { value: "withdrawal.rejected", label: "Withdrawal Rejected" },
  { value: "kyc.submitted", label: "KYC Submitted" },
  { value: "kyc.approved", label: "KYC Approved" },
  { value: "kyc.rejected", label: "KYC Rejected" },
  { value: "fraud.alert", label: "Fraud Alert" },
  { value: "settings.updated", label: "Settings Updated" },
  { value: "admin.login", label: "Admin Login" },
];

const SEVERITIES = [
  { value: "", label: "All Severities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const MOCK_AUDIT_LOGS = [
  {
    id: "audit_001",
    adminId: "admin_1",
    adminUsername: "admin",
    action: "user.banned",
    resourceType: "user",
    resourceId: "user_123",
    details: { reason: "Toxic behavior", bannedBy: "admin" },
    severity: "high",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "audit_002",
    adminId: "admin_2",
    adminUsername: "moderator",
    action: "withdrawal.approved",
    resourceType: "withdrawal",
    resourceId: "withdrawal_123",
    details: { amount: 5000, method: "upi" },
    severity: "medium",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-15T12:15:00Z",
  },
  {
    id: "audit_003",
    adminId: "admin_1",
    adminUsername: "admin",
    action: "tournament.published",
    resourceType: "tournament",
    resourceId: "t1",
    details: { name: "Ludo Nexus Championship 2024" },
    severity: "low",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "audit_004",
    adminId: "admin_3",
    adminUsername: "superadmin",
    action: "settings.updated",
    resourceType: "settings",
    resourceId: "game_config",
    details: { changedFields: ["turnTimeSeconds", "reconnectionGraceSeconds"] },
    severity: "medium",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "audit_005",
    adminId: "admin_2",
    adminUsername: "moderator",
    action: "kyc.approved",
    resourceType: "kyc",
    resourceId: "kyc_123",
    details: { userId: "user_456" },
    severity: "low",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-13T16:45:00Z",
  },
];

function SeverityBadge({ severity }: { severity: string }) {
  const configs: Record<string, { bg: string; text: string; icon?: any }> = {
    low: { bg: "bg-green-500/10", text: "text-green-400" },
    medium: { bg: "bg-amber-500/10", text: "text-amber-400" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400" },
    critical: { bg: "bg-red-500/10", text: "text-red-400" },
  };

  const config = configs[severity] || configs.low;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

function ActionBadge({ action }: { action: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
      {action.split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}
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

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString();
}

const AUDIT_ACTIONS = [
  { value: "", label: "All Actions" },
  { value: "user.created", label: "User Created" },
  { value: "user.updated", label: "User Updated" },
  { value: "user.banned", label: "User Banned" },
  { value: "user.unbanned", label: "User Unbanned" },
  { value: "match.created", label: "Match Created" },
  { value: "match.completed", label: "Match Completed" },
  { value: "tournament.created", label: "Tournament Created" },
  { value: "tournament.published", label: "Tournament Published" },
  { value: "tournament.cancelled", label: "Tournament Cancelled" },
  { value: "withdrawal.requested", label: "Withdrawal Requested" },
  { value: "withdrawal.approved", label: "Withdrawal Approved" },
  { value: "withdrawal.rejected", label: "Withdrawal Rejected" },
  { value: "kyc.submitted", label: "KYC Submitted" },
  { value: "kyc.approved", label: "KYC Approved" },
  { value: "kyc.rejected", label: "KYC Rejected" },
  { value: "fraud.alert", label: "Fraud Alert" },
  { value: "settings.updated", label: "Settings Updated" },
  { value: "admin.login", label: "Admin Login" },
];

const SEVERITIES = [
  { value: "", label: "All Severities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const MOCK_AUDIT_LOGS = [
  {
    id: "audit_001",
    adminId: "admin_1",
    adminUsername: "admin",
    action: "user.banned",
    resourceType: "user",
    resourceId: "user_123",
    details: { reason: "Toxic behavior", bannedBy: "admin" },
    severity: "high",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "audit_002",
    adminId: "admin_2",
    adminUsername: "moderator",
    action: "withdrawal.approved",
    resourceType: "withdrawal",
    resourceId: "withdrawal_123",
    details: { amount: 5000, method: "upi" },
    severity: "medium",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-15T12:15:00Z",
  },
  {
    id: "audit_003",
    adminId: "admin_1",
    adminUsername: "admin",
    action: "tournament.published",
    resourceType: "tournament",
    resourceId: "t1",
    details: { name: "Ludo Nexus Championship 2024" },
    severity: "low",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "audit_004",
    adminId: "admin_3",
    adminUsername: "superadmin",
    action: "settings.updated",
    resourceType: "settings",
    resourceId: "game_config",
    details: { changedFields: ["turnTimeSeconds", "reconnectionGraceSeconds"] },
    severity: "medium",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "audit_005",
    adminId: "admin_2",
    adminUsername: "moderator",
    action: "kyc.approved",
    resourceType: "kyc",
    resourceId: "kyc_123",
    details: { userId: "user_456" },
    severity: "low",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-13T16:45:00Z",
  },
];

function SeverityBadge({ severity }: { severity: string }) {
  const configs: Record<string, { bg: string; text: string; icon?: any }> = {
    low: { bg: "bg-green-500/10", text: "text-green-400" },
    medium: { bg: "bg-amber-500/10", text: "text-amber-400" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400" },
    critical: { bg: "bg-red-500/10", text: "text-red-400" },
  };

  const config = configs[severity] || configs.low;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

function ActionBadge({ action }: { action: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
      {action.split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}
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

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString();
}

const AUDIT_ACTIONS = [
  { value: "", label: "All Actions" },
  { value: "user.created", label: "User Created" },
  { value: "user.updated", label: "User Updated" },
  { value: "user.banned", label: "User Banned" },
  { value: "user.unbanned", label: "User Unbanned" },
  { value: "match.created", label: "Match Created" },
  { value: "match.completed", label: "Match Completed" },
  { value: "tournament.created", label: "Tournament Created" },
  { value: "tournament.published", label: "Tournament Published" },
  { value: "tournament.cancelled", label: "Tournament Cancelled" },
  { value: "withdrawal.requested", label: "Withdrawal Requested" },
  { value: "withdrawal.approved", label: "Withdrawal Approved" },
  { value: "withdrawal.rejected", label: "Withdrawal Rejected" },
  { value: "kyc.submitted", label: "KYC Submitted" },
  { value: "kyc.approved", label: "KYC Approved" },
  { value: "kyc.rejected", label: "KYC Rejected" },
  { value: "fraud.alert", label: "Fraud Alert" },
  { value: "settings.updated", label: "Settings Updated" },
  { value: "admin.login", label: "Admin Login" },
];

const SEVERITIES = [
  { value: "", label: "All Severities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const MOCK_AUDIT_LOGS = [
  {
    id: "audit_001",
    adminId: "admin_1",
    adminUsername: "admin",
    action: "user.banned",
    resourceType: "user",
    resourceId: "user_123",
    details: { reason: "Toxic behavior", bannedBy: "admin" },
    severity: "high",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "audit_002",
    adminId: "admin_2",
    adminUsername: "moderator",
    action: "withdrawal.approved",
    resourceType: "withdrawal",
    resourceId: "withdrawal_123",
    details: { amount: 5000, method: "upi" },
    severity: "medium",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-15T12:15:00Z",
  },
  {
    id: "audit_003",
    adminId: "admin_1",
    adminUsername: "admin",
    action: "tournament.published",
    resourceType: "tournament",
    resourceId: "t1",
    details: { name: "Ludo Nexus Championship 2024" },
    severity: "low",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "audit_004",
    adminId: "admin_3",
    adminUsername: "superadmin",
    action: "settings.updated",
    resourceType: "settings",
    resourceId: "game_config",
    details: { changedFields: ["turnTimeSeconds", "reconnectionGraceSeconds"] },
    severity: "medium",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "audit_005",
    adminId: "admin_2",
    adminUsername: "moderator",
    action: "kyc.approved",
    resourceType: "kyc",
    resourceId: "kyc_123",
    details: { userId: "user_456" },
    severity: "low",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0...",
    createdAt: "2024-01-13T16:45:00Z",
  },
];

export default function AdminAuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [dateRange, setDateRange] = useState("");
  const logsPerPage = 15;
  const [loading, setLoading] = useState(false);

  const filteredLogs = MOCK_AUDIT_LOGS
    .filter((log) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.id.toLowerCase().includes(query) ||
          log.adminUsername.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.resourceId?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((log) => {
      if (actionFilter === "all") return true;
      return log.action === actionFilter;
    })
    .filter((log) => {
      if (severityFilter === "all") return true;
      return log.severity === severityFilter;
    })
    .filter((log) => {
      if (!dateRange) return true;
      const logDate = new Date(log.createdAt);
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
      return logDate >= startDate;
    });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * logsPerPage,
    page * logsPerPage
  );
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">Audit Logs</h1>
          <p className="text-text-secondary mt-1">Monitor all admin actions and system changes</p>
        </div>
        <Link href="/admin/audit-logs/export" className="btn-primary gap-2">
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
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="input w-auto min-w-[200px]"
            >
              <option value="">All Actions</option>
              {AUDIT_ACTIONS.slice(1).map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="input w-auto min-w-[140px]"
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
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

      {/* Audit Logs Table */}
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
              key: "adminUsername",
              header: "Admin",
              render: (row) => (
                <div>
                  <div className="font-medium text-white">{row.adminUsername}</div>
                  <div className="text-body-sm text-text-secondary">{row.adminId}</div>
                </div>
              ),
            },
            {
              key: "action",
              header: "Action",
              render: (row) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                  {row.action.split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}
                </span>
              ),
            },
            {
              key: "resourceType",
              header: "Resource",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
                    {row.resourceType}
                  </span>
                  <code className="text-cyan-300 text-sm">{row.resourceId}</code>
                </div>
              ),
            },
            {
              key: "severity",
              header: "Severity",
              render: (row) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  row.severity === "low" ? "bg-green-500/10 text-green-400" :
                  row.severity === "medium" ? "bg-amber-500/10 text-amber-400" :
                  row.severity === "high" ? "bg-orange-500/10 text-orange-400" :
                  row.severity === "critical" ? "bg-red-500/10 text-red-400" :
                  "bg-slate-500/10 text-slate-400"
                }`}>
                  {row.severity.charAt(0).toUpperCase() + row.severity.slice(1)}
                </span>
              ),
            },
            {
              key: "ipAddress",
              header: "IP Address",
              render: (row) => <code className="text-cyan-300 text-sm">{row.ipAddress}</code>,
            },
            {
              key: "createdAt",
              header: "Timestamp",
              render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
            },
          ]}
          data={paginatedLogs}
          keyField="id"
          loading={loading}
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              <Link
                href={`/admin/audit-logs/${row.id}`}
                className="btn-ghost p-2 rounded-xl"
                aria-label="View details"
              >
                <Eye className="w-4 h-4" />
              </Link>
            )}
          />
        </DataTable>
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
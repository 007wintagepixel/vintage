"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  UserPlus,
  Ban,
  Eye,
  Edit,
  ShieldCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  status: "active" | "inactive" | "banned";
  lastLogin: string;
  matches: number;
  kyc: "verified" | "pending" | "rejected" | "not_started";
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "cyber_gamer_99",
    email: "player1@example.com",
    level: 15,
    status: "active",
    lastLogin: "2 min ago",
    matches: 234,
    kyc: "verified",
  },
  {
    id: "2",
    username: "dice_master",
    email: "player2@example.com",
    level: 8,
    status: "active",
    lastLogin: "15 min ago",
    matches: 89,
    kyc: "verified",
  },
  {
    id: "3",
    username: "ludo_king_2024",
    email: "player3@example.com",
    level: 22,
    status: "banned",
    lastLogin: "3 days ago",
    matches: 567,
    kyc: "rejected",
  },
  {
    id: "4",
    username: "token_tactician",
    email: "player4@example.com",
    level: 12,
    status: "active",
    lastLogin: "1 hour ago",
    matches: 156,
    kyc: "pending",
  },
  {
    id: "5",
    username: "board_boss",
    email: "player5@example.com",
    level: 5,
    status: "inactive",
    lastLogin: "2 weeks ago",
    matches: 23,
    kyc: "not_started",
  },
  {
    id: "6",
    username: "pixel_phantom",
    email: "player6@example.com",
    level: 18,
    status: "active",
    lastLogin: "5 min ago",
    matches: 312,
    kyc: "verified",
  },
  {
    id: "7",
    username: "void_walker",
    email: "player7@example.com",
    level: 9,
    status: "active",
    lastLogin: "30 min ago",
    matches: 178,
    kyc: "pending",
  },
  {
    id: "8",
    username: "neon_striker",
    email: "player8@example.com",
    level: 25,
    status: "banned",
    lastLogin: "1 week ago",
    matches: 892,
    kyc: "verified",
  },
];

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string }> = {
    active: { bg: "bg-green-500/10", text: "text-green-400" },
    inactive: { bg: "bg-slate-500/10", text: "text-slate-400" },
    banned: { bg: "bg-red-500/10", text: "text-red-400" },
    pending: { bg: "bg-amber-500/10", text: "text-amber-400" },
    verified: { bg: "bg-green-500/10", text: "text-green-400" },
    rejected: { bg: "bg-red-500/10", text: "text-red-400" },
    not_started: { bg: "bg-slate-500/10", text: "text-slate-400" },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
    </span>
  );
}

function KycBadge({ kyc }: { kyc: string }) {
  const configs: Record<string, { bg: string; text: string }> = {
    verified: { bg: "bg-green-500/10", text: "text-green-400" },
    pending: { bg: "bg-amber-500/10", text: "text-amber-400" },
    rejected: { bg: "bg-red-500/10", text: "text-red-400" },
    not_started: { bg: "bg-slate-500/10", text: "text-slate-400" },
  };

  const config = configs[kyc] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {kyc.charAt(0).toUpperCase() + kyc.slice(1).replace("_", " ")}
    </span>
  );
}

function DataTable({
  columns,
  data,
  keyField,
  actions,
  emptyMessage = "No data available",
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
}) {
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

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kycFilter, setKycFilter] = useState<string>("all");
  const usersPerPage = 10;

  const filteredUsers = mockUsers
    .filter((user) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((user) => {
      if (statusFilter === "all") return true;
      return user.status === statusFilter;
    })
    .filter((user) => {
      if (kycFilter === "all") return true;
      return user.kyc === kycFilter;
    });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage,
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">Users</h1>
          <p className="text-text-secondary mt-1">
            Manage user accounts, status, and KYC verification
          </p>
        </div>
        <Link href="/admin/users/new" className="btn-primary gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
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
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12 w-full"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-auto min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="input w-auto min-w-[150px]"
            >
              <option value="all">All KYC</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="not_started">Not Started</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          columns={[
            {
              key: "username",
              header: "User",
              render: (row) => (
                <div>
                  <div className="font-medium text-text-primary">
                    {row.username}
                  </div>
                  <div className="text-body-sm text-text-secondary">
                    {row.email}
                  </div>
                </div>
              ),
            },
            {
              key: "level",
              header: "Level",
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: "kyc",
              header: "KYC",
              render: (row) => <KycBadge kyc={row.kyc} />,
            },
            {
              key: "matches",
              header: "Matches",
            },
            {
              key: "lastLogin",
              header: "Last Login",
            },
          ]}
          data={paginatedUsers}
          keyField="id"
          actions={(row) => (
            <div className="flex items-center justify-end gap-2">
              <button
                className="btn-ghost p-2 rounded-xl hover:bg-surface-tertiary"
                aria-label="View user"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                className="btn-ghost p-2 rounded-xl hover:bg-surface-tertiary"
                aria-label="Edit user"
              >
                <Edit className="w-4 h-4" />
              </button>
              {row.status !== "banned" ? (
                <button
                  className="btn-ghost p-2 rounded-xl hover:bg-accent-red/10 hover:text-accent-red"
                  aria-label="Ban user"
                >
                  <Ban className="w-4 h-4" />
                </button>
              ) : (
                <button
                  className="btn-ghost p-2 rounded-xl hover:bg-accent-green/10 hover:text-accent-green"
                  aria-label="Unban user"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              )}
              <button
                className="btn-ghost p-2 rounded-xl hover:bg-surface-tertiary"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          )}
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

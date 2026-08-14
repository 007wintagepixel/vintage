"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import * as React from "react";
import {
  Gamepad2,
  Play,
  Flag,
  Ban,
  Eye,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Clock as HistoryIcon,
  Download,
} from "lucide-react";

interface Match {
  id: string;
  mode: "vs_human" | "vs_ai" | "group" | "tournament";
  players: number;
  result: "won" | "lost" | "in_progress";
  position: number;
  earnings: number;
  date: string;
  duration: string;
  opponents: string[];
  status: "completed" | "in_progress" | "waiting";
}

const mockMatches = [
  {
    id: "m1",
    mode: "tournament",
    players: 4,
    result: "won",
    position: 1,
    earnings: 5000,
    date: "2024-01-15",
    duration: "12:34",
    opponents: ["PlayerTwo", "PlayerThree", "PlayerFour"],
    status: "completed",
  },
  {
    id: "m2",
    mode: "vs_human",
    players: 2,
    result: "lost",
    position: 2,
    earnings: -500,
    date: "2024-01-14",
    duration: "8:21",
    opponents: ["PlayerFive"],
    status: "completed",
  },
  {
    id: "m3",
    mode: "vs_ai",
    players: 4,
    result: "won",
    position: 1,
    earnings: 0,
    date: "2024-01-13",
    duration: "15:42",
    opponents: ["Easy Bot", "Medium Bot", "Hard Bot"],
    status: "completed",
  },
  {
    id: "m4",
    mode: "group",
    players: 4,
    result: "won",
    position: 1,
    earnings: 1200,
    date: "2024-01-12",
    duration: "10:15",
    opponents: ["FriendOne", "FriendTwo", "FriendThree"],
    status: "completed",
  },
  {
    id: "m5",
    mode: "vs_human",
    players: 3,
    result: "lost",
    position: 3,
    earnings: -300,
    date: "2024-01-11",
    duration: "9:47",
    opponents: ["PlayerSix", "PlayerSeven"],
    status: "completed",
  },
  {
    id: "m6",
    mode: "tournament",
    players: 8,
    result: "won",
    position: 2,
    earnings: 2000,
    date: "2024-01-10",
    duration: "22:10",
    opponents: [
      "PlayerEight",
      "PlayerNine",
      "PlayerTen",
      "PlayerEleven",
      "PlayerTwelve",
      "PlayerThirteen",
      "PlayerFourteen",
    ],
    status: "completed",
  },
  {
    id: "m7",
    mode: "vs_ai",
    players: 2,
    result: "won",
    position: 1,
    earnings: 0,
    date: "2024-01-09",
    duration: "6:33",
    opponents: ["Hard Bot"],
    status: "completed",
  },
  {
    id: "m8",
    mode: "vs_human",
    players: 4,
    result: "lost",
    position: 4,
    earnings: -800,
    date: "2024-01-08",
    duration: "14:22",
    opponents: ["PlayerFifteen", "PlayerSixteen", "PlayerSeventeen"],
    status: "completed",
  },
  {
    id: "m9",
    mode: "group",
    players: 2,
    result: "in_progress",
    position: 0,
    earnings: 0,
    date: "2024-01-15",
    duration: "5:12",
    opponents: ["FriendFour"],
    status: "in_progress",
  },
  {
    id: "m10",
    mode: "tournament",
    players: 16,
    result: "in_progress",
    position: 0,
    earnings: 0,
    date: "2024-01-15",
    duration: "12:45",
    opponents: [
      "TPlayer1",
      "TPlayer2",
      "TPlayer3",
      "TPlayer4",
      "TPlayer5",
      "TPlayer6",
      "TPlayer7",
      "TPlayer8",
      "TPlayer9",
      "TPlayer10",
      "TPlayer11",
      "TPlayer12",
      "TPlayer13",
      "TPlayer14",
      "TPlayer15",
      "TPlayer16",
    ],
    status: "in_progress",
  },
];

const modeIcons = {
  vs_human: "Users",
  vs_ai: "Play",
  tournament: "Flag",
  group: "Users",
};

const modeLabels = {
  vs_human: "Quick Match",
  vs_ai: "Practice vs AI",
  tournament: "Tournament",
  group: "Private Room",
};

function ResultBadge({ result }: { result: string }) {
  if (result === "won") {
    return (
      <span className="px-3 py-1 rounded-full text-caption font-medium bg-accent-green/20 text-accent-green flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Won
      </span>
    );
  }
  if (result === "in_progress") {
    return (
      <span className="px-3 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow flex items-center gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        In Progress
      </span>
    );
  }
  return (
    <span className="px-3 py-1 rounded-full text-caption font-medium bg-accent-red/20 text-accent-red">
      Lost
    </span>
  );
}

function ModeIcon({ mode }: { mode: string }) {
  const Icon = modeIcons[mode as keyof typeof modeIcons] || "Gamepad2";
  return <Icon className="w-4 h-4" />;
}

function StatusBadge({ status }: { status: string }) {
  const configs = {
    completed: { bg: "bg-green-500/10", text: "text-green-400" },
    in_progress: { bg: "bg-blue-500/10", text: "text-blue-400" },
    waiting: { bg: "bg-amber-500/10", text: "text-amber-400" },
    cancelled: { bg: "bg-red-500/10", text: "text-red-400" },
  };

  const config = configs[status] || configs.waiting;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
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

interface Stat {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const stats = [
  {
    label: "Total Games",
    value: mockMatches.length,
    icon: "Gamepad2",
    color: "text-primary-glow",
  },
  {
    label: "Completed",
    value: mockMatches.filter((m) => m.status === "completed").length,
    icon: "CheckCircle",
    color: "text-accent-green",
  },
  {
    label: "In Progress",
    value: mockMatches.filter((m) => m.status === "in_progress").length,
    icon: "AlertTriangle",
    color: "text-accent-gold",
  },
  {
    label: "Total Earnings",
    value: mockMatches
      .reduce((sum, m) => sum + m.earnings, 0)
      .toLocaleString(),
    icon: "RefreshCw",
    color: "text-secondary-glow",
  },
];

function IconStat({ icon, color }: { icon: React.ComponentType<{ className?: string }>; color: string }) {
  return React.createElement(icon, { className: "w-7 h-7 " + color });
}

export default function AdminMatchesPage() {
  const [filter, setFilter] = useState<"all" | "won" | "lost" | "in_progress">("all");
  const [page, setPage] = useState(1);
  const matchesPerPage = 5;
  const [sortBy, setSortBy] = useState<"date" | "earnings" | "duration">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredMatches = mockMatches
    .filter((match) => {
      if (filter === "all") return true;
      if (filter === "won") return match.result === "won";
      if (filter === "lost") return match.result === "lost";
      if (filter === "in_progress") return match.status === "in_progress";
      return true;
    })
    .sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "date") {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (sortBy === "earnings") {
        aVal = a.earnings;
        bVal = b.earnings;
      } else {
        const parseDuration = (d: string) => {
          const [m, s] = d.split(":").map(Number);
          return m * 60 + s;
        };
        aVal = parseDuration(a.duration);
        bVal = parseDuration(b.duration);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  const paginatedMatches = filteredMatches.slice(
    (page - 1) * matchesPerPage,
    page * matchesPerPage
  );
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">
            Match Management
          </h1>
          <p className="text-text-secondary mt-1">
            View and manage all matches across the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="btn-primary gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="glass-card-hover p-6 rounded-2xl text-center"
          >
            <div
              className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${stat.color}20`}
            >
              <IconStat icon={stat.icon} color={stat.color} />
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              className="font-display text-display-sm md:text-display-md"
            >
              {stat.value}
            </motion.div>
            <div className="text-text-secondary text-body-sm mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters & Sort */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card-strong p-4 rounded-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "won", label: "Wins" },
              { id: "lost", label: "Losses" },
              { id: "in_progress", label: "In Progress" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFilter(f.id as typeof filter);
                  setPage(1);
                }}
                className={
                  "px-4 py-2 rounded-xl text-body-sm font-medium transition-all " +
                  (filter === f.id
                    ? "bg-primary-glow/20 text-primary-glow border border-primary-glow/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as typeof sortBy);
                setPage(1);
              }}
              className="input w-auto min-w-[140px]"
            >
              <option value="date">Sort by Date</option>
              <option value="earnings">Sort by Earnings</option>
              <option value="duration">Sort by Duration</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Toggle sort order"
            >
              {sortOrder === "asc" ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Match List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {paginatedMatches.length === 0 ? (
          <div className="glass-card-strong p-12 rounded-2xl text-center">
            <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-text-muted/50" />
            <h3 className="font-display text-heading-md mb-2">
              No matches found
            </h3>
            <p className="text-text-secondary text-body">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div>
            <div className="space-y-3">
              {paginatedMatches.map((match, index) => {
                const earningsColor =
                  match.earnings >= 0 ? "text-accent-green" : "text-accent-red";
                const earningsDisplay =
                  match.earnings >= 0
                    ? "+" + match.earnings.toLocaleString()
                    : match.earnings.toLocaleString();
                const earningsColorClass =
                  match.earnings >= 0 ? "text-accent-green" : "text-accent-red";

                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card-hover p-5 rounded-2xl"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Date & Mode */}
                      <div className="md:col-span-2 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-glow/20 to-accent-magenta/20 flex items-center justify-center">
                          <ModeIcon mode={match.mode} />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">
                            {modeLabels[match.mode as keyof typeof modeLabels] || match.mode}
                          </div>
                          <div className="text-body-sm text-text-muted">
                            {match.date} + " " + "•" + " " + {match.duration}
                          </div>
                        </div>
                      </div>

                      {/* Opponents */}
                      <div className="md:col-span-4 flex flex-wrap gap-1.5">
                        {match.opponents.slice(0, 3).map((opp, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-full text-caption bg-surface-tertiary text-text-secondary border border-surface-border"
                          >
                            {opp}
                          </span>
                        ))}
                        {match.opponents.length > 3 && (
                          <span className="px-2 py-1 rounded-full text-caption bg-primary-glow/20 text-primary-glow border border-primary-glow/30">
                            +{match.opponents.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Result */}
                      <div className="md:col-span-3 flex items-center justify-center md:justify-end gap-3">
                        <ResultBadge result={match.result} />
                      </div>

                      {/* Earnings */}
                      <div className="md:col-span-3 flex items-center justify-center md:justify-end gap-3">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.1 + index * 0.05,
                            type: "spring",
                          }}
                          className={earningsColorClass + " font-display text-heading-sm font-mono"}
                        >
                          {earningsDisplay}
                        </motion.div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2 flex items-center justify-center md:justify-end gap-2">
                        <button
                          className="btn-ghost p-2 rounded-xl hover:bg-surface-tertiary"
                          aria-label="Watch replay"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="btn-ghost p-2 rounded-xl hover:bg-surface-tertiary"
                          aria-label="Download replay"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
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
        </div>
      </motion.div>
    </div>
  );
}
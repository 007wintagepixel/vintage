"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  Download,
  Filter,
  User,
  Gamepad2,
  Wallet,
  Settings,
  Shield,
  Search,
} from "lucide-react";

type ActionType = "user" | "match" | "financial" | "system";

interface MockLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  type: ActionType;
}

const mockLogs: MockLog[] = [
  {
    id: "L-001",
    timestamp: "2024-01-28 14:35:22",
    admin: "admin_user",
    action: "BAN_USER",
    target: "cheaterAccount",
    details: "Banned for cheating in match M-4286",
    ip: "192.168.1.10",
    type: "user",
  },
  {
    id: "L-002",
    timestamp: "2024-01-28 14:30:15",
    admin: "admin_user",
    action: "VERIFY_KYC",
    target: "championKing",
    details: "KYC verification approved",
    ip: "192.168.1.10",
    type: "user",
  },
  {
    id: "L-003",
    timestamp: "2024-01-28 14:22:08",
    admin: "admin_user",
    action: "CANCEL_MATCH",
    target: "M-4287",
    details: "Match cancelled due to player dispute",
    ip: "192.168.1.10",
    type: "match",
  },
  {
    id: "L-004",
    timestamp: "2024-01-28 14:15:44",
    admin: "admin_user",
    action: "FLAG_MATCH",
    target: "M-4286",
    details: "Flagged for suspicious gameplay patterns",
    ip: "192.168.1.10",
    type: "match",
  },
  {
    id: "L-005",
    timestamp: "2024-01-28 14:05:30",
    admin: "admin_user",
    action: "APPROVE_WITHDRAWAL",
    target: "TX-10002",
    details: "Withdrawal of 12,000 coins approved for championKing",
    ip: "192.168.1.10",
    type: "financial",
  },
  {
    id: "L-006",
    timestamp: "2024-01-28 13:50:12",
    admin: "admin_user",
    action: "CREATE_TOURNAMENT",
    target: "T-002",
    details: 'Created "Weekend Warriors Cup" tournament',
    ip: "192.168.1.10",
    type: "system",
  },
  {
    id: "L-007",
    timestamp: "2024-01-28 13:40:55",
    admin: "admin_user",
    action: "REJECT_WITHDRAWAL",
    target: "TX-10004",
    details: "Withdrawal of 800 coins rejected for luckyOne",
    ip: "192.168.1.10",
    type: "financial",
  },
  {
    id: "L-008",
    timestamp: "2024-01-28 13:30:20",
    admin: "admin_user",
    action: "UNBAN_USER",
    target: "aggressiveRoll",
    details: "Ban lifted after review",
    ip: "192.168.1.10",
    type: "user",
  },
  {
    id: "L-009",
    timestamp: "2024-01-28 13:15:08",
    admin: "admin_user",
    action: "UPDATE_SETTINGS",
    target: "platform_config",
    details: "Updated entry fee limits for Quick Match mode",
    ip: "192.168.1.10",
    type: "system",
  },
  {
    id: "L-010",
    timestamp: "2024-01-28 13:00:45",
    admin: "admin_user",
    action: "VIEW_REPLAY",
    target: "M-4283",
    details: "Reviewed replay for flagged match",
    ip: "192.168.1.10",
    type: "match",
  },
  {
    id: "L-011",
    timestamp: "2024-01-28 12:45:33",
    admin: "admin_user",
    action: "APPROVE_WITHDRAWAL",
    target: "TX-10006",
    details: "Withdrawal of 5,000 coins approved for tokenHunter",
    ip: "192.168.1.10",
    type: "financial",
  },
  {
    id: "L-012",
    timestamp: "2024-01-28 12:30:18",
    admin: "admin_user",
    action: "FLAG_MATCH",
    target: "M-4283",
    details: "Flagged for possible multi-accounting",
    ip: "192.168.1.10",
    type: "match",
  },
  {
    id: "L-013",
    timestamp: "2024-01-28 12:15:50",
    admin: "admin_user",
    action: "VERIFY_KYC",
    target: "boardMaster",
    details: "KYC verification approved",
    ip: "192.168.1.10",
    type: "user",
  },
  {
    id: "L-014",
    timestamp: "2024-01-28 12:00:05",
    admin: "admin_user",
    action: "SYSTEM_BACKUP",
    target: "database",
    details: "Manual database backup triggered",
    ip: "192.168.1.10",
    type: "system",
  },
  {
    id: "L-015",
    timestamp: "2024-01-28 11:45:40",
    admin: "admin_user",
    action: "CANCEL_MATCH",
    target: "M-4282",
    details: "Match cancelled — insufficient players",
    ip: "192.168.1.10",
    type: "match",
  },
  {
    id: "L-016",
    timestamp: "2024-01-28 11:30:25",
    admin: "admin_user",
    action: "UPDATE_TOURNAMENT",
    target: "T-001",
    details: "Updated prize pool for New Year Championship",
    ip: "192.168.1.10",
    type: "system",
  },
  {
    id: "L-017",
    timestamp: "2024-01-28 11:15:10",
    admin: "admin_user",
    action: "BAN_USER",
    target: "aggressiveRoll",
    details: "Banned for toxic behavior in chat",
    ip: "192.168.1.10",
    type: "user",
  },
  {
    id: "L-018",
    timestamp: "2024-01-28 11:00:55",
    admin: "admin_user",
    action: "REJECT_WITHDRAWAL",
    target: "TX-10013",
    details: "Withdrawal of 1,500 coins rejected for diceRoller99",
    ip: "192.168.1.10",
    type: "financial",
  },
  {
    id: "L-019",
    timestamp: "2024-01-28 10:45:30",
    admin: "admin_user",
    action: "VERIFY_KYC",
    target: "speedDemon",
    details: "KYC verification approved",
    ip: "192.168.1.10",
    type: "user",
  },
  {
    id: "L-020",
    timestamp: "2024-01-28 10:30:15",
    admin: "admin_user",
    action: "RESTART_SERVICE",
    target: "matchmaking_service",
    details: "Restarted matchmaking service after detected anomaly",
    ip: "192.168.1.10",
    type: "system",
  },
];

const filterOptions: {
  value: ActionType | "all";
  label: string;
  icon: typeof User;
}[] = [
  { value: "all", label: "All Actions", icon: Filter },
  { value: "user", label: "User Actions", icon: User },
  { value: "match", label: "Match Actions", icon: Gamepad2 },
  { value: "financial", label: "Financial", icon: Wallet },
  { value: "system", label: "System", icon: Settings },
];

const getTypeIcon = (type: ActionType) => {
  switch (type) {
    case "user":
      return <User className="w-4 h-4 text-primary-glow" />;
    case "match":
      return <Gamepad2 className="w-4 h-4 text-accent-magenta" />;
    case "financial":
      return <Wallet className="w-4 h-4 text-secondary-glow" />;
    case "system":
      return <Settings className="w-4 h-4 text-accent-cyan" />;
  }
};

const getTypeColor = (type: ActionType) => {
  switch (type) {
    case "user":
      return "text-primary-glow";
    case "match":
      return "text-accent-magenta";
    case "financial":
      return "text-secondary-glow";
    case "system":
      return "text-accent-cyan";
  }
};

export default function AdminAuditPage() {
  const [filter, setFilter] = useState<ActionType | "all">("all");
  const [search, setSearch] = useState("");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesFilter = filter === "all" || log.type === filter;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.admin.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="font-display text-display-md gradient-text">
            Audit Logs
          </h2>
          <p className="text-text-secondary mt-1">
            Track all administrative actions on the platform
          </p>
        </div>
        <button className="btn-secondary gap-2">
          <Download className="w-5 h-5" />
          Export Logs
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Logs",
            value: mockLogs.length,
            icon: FileText,
            color: "text-primary-glow",
          },
          {
            label: "User Actions",
            value: mockLogs.filter((l) => l.type === "user").length,
            icon: User,
            color: "text-primary-glow",
          },
          {
            label: "Match Actions",
            value: mockLogs.filter((l) => l.type === "match").length,
            icon: Gamepad2,
            color: "text-accent-magenta",
          },
          {
            label: "Financial",
            value: mockLogs.filter((l) => l.type === "financial").length,
            icon: Wallet,
            color: "text-secondary-glow",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-tertiary flex items-center justify-center">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="font-display text-heading-sm text-text-primary">
                {stat.value}
              </div>
              <div className="text-caption text-text-muted">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search logs by action, target, or admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-body-sm font-medium transition-all ${
                filter === opt.value
                  ? "bg-primary-glow/20 text-primary-glow border border-primary-glow/30"
                  : "glass-panel text-text-secondary hover:text-text-primary"
              }`}
            >
              <opt.icon className="w-4 h-4" />
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="text-left text-caption text-text-muted border-b border-surface-border bg-surface-tertiary/30">
                <th className="py-4 px-4 font-medium">Timestamp</th>
                <th className="py-4 px-4 font-medium">Admin</th>
                <th className="py-4 px-4 font-medium">Action</th>
                <th className="py-4 px-4 font-medium">Target</th>
                <th className="py-4 px-4 font-medium">Details</th>
                <th className="py-4 px-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-surface-border/50 hover:bg-surface-tertiary/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-mono text-caption text-text-muted">
                      {log.timestamp}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-red/30 to-accent-magenta/30 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-accent-red" />
                      </div>
                      <span className="text-body-sm text-text-primary">
                        {log.admin}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(log.type)}
                      <span
                        className={`font-mono text-body-sm font-medium ${getTypeColor(log.type)}`}
                      >
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-body-sm text-text-secondary">
                      {log.target}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-body-sm text-text-muted max-w-xs">
                    {log.details}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-caption text-text-muted">
                      {log.ip}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="py-16 text-center text-text-muted">
            No audit logs match your search.
          </div>
        )}
        <div className="px-6 py-4 border-t border-surface-border">
          <span className="text-caption text-text-muted">
            Showing {filteredLogs.length} of {mockLogs.length} log entries
          </span>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Ban,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

type UserStatus = "active" | "banned";
type KycStatus = "verified" | "pending" | "rejected";

interface MockUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: UserStatus;
  kyc: KycStatus;
  registered: string;
  matches: number;
  wallet: number;
}

const mockUsers: MockUser[] = [
  {
    id: "1",
    username: "gamerX2024",
    email: "gamerx@email.com",
    avatar: "GX",
    status: "active",
    kyc: "verified",
    registered: "2024-01-15",
    matches: 234,
    wallet: 12500,
  },
  {
    id: "2",
    username: "championKing",
    email: "king@email.com",
    avatar: "CK",
    status: "active",
    kyc: "verified",
    registered: "2024-01-10",
    matches: 512,
    wallet: 45000,
  },
  {
    id: "3",
    username: "diceRoller99",
    email: "dice@email.com",
    avatar: "DR",
    status: "active",
    kyc: "pending",
    registered: "2024-01-18",
    matches: 45,
    wallet: 3200,
  },
  {
    id: "4",
    username: "proGamer",
    email: "pro@email.com",
    avatar: "PG",
    status: "active",
    kyc: "verified",
    registered: "2024-01-05",
    matches: 789,
    wallet: 89000,
  },
  {
    id: "5",
    username: "luckyOne",
    email: "lucky@email.com",
    avatar: "LO",
    status: "active",
    kyc: "pending",
    registered: "2024-01-20",
    matches: 12,
    wallet: 800,
  },
  {
    id: "6",
    username: "cheaterAccount",
    email: "cheat@email.com",
    avatar: "CA",
    status: "banned",
    kyc: "rejected",
    registered: "2024-01-08",
    matches: 3,
    wallet: 0,
  },
  {
    id: "7",
    username: "boardMaster",
    email: "board@email.com",
    avatar: "BM",
    status: "active",
    kyc: "verified",
    registered: "2024-01-03",
    matches: 654,
    wallet: 67000,
  },
  {
    id: "8",
    username: "tokenHunter",
    email: "hunter@email.com",
    avatar: "TH",
    status: "active",
    kyc: "verified",
    registered: "2024-01-12",
    matches: 321,
    wallet: 23000,
  },
  {
    id: "9",
    username: "rollQueen",
    email: "queen@email.com",
    avatar: "RQ",
    status: "active",
    kyc: "pending",
    registered: "2024-01-22",
    matches: 28,
    wallet: 1500,
  },
  {
    id: "10",
    username: "strategicMind",
    email: "strat@email.com",
    avatar: "SM",
    status: "active",
    kyc: "verified",
    registered: "2024-01-01",
    matches: 1023,
    wallet: 156000,
  },
  {
    id: "11",
    username: "speedDemon",
    email: "speed@email.com",
    avatar: "SD",
    status: "active",
    kyc: "verified",
    registered: "2024-01-14",
    matches: 445,
    wallet: 34000,
  },
  {
    id: "12",
    username: "calmPlayer",
    email: "calm@email.com",
    avatar: "CP",
    status: "active",
    kyc: "pending",
    registered: "2024-01-25",
    matches: 67,
    wallet: 4200,
  },
  {
    id: "13",
    username: "aggressiveRoll",
    email: "aggr@email.com",
    avatar: "AR",
    status: "banned",
    kyc: "verified",
    registered: "2024-01-06",
    matches: 89,
    wallet: 0,
  },
  {
    id: "14",
    username: "nightOwl",
    email: "owl@email.com",
    avatar: "NO",
    status: "active",
    kyc: "verified",
    registered: "2024-01-09",
    matches: 578,
    wallet: 56000,
  },
  {
    id: "15",
    username: "newbieGamer",
    email: "newb@email.com",
    avatar: "NG",
    status: "active",
    kyc: "pending",
    registered: "2024-01-28",
    matches: 5,
    wallet: 500,
  },
];

const filterOptions = [
  { value: "all", label: "All Users" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending KYC" },
  { value: "banned", label: "Banned" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && u.kyc === "verified") ||
      (filter === "pending" && u.kyc === "pending") ||
      (filter === "banned" && u.status === "banned");
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  const getStatusBadge = (status: UserStatus) =>
    status === "active" ? (
      <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-green/20 text-accent-green flex items-center gap-1 w-fit">
        <CheckCircle className="w-3 h-3" /> Active
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-red/20 text-accent-red flex items-center gap-1 w-fit">
        <XCircle className="w-3 h-3" /> Banned
      </span>
    );

  const getKycBadge = (kyc: KycStatus) => {
    switch (kyc) {
      case "verified":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-secondary-glow/20 text-secondary-glow flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-red/20 text-accent-red flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-display-md gradient-text">
          User Management
        </h2>
        <p className="text-text-secondary mt-1">
          Manage all platform users, KYC verification, and account status
        </p>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: mockUsers.length,
            icon: UsersIcon,
            color: "text-primary-glow",
          },
          {
            label: "Verified",
            value: mockUsers.filter((u) => u.kyc === "verified").length,
            icon: ShieldCheck,
            color: "text-accent-green",
          },
          {
            label: "Pending KYC",
            value: mockUsers.filter((u) => u.kyc === "pending").length,
            icon: Clock,
            color: "text-secondary-glow",
          },
          {
            label: "Banned",
            value: mockUsers.filter((u) => u.status === "banned").length,
            icon: Ban,
            color: "text-accent-red",
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
        className="glass-card-strong p-4 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-11"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input pl-11 pr-8 appearance-none cursor-pointer min-w-[180px]"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
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
                <th className="py-4 px-4 font-medium">User</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">KYC</th>
                <th className="py-4 px-4 font-medium">Registered</th>
                <th className="py-4 px-4 font-medium">Matches</th>
                <th className="py-4 px-4 font-medium">Wallet</th>
                <th className="py-4 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-surface-border/50 hover:bg-surface-tertiary/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-glow/30 to-accent-magenta/30 flex items-center justify-center border border-surface-borderGlow flex-shrink-0">
                        <span className="font-display text-body-sm text-text-primary">
                          {user.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-text-primary text-body-sm">
                          {user.username}
                        </div>
                        <div className="text-caption text-text-muted">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
                  <td className="py-4 px-4">{getKycBadge(user.kyc)}</td>
                  <td className="py-4 px-4 text-body-sm text-text-secondary">
                    {user.registered}
                  </td>
                  <td className="py-4 px-4 text-body-sm text-text-secondary font-mono">
                    {user.matches}
                  </td>
                  <td className="py-4 px-4 text-body-sm text-secondary-glow font-mono font-medium">
                    {user.wallet.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 rounded-lg text-text-muted hover:text-primary-glow hover:bg-primary-glow/10 transition-all"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-all ${
                          user.status === "banned"
                            ? "text-text-muted hover:text-accent-green hover:bg-accent-green/10"
                            : "text-text-muted hover:text-accent-red hover:bg-accent-red/10"
                        }`}
                        title={user.status === "banned" ? "Unban" : "Ban"}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      {user.kyc === "pending" && (
                        <button
                          className="p-2 rounded-lg text-text-muted hover:text-primary-glow hover:bg-primary-glow/10 transition-all"
                          title="Verify KYC"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border">
          <span className="text-caption text-text-muted">
            Showing {(currentPage - 1) * usersPerPage + 1}–
            {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-body-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-primary-glow/20 text-primary-glow border border-primary-glow/30"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-tertiary"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

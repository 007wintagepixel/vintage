"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Check,
  X,
  Coins,
} from "lucide-react";

type TxType = "deposit" | "withdrawal" | "transfer";
type TxStatus = "completed" | "pending" | "failed";

interface MockTx {
  id: string;
  user: string;
  type: TxType;
  amount: number;
  status: TxStatus;
  method: string;
  date: string;
}

const mockTransactions: MockTx[] = [
  {
    id: "TX-10001",
    user: "gamerX2024",
    type: "deposit",
    amount: 5000,
    status: "completed",
    method: "Demo Card",
    date: "2024-01-28 14:20",
  },
  {
    id: "TX-10002",
    user: "championKing",
    type: "withdrawal",
    amount: 12000,
    status: "pending",
    method: "Demo Bank",
    date: "2024-01-28 14:05",
  },
  {
    id: "TX-10003",
    user: "proGamer",
    type: "transfer",
    amount: 3000,
    status: "completed",
    method: "Wallet Transfer",
    date: "2024-01-28 13:50",
  },
  {
    id: "TX-10004",
    user: "luckyOne",
    type: "withdrawal",
    amount: 800,
    status: "failed",
    method: "Demo Bank",
    date: "2024-01-28 13:30",
  },
  {
    id: "TX-10005",
    user: "boardMaster",
    type: "deposit",
    amount: 10000,
    status: "completed",
    method: "Demo Card",
    date: "2024-01-28 13:15",
  },
  {
    id: "TX-10006",
    user: "tokenHunter",
    type: "withdrawal",
    amount: 5000,
    status: "pending",
    method: "Demo Bank",
    date: "2024-01-28 12:45",
  },
  {
    id: "TX-10007",
    user: "rollQueen",
    type: "deposit",
    amount: 2000,
    status: "completed",
    method: "Demo Card",
    date: "2024-01-28 12:30",
  },
  {
    id: "TX-10008",
    user: "strategicMind",
    type: "transfer",
    amount: 15000,
    status: "completed",
    method: "Wallet Transfer",
    date: "2024-01-28 12:00",
  },
  {
    id: "TX-10009",
    user: "speedDemon",
    type: "withdrawal",
    amount: 3000,
    status: "pending",
    method: "Demo Bank",
    date: "2024-01-28 11:40",
  },
  {
    id: "TX-10010",
    user: "calmPlayer",
    type: "deposit",
    amount: 1000,
    status: "completed",
    method: "Demo Card",
    date: "2024-01-28 11:20",
  },
  {
    id: "TX-10011",
    user: "nightOwl",
    type: "withdrawal",
    amount: 8000,
    status: "completed",
    method: "Demo Bank",
    date: "2024-01-28 10:55",
  },
  {
    id: "TX-10012",
    user: "newbieGamer",
    type: "deposit",
    amount: 500,
    status: "completed",
    method: "Demo Card",
    date: "2024-01-28 10:30",
  },
  {
    id: "TX-10013",
    user: "diceRoller99",
    type: "withdrawal",
    amount: 1500,
    status: "failed",
    method: "Demo Bank",
    date: "2024-01-28 10:15",
  },
  {
    id: "TX-10014",
    user: "boardMaster",
    type: "transfer",
    amount: 2000,
    status: "completed",
    method: "Wallet Transfer",
    date: "2024-01-28 09:50",
  },
  {
    id: "TX-10015",
    user: "proGamer",
    type: "deposit",
    amount: 25000,
    status: "completed",
    method: "Demo Card",
    date: "2024-01-28 09:30",
  },
];

const tabs = [
  { id: "deposits" as const, label: "Deposits", icon: ArrowUpRight },
  { id: "withdrawals" as const, label: "Withdrawals", icon: ArrowDownLeft },
  { id: "transfers" as const, label: "Transfers", icon: ArrowLeftRight },
];

export default function AdminTransactionsPage() {
  const [activeTab, setActiveTab] = useState<
    "deposits" | "withdrawals" | "transfers"
  >("deposits");

  const filteredTx = mockTransactions.filter((tx) => {
    if (activeTab === "deposits") return tx.type === "deposit";
    if (activeTab === "withdrawals") return tx.type === "withdrawal";
    return tx.type === "transfer";
  });

  const stats = [
    {
      label: "Total Volume",
      value: "2.4M",
      sub: "coins",
      icon: Coins,
      color: "text-primary-glow",
      bg: "bg-primary-glow/20",
    },
    {
      label: "Pending Withdrawals",
      value: mockTransactions.filter(
        (t) => t.type === "withdrawal" && t.status === "pending",
      ).length,
      sub: "awaiting review",
      icon: Clock,
      color: "text-secondary-glow",
      bg: "bg-secondary-glow/20",
    },
    {
      label: "Completed Today",
      value: mockTransactions.filter((t) => t.status === "completed").length,
      sub: "transactions",
      icon: CheckCircle,
      color: "text-accent-green",
      bg: "bg-accent-green/20",
    },
    {
      label: "Failed",
      value: mockTransactions.filter((t) => t.status === "failed").length,
      sub: "transactions",
      icon: XCircle,
      color: "text-accent-red",
      bg: "bg-accent-red/20",
    },
  ];

  const getStatusBadge = (status: TxStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-green/20 text-accent-green flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-secondary-glow/20 text-secondary-glow flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-red/20 text-accent-red flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  const getTypeIcon = (type: TxType) => {
    if (type === "deposit")
      return <ArrowUpRight className="w-4 h-4 text-accent-green" />;
    if (type === "withdrawal")
      return <ArrowDownLeft className="w-4 h-4 text-accent-red" />;
    return <ArrowLeftRight className="w-4 h-4 text-primary-glow" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-display-md gradient-text">
          Transaction Management
        </h2>
        <p className="text-text-secondary mt-1">
          Monitor deposits, withdrawals, and transfers across the platform
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-5 rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="font-display text-heading-lg text-text-primary">
              {stat.value}
              <span className="text-body-sm text-text-muted ml-1">
                {stat.sub}
              </span>
            </div>
            <div className="text-caption text-text-muted mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs + Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        {/* Tab Bar */}
        <div className="border-b border-surface-border">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-body-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-primary-glow border-b-2 border-primary-glow bg-primary-glow/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="ml-1 px-2 py-0.5 rounded-full text-caption bg-surface-tertiary text-text-muted">
                  {
                    mockTransactions.filter((t) =>
                      tab.id === "deposits"
                        ? t.type === "deposit"
                        : tab.id === "withdrawals"
                          ? t.type === "withdrawal"
                          : t.type === "transfer",
                    ).length
                  }
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-caption text-text-muted border-b border-surface-border bg-surface-tertiary/30">
                <th className="py-4 px-4 font-medium">Tx ID</th>
                <th className="py-4 px-4 font-medium">User</th>
                <th className="py-4 px-4 font-medium">Type</th>
                <th className="py-4 px-4 font-medium">Amount</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Method</th>
                <th className="py-4 px-4 font-medium">Date</th>
                <th className="py-4 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-surface-border/50 hover:bg-surface-tertiary/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-mono text-body-sm text-text-primary font-medium">
                      {tx.id}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-body-sm text-text-secondary">
                    {tx.user}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      <span className="text-body-sm text-text-primary capitalize">
                        {tx.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-body-sm font-mono font-medium">
                    <span
                      className={
                        tx.type === "deposit"
                          ? "text-accent-green"
                          : tx.type === "withdrawal"
                            ? "text-accent-red"
                            : "text-primary-glow"
                      }
                    >
                      {tx.type === "deposit"
                        ? "+"
                        : tx.type === "withdrawal"
                          ? "-"
                          : ""}
                      {tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(tx.status)}</td>
                  <td className="py-4 px-4 text-body-sm text-text-secondary">
                    {tx.method}
                  </td>
                  <td className="py-4 px-4 text-body-sm text-text-muted">
                    {tx.date}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {tx.status === "pending" && tx.type === "withdrawal" ? (
                        <>
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-caption font-medium bg-accent-green/20 text-accent-green hover:bg-accent-green/30 transition-all">
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-caption font-medium bg-accent-red/20 text-accent-red hover:bg-accent-red/30 transition-all">
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <button
                          className="p-2 rounded-lg text-text-muted hover:text-primary-glow hover:bg-primary-glow/10 transition-all"
                          title="View Details"
                        >
                          <Wallet className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTx.length === 0 && (
          <div className="py-16 text-center text-text-muted">
            No transactions in this category.
          </div>
        )}
      </motion.div>
    </div>
  );
}

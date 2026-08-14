"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  Plus,
  Minus,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

const mockTransactions = [
  {
    id: "1",
    type: "deposit",
    amount: 5000,
    status: "completed",
    date: "2024-01-15",
    method: "Demo Card",
    description: "Demo deposit",
  },
  {
    id: "2",
    type: "withdrawal",
    amount: -2000,
    status: "completed",
    date: "2024-01-14",
    method: "Demo Bank",
    description: "Demo withdrawal",
  },
  {
    id: "3",
    type: "win",
    amount: 1500,
    status: "completed",
    date: "2024-01-13",
    method: "Game Win",
    description: "Tournament prize",
  },
  {
    id: "4",
    type: "entry",
    amount: -500,
    status: "completed",
    date: "2024-01-12",
    method: "Entry Fee",
    description: "Quick Match entry",
  },
  {
    id: "5",
    type: "win",
    amount: 800,
    status: "completed",
    date: "2024-01-11",
    method: "Game Win",
    description: "vs AI victory",
  },
  {
    id: "6",
    type: "deposit",
    amount: 10000,
    status: "completed",
    date: "2024-01-10",
    method: "Demo Card",
    description: "Demo deposit",
  },
  {
    id: "7",
    type: "withdrawal",
    amount: -1000,
    status: "pending",
    date: "2024-01-15",
    method: "Demo Bank",
    description: "Demo withdrawal",
  },
];

export default function DashboardWalletPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "limits"
  >("overview");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    setIsLoading(true);
    // Simulate deposit
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    // In real app, this would open payment modal
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    // Simulate withdrawal
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  const formatAmount = (amount: number) => {
    const prefix = amount > 0 ? "+" : "";
    return `${prefix}${amount.toLocaleString()}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-accent-green";
      case "withdrawal":
        return "text-accent-red";
      case "win":
        return "text-accent-gold";
      case "entry":
        return "text-primary-glow";
      default:
        return "text-text-secondary";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-green/20 text-accent-green">
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-secondary-glow/20 text-secondary-glow">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-red/20 text-accent-red">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-caption font-medium bg-surface-tertiary text-text-muted">
            {status}
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
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="font-display text-display-md gradient-text">Wallet</h1>
          <p className="text-text-secondary mt-1">
            Manage your demo coins and transactions
          </p>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-strong p-6 md:p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/5 via-transparent to-accent-magenta/5" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-primary-glow" />
              <span className="font-medium text-text-secondary">
                Demo Balance
              </span>
              <Shield className="w-4 h-4 text-accent-green" />
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="font-display text-display-lg md:text-display-xl gradient-text"
            >
              12,345
            </motion.div>
            <div className="text-body-sm text-text-muted mt-2">
              Demo Coins · Not real currency
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDeposit}
              disabled={isLoading}
              className="btn-primary gap-2 px-6 py-3"
            >
              <Plus className="w-5 h-5" />
              <span>Deposit</span>
            </button>
            <button
              onClick={handleWithdraw}
              disabled={isLoading}
              className="btn-secondary gap-2 px-6 py-3"
            >
              <Minus className="w-5 h-5" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        <div className="border-b border-surface-border">
          <nav className="flex -mb-px" role="tablist">
            {[
              { id: "overview", label: "Overview", icon: Wallet },
              { id: "transactions", label: "Transactions", icon: History },
              { id: "limits", label: "Limits", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex items-center gap-2 px-6 py-4 text-body-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-primary-glow border-b-2 border-primary-glow bg-primary-glow/5"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Panels */}
        <div className="p-6" role="tabpanel">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Deposited",
                    value: "25,000",
                    color: "text-accent-green",
                    icon: ArrowUpRight,
                  },
                  {
                    label: "Total Withdrawn",
                    value: "8,000",
                    color: "text-accent-red",
                    icon: ArrowDownLeft,
                  },
                  {
                    label: "Game Winnings",
                    value: "18,500",
                    color: "text-accent-gold",
                    icon: Shield,
                  },
                  {
                    label: "Entry Fees Paid",
                    value: "3,200",
                    color: "text-primary-glow",
                    icon: History,
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card-hover p-5 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-text-secondary text-body-sm">
                          {stat.label}
                        </div>
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.2 + index * 0.1,
                            type: "spring",
                          }}
                          className={`font-display text-heading-lg ${stat.color}`}
                        >
                          {stat.value}
                        </motion.div>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-xl ${stat.color}/20 flex items-center justify-center`}
                      >
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Responsible Gaming */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-5 rounded-xl border border-accent-red/30 bg-accent-red/5"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-text-primary mb-1">
                      Responsible Gaming
                    </h3>
                    <p className="text-text-secondary text-body-sm">
                      Set deposit limits, session time limits, or self-exclude
                      if needed.
                      <span className="text-primary-glow font-medium">
                        Play responsibly.
                      </span>
                    </p>
                    <button className="btn-ghost mt-3 gap-2 text-body-sm">
                      <Shield className="w-4 h-4" />
                      Set Limits
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <select
                  className="input w-auto flex-1 min-w-[150px]"
                  defaultValue="all"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="win">Winnings</option>
                  <option value="entry">Entry Fees</option>
                </select>
                <select
                  className="input w-auto min-w-[150px]"
                  defaultValue="all"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <button className="btn-ghost gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              {/* Transaction List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-caption text-text-muted border-b border-surface-border">
                      <th className="pb-3 px-4">Date</th>
                      <th className="pb-3 px-4">Type</th>
                      <th className="pb-3 px-4">Amount</th>
                      <th className="pb-3 px-4">Method</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((tx, index) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-surface-border/50 hover:bg-surface-tertiary/50"
                      >
                        <td className="py-4 px-4 text-body-sm text-text-secondary">
                          {tx.date}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-caption font-medium ${
                              tx.type === "deposit"
                                ? "bg-accent-green/20 text-accent-green"
                                : tx.type === "withdrawal"
                                  ? "bg-accent-red/20 text-accent-red"
                                  : tx.type === "win"
                                    ? "bg-accent-gold/20 text-accent-gold"
                                    : "bg-primary-glow/20 text-primary-glow"
                            }`}
                          >
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </span>
                        </td>
                        <td
                          className="py-4 px-4 font-mono font-medium"
                          style={{ color: getTypeColor(tx.type) }}
                        >
                          {formatAmount(tx.amount)}
                        </td>
                        <td className="py-4 px-4 text-body-sm text-text-secondary">
                          {tx.method}
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="py-4 px-4 text-body-sm text-text-muted max-w-xs truncate">
                          {tx.description}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "limits" && (
            <div className="space-y-6">
              {/* Deposit Limits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-strong p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-heading-md">
                    Deposit Limits
                  </h2>
                  <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-green/20 text-accent-green">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      period: "Daily",
                      limit: "5,000",
                      used: "1,200",
                      color: "text-primary-glow",
                    },
                    {
                      period: "Weekly",
                      limit: "20,000",
                      used: "4,500",
                      color: "text-accent-cyan",
                    },
                    {
                      period: "Monthly",
                      limit: "50,000",
                      used: "12,000",
                      color: "text-accent-gold",
                    },
                  ].map((limit) => (
                    <div
                      key={limit.period}
                      className="glass-panel p-5 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-text-primary">
                          {limit.period} Limit
                        </span>
                        <span className="text-body-sm text-text-muted">
                          {(
                            (parseInt(limit.used.replace(",", "")) /
                              parseInt(limit.limit.replace(",", ""))) *
                            100
                          ).toFixed(0)}
                          % used
                        </span>
                      </div>
                      <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-primary-glow to-accent-cyan rounded-full"
                          style={{
                            width: `${(parseInt(limit.used.replace(",", "")) / parseInt(limit.limit.replace(",", ""))) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-body-sm text-text-muted">
                        ${limit.used} / ${limit.limit}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary w-full mt-4 gap-2">
                  <Shield className="w-4 h-4" />
                  Modify Limits
                </button>
              </motion.div>

              {/* Session Limits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card-strong p-6 rounded-2xl"
              >
                <h2 className="font-display text-heading-md mb-6">
                  Session Limits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Max Session Time", value: "2 hours", icon: "⏱️" },
                    {
                      label: "Break Reminder",
                      value: "Every 30 min",
                      icon: "🔔",
                    },
                    {
                      label: "Auto Logout",
                      value: "After 1 hour inactive",
                      icon: "🚪",
                    },
                    { label: "Cool-off Period", value: "24 hours", icon: "❄️" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="glass-panel p-4 rounded-xl flex items-center gap-4"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-medium text-text-primary">
                          {item.label}
                        </div>
                        <div className="text-text-secondary text-body-sm">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary w-full mt-4 gap-2">
                  <Shield className="w-4 h-4" />
                  Configure Session Limits
                </button>
              </motion.div>

              {/* Self Exclusion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card-strong p-6 rounded-2xl border border-accent-red/30 bg-accent-red/5"
              >
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-accent-red flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-display text-heading-sm text-accent-red mb-2">
                      Self-Exclusion
                    </h3>
                    <p className="text-text-secondary text-body-sm mb-4">
                      If you feel you need a break from gaming, you can
                      self-exclude for a period of time. During this period, you
                      won't be able to deposit, play, or access your account.
                    </p>
                    <button className="btn-ghost gap-2 text-accent-red hover:bg-accent-red/10 text-body-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Start Self-Exclusion
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

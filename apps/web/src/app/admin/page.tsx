"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Gamepad2,
  Coins,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Trophy,
  Ban,
  FileCheck,
  ArrowRight,
  Clock,
  UserPlus,
  Play,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const stats = [
  {
    label: "Total Users",
    value: "12,847",
    trend: "+8.2%",
    trendUp: true,
    icon: Users,
    color: "text-primary-glow",
    bg: "bg-primary-glow/20",
  },
  {
    label: "Active Matches",
    value: "342",
    trend: "+12.5%",
    trendUp: true,
    icon: Gamepad2,
    color: "text-accent-magenta",
    bg: "bg-accent-magenta/20",
  },
  {
    label: "Total Revenue",
    value: "8.4M",
    trend: "+5.7%",
    trendUp: true,
    icon: Coins,
    color: "text-secondary-glow",
    bg: "bg-secondary-glow/20",
    suffix: " coins",
  },
  {
    label: "Pending KYC",
    value: "23",
    trend: "-3.1%",
    trendUp: false,
    icon: ShieldCheck,
    color: "text-accent-red",
    bg: "bg-accent-red/20",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "user",
    message: "New user registered: gamerX2024",
    time: "2 min ago",
    icon: UserPlus,
    color: "text-primary-glow",
  },
  {
    id: 2,
    type: "match",
    message: "Match #4291 started between 4 players",
    time: "8 min ago",
    icon: Play,
    color: "text-accent-magenta",
  },
  {
    id: 3,
    type: "alert",
    message: "User flagged for suspicious activity: proGamer",
    time: "15 min ago",
    icon: AlertTriangle,
    color: "text-accent-red",
  },
  {
    id: 4,
    type: "match",
    message: "Match #4289 completed — prize pool 5,000 coins",
    time: "22 min ago",
    icon: CheckCircle,
    color: "text-accent-green",
  },
  {
    id: 5,
    type: "user",
    message: "KYC verified for user: championKing",
    time: "35 min ago",
    icon: ShieldCheck,
    color: "text-accent-green",
  },
  {
    id: 6,
    type: "match",
    message: "Match #4285 cancelled by admin",
    time: "1 hour ago",
    icon: Ban,
    color: "text-accent-red",
  },
  {
    id: 7,
    type: "user",
    message: "New user registered: diceRoller99",
    time: "1 hour ago",
    icon: UserPlus,
    color: "text-primary-glow",
  },
  {
    id: 8,
    type: "match",
    message: 'Tournament "Weekend Cup" registration opened',
    time: "2 hours ago",
    icon: Trophy,
    color: "text-secondary-glow",
  },
  {
    id: 9,
    type: "alert",
    message: "Failed withdrawal attempt by user: luckyOne",
    time: "3 hours ago",
    icon: AlertTriangle,
    color: "text-accent-red",
  },
  {
    id: 10,
    type: "user",
    message: "User banned: cheaterAccount",
    time: "4 hours ago",
    icon: Ban,
    color: "text-accent-red",
  },
];

const quickActions = [
  {
    label: "Create Tournament",
    href: "/admin/tournaments",
    icon: Trophy,
    color: "from-secondary-glow to-accent-orange",
  },
  {
    label: "Ban User",
    href: "/admin/users",
    icon: Ban,
    color: "from-accent-red to-accent-magenta",
  },
  {
    label: "Review KYC",
    href: "/admin/users",
    icon: FileCheck,
    color: "from-primary-glow to-accent-cyan",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-display-md gradient-text">
          Dashboard
        </h2>
        <p className="text-text-secondary mt-1">
          Platform overview and key metrics
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-hover p-6 rounded-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-caption font-medium ${
                  stat.trendUp ? "text-accent-green" : "text-accent-red"
                }`}
              >
                {stat.trendUp ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.trend}
              </div>
            </div>
            <div className="font-display text-display-sm text-text-primary">
              {stat.value}
              {stat.suffix && (
                <span className="text-body-sm text-text-muted ml-1">
                  {stat.suffix}
                </span>
              )}
            </div>
            <div className="text-body-sm text-text-secondary mt-1">
              {stat.label}
            </div>
            <div className="text-caption text-text-muted mt-2">
              from last week
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card-strong p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-heading-sm text-text-primary">
                Player Activity
              </h3>
              <p className="text-caption text-text-muted mt-0.5">
                Daily active players over the last 30 days
              </p>
            </div>
            <div className="flex items-center gap-2 text-caption text-text-muted">
              <Activity className="w-4 h-4 text-primary-glow" />
              Live
            </div>
          </div>
          {/* Chart Placeholder */}
          <div className="relative h-64 rounded-xl bg-surface-tertiary/50 overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-between gap-1 px-4 pb-4">
              {[40, 65, 55, 80, 70, 90, 75, 85, 60, 95, 88, 70, 82, 93, 78].map(
                (h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-primary-glow/30 to-primary-glow"
                    style={{ maxWidth: "20px" }}
                  />
                ),
              )}
            </div>
            <div className="absolute top-4 left-4 text-caption text-text-muted">
              Avg: 8,420 players/day
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card-strong p-6 rounded-2xl"
        >
          <h3 className="font-display text-heading-sm text-text-primary mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="glass-card-hover p-4 rounded-xl flex items-center gap-4 group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-body-sm font-medium text-text-primary flex-1">
                    {action.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-glow group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-surface-border">
            <h4 className="text-body-sm font-medium text-text-secondary mb-3">
              System Status
            </h4>
            <div className="space-y-2">
              {[
                { label: "Game Server", status: "Operational" },
                { label: "Payment Gateway", status: "Operational" },
                { label: "Matchmaking", status: "Operational" },
              ].map((sys) => (
                <div
                  key={sys.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-caption text-text-muted">
                    {sys.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-caption text-accent-green">
                      {sys.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card-strong p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-heading-sm text-text-primary">
            Recent Activity
          </h3>
          <span className="text-caption text-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last 10 events
          </span>
        </div>
        <div className="space-y-1">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-surface-tertiary/50 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center flex-shrink-0`}
              >
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <span className="text-body-sm text-text-primary flex-1">
                {activity.message}
              </span>
              <span className="text-caption text-text-muted flex-shrink-0">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

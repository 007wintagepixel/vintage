import Link from "next/link";
import {
  Users,
  Gamepad2,
  Trophy,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";

const stats = [
  {
    name: "Total Users",
    value: "12,345",
    change: "+12.5%",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    name: "Active Matches",
    value: "1,234",
    change: "+8.2%",
    icon: Gamepad2,
    color: "bg-green-500",
  },
  {
    name: "Tournaments",
    value: "56",
    change: "+3.1%",
    icon: Trophy,
    color: "bg-purple-500",
  },
  {
    name: "Revenue",
    value: "$45,678",
    change: "+15.7%",
    icon: DollarSign,
    color: "bg-orange-500",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "New User",
    description: "John Doe registered",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "Match Started",
    description: "Match #12345 started",
    time: "5 min ago",
  },
  {
    id: 3,
    type: "Tournament Created",
    description: "Weekly Championship",
    time: "15 min ago",
  },
  {
    id: 4,
    type: "Transaction",
    description: "Prize payout $500",
    time: "1 hour ago",
  },
  {
    id: 5,
    type: "User Banned",
    description: "User #987 banned for cheating",
    time: "2 hours ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Overview of your Ludo Nexus platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700">
            Export Report
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={`/${stat.name.toLowerCase().replace(" ", "")}`}
            className="block"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stat.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Overview
            </h2>
            <select className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chart placeholder - integrate with Recharts or Chart.js</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <Activity className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/audit"
            className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Activity →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/users/new"
            className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-center"
          >
            <Users className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">
              Add User
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create new user account
            </p>
          </Link>
          <Link
            href="/matches/new"
            className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-center"
          >
            <Gamepad2 className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">
              Create Match
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Set up a new match
            </p>
          </Link>
          <Link
            href="/tournaments/new"
            className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-center"
          >
            <Trophy className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">
              New Tournament
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Launch a tournament
            </p>
          </Link>
          <Link
            href="/transactions/new"
            className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-center"
          >
            <DollarSign className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">
              Process Refund
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Handle refund request
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

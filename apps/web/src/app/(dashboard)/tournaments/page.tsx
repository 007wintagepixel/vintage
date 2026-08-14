"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Star,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

const mockTournaments = [
  {
    id: "1",
    name: "Weekend Warriors Cup",
    status: "upcoming",
    startDate: "2024-01-20",
    endDate: "2024-01-21",
    players: 64,
    maxPlayers: 128,
    entryFee: 1000,
    prizePool: 50000,
    format: "Single Elimination",
    registered: true,
    checkedIn: false,
    currentRound: null,
  },
  {
    id: "2",
    name: "New Year Championship",
    status: "live",
    startDate: "2024-01-15",
    endDate: "2024-01-18",
    players: 32,
    maxPlayers: 32,
    entryFee: 5000,
    prizePool: 100000,
    format: "Double Elimination",
    registered: true,
    checkedIn: true,
    currentRound: "Quarter Finals",
  },
  {
    id: "3",
    name: "Beginner's Luck Open",
    status: "upcoming",
    startDate: "2024-01-27",
    endDate: "2024-01-28",
    players: 16,
    maxPlayers: 64,
    entryFee: 0,
    prizePool: 10000,
    format: "Swiss",
    registered: false,
    checkedIn: false,
    currentRound: null,
  },
  {
    id: "4",
    name: "Pro League Season 3",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-01-10",
    players: 16,
    maxPlayers: 16,
    entryFee: 25000,
    prizePool: 200000,
    format: "Round Robin",
    registered: true,
    checkedIn: true,
    currentRound: "Completed",
    position: 3,
    winnings: 15000,
  },
  {
    id: "5",
    name: "Daily Quick Cup",
    status: "upcoming",
    startDate: "2024-01-16",
    endDate: "2024-01-16",
    players: 8,
    maxPlayers: 16,
    entryFee: 500,
    prizePool: 5000,
    format: "Single Elimination",
    registered: false,
    checkedIn: false,
    currentRound: null,
  },
  {
    id: "6",
    name: "Team Battle Royale",
    status: "upcoming",
    startDate: "2024-02-03",
    endDate: "2024-02-04",
    players: 24,
    maxPlayers: 32,
    entryFee: 2000,
    prizePool: 30000,
    format: "Team 2v2",
    registered: false,
    checkedIn: false,
    currentRound: null,
  },
];

export default function DashboardTournamentsPage() {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "live" | "completed" | "my"
  >("upcoming");
  const [filter, setFilter] = useState<"all" | "free" | "paid" | "team">("all");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          color: "text-primary-glow",
          bg: "bg-primary-glow/20",
          icon: Calendar,
          label: "Upcoming",
        };
      case "live":
        return {
          color: "text-accent-green",
          bg: "bg-accent-green/20",
          icon: Play,
          label: "Live Now",
        };
      case "completed":
        return {
          color: "text-secondary-glow",
          bg: "bg-secondary-glow/20",
          icon: CheckCircle,
          label: "Completed",
        };
      default:
        return {
          color: "text-text-muted",
          bg: "bg-surface-tertiary",
          icon: AlertCircle,
          label: "Unknown",
        };
    }
  };

  const filteredTournaments = mockTournaments
    .filter((t) => {
      if (activeTab === "upcoming") return t.status === "upcoming";
      if (activeTab === "live") return t.status === "live";
      if (activeTab === "completed") return t.status === "completed";
      if (activeTab === "my") return t.registered;
      return true;
    })
    .filter((t) => {
      if (filter === "free") return t.entryFee === 0;
      if (filter === "paid") return t.entryFee > 0;
      if (filter === "team") return t.format.includes("Team");
      return true;
    });

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
            Tournaments
          </h1>
          <p className="text-text-secondary mt-1">
            Compete for glory and massive prize pools
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Upcoming",
            value: mockTournaments.filter((t) => t.status === "upcoming")
              .length,
            icon: Calendar,
            color: "text-primary-glow",
          },
          {
            label: "Live Now",
            value: mockTournaments.filter((t) => t.status === "live").length,
            icon: Play,
            color: "text-accent-green",
          },
          {
            label: "My Tournaments",
            value: mockTournaments.filter((t) => t.registered).length,
            icon: Trophy,
            color: "text-accent-gold",
          },
          {
            label: "Total Won",
            value: mockTournaments.filter(
              (t) => t.status === "completed" && t.registered,
            ).length,
            icon: Star,
            color: "text-secondary-glow",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="glass-card-hover p-6 rounded-2xl text-center"
          >
            <div
              className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${stat.color}/20`}
            >
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
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

      {/* Tabs & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card-strong rounded-2xl overflow-hidden"
      >
        <div className="border-b border-surface-border">
          <nav className="flex -mb-px" role="tablist">
            {[
              { id: "upcoming", label: "Upcoming", icon: Calendar },
              { id: "live", label: "Live", icon: Play },
              { id: "completed", label: "Completed", icon: CheckCircle },
              { id: "my", label: "My Tournaments", icon: Trophy },
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

        {/* Filters */}
        <div className="p-4 border-b border-surface-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "free", label: "Free Entry" },
              { id: "paid", label: "Paid" },
              { id: "team", label: "Team Events" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={`px-4 py-2 rounded-xl text-body-sm font-medium transition-all ${
                  filter === f.id
                    ? "bg-primary-glow/20 text-primary-glow border border-primary-glow/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tournament List */}
        <div className="p-6" role="tabpanel">
          {filteredTournaments.length === 0 ? (
            <div className="glass-card-strong p-12 rounded-2xl text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-text-muted/50" />
              <h3 className="font-display text-heading-md mb-2">
                No tournaments found
              </h3>
              <p className="text-text-secondary text-body">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTournaments.map((tournament, index) => {
                const statusConfig = getStatusConfig(tournament.status);
                const StatusIcon = statusConfig.icon;
                const isRegistered = tournament.registered;
                // const canCheckIn =
                //   tournament.status === "upcoming" &&
                //   isRegistered &&
                //   !tournament.checkedIn;
                // const isLive = tournament.status === "live";
                // const isCompleted = tournament.status === "completed";

                return (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glass-card-hover p-5 rounded-2xl ${isRegistered ? "ring-1 ring-primary-glow/30" : ""}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Status & Basic Info */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-xl ${statusConfig.bg} flex items-center justify-center`}
                          >
                            <StatusIcon
                              className={`w-5 h-5 ${statusConfig.color}`}
                            />
                          </div>
                          <div>
                            <h3 className="font-display text-heading-md text-text-primary">
                              {tournament.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-caption font-medium ${statusConfig.bg} ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-body-sm text-text-muted mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{" "}
                            {tournament.startDate} - {tournament.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {tournament.players}/
                            {tournament.maxPlayers}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {tournament.format}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-body-sm">
                          <span className="text-accent-gold font-display">
                            {tournament.prizePool.toLocaleString()} coins
                          </span>
                          <span className="text-text-muted">Prize Pool</span>
                          {tournament.entryFee > 0 && (
                            <>
                              <span className="text-primary-glow font-display">
                                {tournament.entryFee.toLocaleString()} coins
                              </span>
                              <span className="text-text-muted">Entry</span>
                            </>
                          )}{" "}
                          {tournament.entryFee === 0 && (
                            <span className="px-2 py-1 rounded-full text-caption font-medium bg-accent-green/20 text-accent-green">
                              FREE ENTRY
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress / Bracket */}
                      <div className="md:col-span-4 md:col-start-4 md:col-end-8 hidden md:block">
                        {tournament.status === "live" && (
                          <div className="glass-panel p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-text-primary">
                                Current Round
                              </span>
                              <span className="px-2 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow animate-pulse">
                                {tournament.currentRound}
                              </span>
                            </div>
                            <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-glow to-accent-cyan rounded-full"
                                style={{ width: "65%" }}
                              />
                            </div>
                            <div className="text-body-sm text-text-muted mt-2 text-center">
                              Match in progress...
                            </div>
                          </div>
                        )}
                        {tournament.status === "upcoming" && (
                          <div className="glass-panel p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-text-primary">
                                Registration
                              </span>
                              <span className="px-2 py-1 rounded-full text-caption font-medium bg-primary-glow/20 text-primary-glow">
                                {Math.round(
                                  (tournament.players / tournament.maxPlayers) *
                                    100,
                                )}
                                % Full
                              </span>
                            </div>
                            <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-glow to-accent-cyan rounded-full"
                                style={{
                                  width: `${Math.round((tournament.players / tournament.maxPlayers) * 100)}%`,
                                }}
                              />
                            </div>
                            <div className="text-body-sm text-text-muted mt-2 text-center">
                              {tournament.players} / {tournament.maxPlayers}{" "}
                              players
                            </div>
                          </div>
                        )}
                        {tournament.status === "completed" &&
                          isRegistered &&
                          tournament.position && (
                            <div className="glass-panel p-4 rounded-xl text-center">
                              <div className="text-4xl font-display text-accent-gold mb-2">
                                #{tournament.position}
                              </div>
                              <div className="text-text-secondary mb-2">
                                You placed #{tournament.position}!
                              </div>
                              <div className="text-accent-green font-display text-heading-lg">
                                +{tournament.winnings.toLocaleString()} coins
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-12 md:col-start-1 flex flex-wrap gap-3 pt-4 border-t border-surface-border">
                        {tournament.status === "live" && isRegistered && (
                          <button
                            className="btn-primary flex-1 md:flex-none gap-2"
                            disabled={!tournament.checkedIn}
                          >
                            <Play className="w-4 h-4" />
                            {tournament.checkedIn
                              ? "Join Match"
                              : "Check In Required"}
                          </button>
                        )}
                        {tournament.status === "upcoming" &&
                          !isRegistered &&
                          tournament.players < tournament.maxPlayers && (
                            <button className="btn-primary flex-1 md:flex-none gap-2">
                              <Star className="w-4 h-4" />
                              {tournament.entryFee === 0
                                ? "Register Free"
                                : `Register (${tournament.entryFee.toLocaleString()} coins)`}
                            </button>
                          )}
                        {isRegistered && tournament.status === "upcoming" && (
                          <>
                            {!tournament.checkedIn && (
                              <button className="btn-secondary flex-1 md:flex-none gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Check In
                              </button>
                            )}
                            <button className="btn-ghost flex-1 md:flex-none gap-2 text-accent-red hover:bg-accent-red/10">
                              <XCircle className="w-4 h-4" />
                              Withdraw
                            </button>
                          </>
                        )}
                        {isRegistered &&
                          (tournament.status === "live" ||
                            tournament.status === "completed") && (
                            <button className="btn-ghost gap-2">
                              <Trophy className="w-4 h-4" />
                              View Bracket
                            </button>
                          )}
                        {!isRegistered &&
                          tournament.status !== "live" &&
                          tournament.status !== "completed" && (
                            <button className="btn-ghost gap-2">
                              <MoreVertical className="w-4 h-4" />
                              Details
                            </button>
                          )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  History,
  Clock,
  Users,
  Coins,
  ChevronDown,
  Trophy,
  Zap,
  Target,
} from "lucide-react";
import { useState } from "react";

type Filter = "all" | "wins" | "losses" | "tournaments";

interface Match {
  id: string;
  date: string;
  time: string;
  mode: "Classic 1v1" | "Classic 4P" | "Quick 1v1" | "Tournament" | "Team 2v2";
  result: "win" | "loss";
  duration: string;
  opponents: string[];
  tokensCaptured: number;
  coinsWon: number;
  ratingChange: number;
  isTournament: boolean;
  details: {
    finalPosition: number;
    totalPlayers: number;
    captures: number;
    timesCaptured: number;
  };
}

const mockMatches: Match[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "14:32",
    mode: "Tournament",
    result: "win",
    duration: "12:45",
    opponents: ["NeonStriker", "VoidWalker", "CyberRogue"],
    tokensCaptured: 8,
    coinsWon: 1500,
    ratingChange: 32,
    isTournament: true,
    details: {
      finalPosition: 1,
      totalPlayers: 4,
      captures: 8,
      timesCaptured: 1,
    },
  },
  {
    id: "2",
    date: "2024-01-15",
    time: "13:10",
    mode: "Classic 1v1",
    result: "win",
    duration: "08:22",
    opponents: ["PixelPhantom"],
    tokensCaptured: 4,
    coinsWon: 250,
    ratingChange: 18,
    isTournament: false,
    details: {
      finalPosition: 1,
      totalPlayers: 2,
      captures: 4,
      timesCaptured: 0,
    },
  },
  {
    id: "3",
    date: "2024-01-15",
    time: "11:45",
    mode: "Classic 4P",
    result: "loss",
    duration: "15:30",
    opponents: ["AstroBlitz", "ShadowByte", "GlitchKing"],
    tokensCaptured: 2,
    coinsWon: -100,
    ratingChange: -12,
    isTournament: false,
    details: {
      finalPosition: 3,
      totalPlayers: 4,
      captures: 2,
      timesCaptured: 5,
    },
  },
  {
    id: "4",
    date: "2024-01-14",
    time: "22:15",
    mode: "Quick 1v1",
    result: "win",
    duration: "05:12",
    opponents: ["NovaQueen"],
    tokensCaptured: 4,
    coinsWon: 100,
    ratingChange: 15,
    isTournament: false,
    details: {
      finalPosition: 1,
      totalPlayers: 2,
      captures: 4,
      timesCaptured: 1,
    },
  },
  {
    id: "5",
    date: "2024-01-14",
    time: "20:30",
    mode: "Team 2v2",
    result: "win",
    duration: "14:18",
    opponents: ["FrostByte", "EmberFury"],
    tokensCaptured: 6,
    coinsWon: 400,
    ratingChange: 22,
    isTournament: false,
    details: {
      finalPosition: 1,
      totalPlayers: 4,
      captures: 6,
      timesCaptured: 2,
    },
  },
  {
    id: "6",
    date: "2024-01-14",
    time: "18:00",
    mode: "Classic 4P",
    result: "loss",
    duration: "18:45",
    opponents: ["StormRider", "ChromeAce", "BlazeRunner"],
    tokensCaptured: 1,
    coinsWon: -100,
    ratingChange: -15,
    isTournament: false,
    details: {
      finalPosition: 4,
      totalPlayers: 4,
      captures: 1,
      timesCaptured: 7,
    },
  },
  {
    id: "7",
    date: "2024-01-14",
    time: "15:20",
    mode: "Tournament",
    result: "win",
    duration: "10:30",
    opponents: ["DarkMatter", "HoloHunter"],
    tokensCaptured: 7,
    coinsWon: 800,
    ratingChange: 28,
    isTournament: true,
    details: {
      finalPosition: 1,
      totalPlayers: 4,
      captures: 7,
      timesCaptured: 2,
    },
  },
  {
    id: "8",
    date: "2024-01-13",
    time: "21:00",
    mode: "Classic 1v1",
    result: "win",
    duration: "09:15",
    opponents: ["RiftWalker"],
    tokensCaptured: 4,
    coinsWon: 250,
    ratingChange: 16,
    isTournament: false,
    details: {
      finalPosition: 1,
      totalPlayers: 2,
      captures: 4,
      timesCaptured: 1,
    },
  },
  {
    id: "9",
    date: "2024-01-13",
    time: "19:30",
    mode: "Classic 4P",
    result: "loss",
    duration: "16:22",
    opponents: ["Synthwave", "EchoBlade", "QuantumKnight"],
    tokensCaptured: 3,
    coinsWon: -100,
    ratingChange: -18,
    isTournament: false,
    details: {
      finalPosition: 3,
      totalPlayers: 4,
      captures: 3,
      timesCaptured: 4,
    },
  },
  {
    id: "10",
    date: "2024-01-13",
    time: "17:45",
    mode: "Quick 1v1",
    result: "win",
    duration: "06:30",
    opponents: ["NeonStriker"],
    tokensCaptured: 4,
    coinsWon: 100,
    ratingChange: 14,
    isTournament: false,
    details: {
      finalPosition: 1,
      totalPlayers: 2,
      captures: 4,
      timesCaptured: 0,
    },
  },
  {
    id: "11",
    date: "2024-01-12",
    time: "23:15",
    mode: "Team 2v2",
    result: "loss",
    duration: "13:40",
    opponents: ["VoidWalker", "CyberRogue"],
    tokensCaptured: 2,
    coinsWon: -200,
    ratingChange: -20,
    isTournament: false,
    details: {
      finalPosition: 2,
      totalPlayers: 4,
      captures: 2,
      timesCaptured: 5,
    },
  },
  {
    id: "12",
    date: "2024-01-12",
    time: "20:00",
    mode: "Tournament",
    result: "win",
    duration: "11:20",
    opponents: ["PixelPhantom", "AstroBlitz", "ShadowByte"],
    tokensCaptured: 8,
    coinsWon: 1200,
    ratingChange: 30,
    isTournament: true,
    details: {
      finalPosition: 1,
      totalPlayers: 4,
      captures: 8,
      timesCaptured: 1,
    },
  },
  {
    id: "13",
    date: "2024-01-12",
    time: "16:30",
    mode: "Classic 1v1",
    result: "loss",
    duration: "10:05",
    opponents: ["GlitchKing"],
    tokensCaptured: 2,
    coinsWon: -250,
    ratingChange: -14,
    isTournament: false,
    details: {
      finalPosition: 2,
      totalPlayers: 2,
      captures: 2,
      timesCaptured: 4,
    },
  },
  {
    id: "14",
    date: "2024-01-11",
    time: "22:00",
    mode: "Classic 4P",
    result: "win",
    duration: "14:55",
    opponents: ["NovaQueen", "FrostByte", "EmberFury"],
    tokensCaptured: 6,
    coinsWon: 300,
    ratingChange: 20,
    isTournament: false,
    details: {
      finalPosition: 1,
      totalPlayers: 4,
      captures: 6,
      timesCaptured: 2,
    },
  },
  {
    id: "15",
    date: "2024-01-11",
    time: "18:45",
    mode: "Quick 1v1",
    result: "win",
    duration: "04:48",
    opponents: ["StormRider"],
    tokensCaptured: 4,
    coinsWon: 100,
    ratingChange: 12,
    isTournament: false,
    details: {
      finalPosition: 1,
      totalPlayers: 2,
      captures: 4,
      timesCaptured: 0,
    },
  },
];

export default function MatchHistoryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredMatches = mockMatches.filter((m) => {
    if (filter === "wins") return m.result === "win";
    if (filter === "losses") return m.result === "loss";
    if (filter === "tournaments") return m.isTournament;
    return true;
  });

  const wins = mockMatches.filter((m) => m.result === "win").length;
  const losses = mockMatches.filter((m) => m.result === "loss").length;
  const winRate = Math.round((wins / mockMatches.length) * 100);

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
            Match History
          </h1>
          <p className="text-text-secondary mt-1">
            Review your past battles and track your progress
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
            label: "Total Matches",
            value: mockMatches.length,
            icon: History,
            color: "text-primary-glow",
          },
          {
            label: "Wins",
            value: wins,
            icon: Trophy,
            color: "text-accent-green",
          },
          {
            label: "Losses",
            value: losses,
            icon: Target,
            color: "text-accent-red",
          },
          {
            label: "Win Rate",
            value: `${winRate}%`,
            icon: Zap,
            color: "text-secondary-glow",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="glass-card-hover p-6 rounded-2xl text-center"
          >
            <div
              className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${stat.color}/20`}
            >
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div className="font-display text-display-sm md:text-display-md">
              {stat.value}
            </div>
            <div className="text-text-secondary text-body-sm mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2"
      >
        {[
          { id: "all" as Filter, label: "All" },
          { id: "wins" as Filter, label: "Wins" },
          { id: "losses" as Filter, label: "Losses" },
          { id: "tournaments" as Filter, label: "Tournaments" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-body-sm font-medium transition-all ${
              filter === tab.id
                ? "bg-primary-glow/20 text-primary-glow border border-primary-glow/30"
                : "glass-card text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Match List */}
      <div className="space-y-3">
        {filteredMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.04 }}
            className="glass-card-hover rounded-2xl overflow-hidden"
          >
            {/* Match Header */}
            <button
              onClick={() =>
                setExpandedId(expandedId === match.id ? null : match.id)
              }
              className="w-full p-5 flex items-center gap-4 text-left"
            >
              {/* Result Indicator */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  match.result === "win"
                    ? "bg-accent-green/20"
                    : "bg-accent-red/20"
                }`}
              >
                <span
                  className={`font-display text-heading-sm ${match.result === "win" ? "text-accent-green" : "text-accent-red"}`}
                >
                  {match.result === "win" ? "W" : "L"}
                </span>
              </div>

              {/* Match Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-text-primary">
                    {match.mode}
                  </span>
                  {match.isTournament && (
                    <span className="px-2 py-0.5 rounded-full text-caption font-medium bg-secondary-glow/20 text-secondary-glow">
                      TOURNAMENT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-body-sm text-text-muted mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {match.date} {match.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {match.opponents.length + 1}P
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {match.duration}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <div className="text-body-sm text-text-muted">Tokens</div>
                  <div className="font-display text-text-primary flex items-center gap-1">
                    <Target className="w-3 h-3 text-primary-glow" />{" "}
                    {match.tokensCaptured}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-body-sm text-text-muted">Coins</div>
                  <div
                    className={`font-display flex items-center gap-1 ${match.coinsWon >= 0 ? "text-accent-green" : "text-accent-red"}`}
                  >
                    <Coins className="w-3 h-3" />{" "}
                    {match.coinsWon >= 0 ? "+" : ""}
                    {match.coinsWon}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-body-sm text-text-muted">Rating</div>
                  <div
                    className={`font-display ${match.ratingChange >= 0 ? "text-accent-green" : "text-accent-red"}`}
                  >
                    {match.ratingChange >= 0 ? "+" : ""}
                    {match.ratingChange}
                  </div>
                </div>
              </div>

              <ChevronDown
                className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ${expandedId === match.id ? "rotate-180" : ""}`}
              />
            </button>

            {/* Expandable Details */}
            {expandedId === match.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="border-t border-surface-border p-5"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 rounded-xl">
                    <div className="text-body-sm text-text-muted mb-1">
                      Final Position
                    </div>
                    <div className="font-display text-heading-md text-text-primary">
                      #{match.details.finalPosition}
                      <span className="text-body-sm text-text-muted">
                        {" "}
                        / {match.details.totalPlayers}
                      </span>
                    </div>
                  </div>
                  <div className="glass-panel p-4 rounded-xl">
                    <div className="text-body-sm text-text-muted mb-1">
                      Tokens Captured
                    </div>
                    <div className="font-display text-heading-md text-primary-glow flex items-center gap-2">
                      <Target className="w-4 h-4" /> {match.details.captures}
                    </div>
                  </div>
                  <div className="glass-panel p-4 rounded-xl">
                    <div className="text-body-sm text-text-muted mb-1">
                      Times Captured
                    </div>
                    <div className="font-display text-heading-md text-accent-red flex items-center gap-2">
                      <Zap className="w-4 h-4" /> {match.details.timesCaptured}
                    </div>
                  </div>
                  <div className="glass-panel p-4 rounded-xl">
                    <div className="text-body-sm text-text-muted mb-1">
                      Duration
                    </div>
                    <div className="font-display text-heading-md text-text-primary flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {match.duration}
                    </div>
                  </div>
                </div>

                {/* Opponents */}
                <div className="mt-4">
                  <div className="text-body-sm text-text-muted mb-2">
                    Opponents
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {match.opponents.map((opp) => (
                      <span
                        key={opp}
                        className="px-3 py-1.5 rounded-xl glass-panel text-body-sm text-text-secondary flex items-center gap-2"
                      >
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center text-caption font-bold text-background">
                          {opp.slice(0, 2).toUpperCase()}
                        </div>
                        {opp}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

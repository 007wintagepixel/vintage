"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Swords,
  Users,
  User,
  Crown,
  X,
  Loader2,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Activity,
} from "lucide-react";

type GameMode = "1v1" | "2v2" | "4player";

const gameModes: {
  id: GameMode;
  label: string;
  players: string;
  icon: typeof User;
  description: string;
}[] = [
  {
    id: "1v1",
    label: "1 v 1",
    players: "2 players",
    icon: User,
    description: "Head-to-head duel",
  },
  {
    id: "2v2",
    label: "2 v 2",
    players: "4 players",
    icon: Users,
    description: "Team battle",
  },
  {
    id: "4player",
    label: "Free-for-All",
    players: "4 players",
    icon: Crown,
    description: "Last one standing",
  },
];

export default function MatchmakingPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode>("1v1");
  const [isSearching, setIsSearching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [queueTime, setQueueTime] = useState(0);
  const [matchId, setMatchId] = useState<string>("");

  const playersInQueue = 247;
  const estimatedWait = "~15 seconds";

  useEffect(() => {
    if (!isSearching) {
      setQueueTime(0);
      return;
    }
    const interval = setInterval(() => {
      setQueueTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSearching]);

  // Simulate finding a match after ~8 seconds
  useEffect(() => {
    if (!isSearching) return;
    const timer = setTimeout(() => {
      setMatched(true);
      setIsSearching(false);
      setMatchId(`match-${Math.random().toString(36).substring(2, 10)}`);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isSearching]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleStartSearch = () => {
    setMatched(false);
    setIsSearching(true);
  };

  const handleCancel = () => {
    setIsSearching(false);
    setMatched(false);
    setQueueTime(0);
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
          <h1 className="font-display text-display-md gradient-text">
            Finding Opponents
          </h1>
          <p className="text-text-secondary mt-1">
            Jump into a match with players of your skill level
          </p>
        </div>
        <div className="glass-card px-4 py-3 rounded-xl flex items-center gap-3">
          <Activity className="w-5 h-5 text-accent-green animate-pulse" />
          <div>
            <div className="text-body-sm font-medium text-text-primary">
              {playersInQueue} in queue
            </div>
            <div className="text-caption text-text-muted">
              Live players online
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Match Found State */}
        {matched && (
          <motion.div
            key="matched"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel-strong rounded-2xl p-8 md:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-green to-primary-glow flex items-center justify-center shadow-glow"
            >
              <CheckCircle2 className="w-12 h-12 text-text-inverse" />
            </motion.div>
            <h2 className="font-display text-display-sm gradient-text mb-3">
              Opponent Found!
            </h2>
            <p className="text-text-secondary text-body-lg mb-8">
              A player has been matched with you. Get ready to play!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/game/${matchId}`}
                className="btn-primary gap-2 text-body-lg px-8 py-4"
              >
                <Swords className="w-5 h-5" />
                Join Match
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button onClick={handleCancel} className="btn-ghost gap-2">
                <X className="w-4 h-4" />
                Decline
              </button>
            </div>
          </motion.div>
        )}

        {/* Searching / Idle State */}
        {!matched && (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Mode Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-strong rounded-2xl p-6"
            >
              <h2 className="font-display text-heading-md mb-6">
                Select Game Mode
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gameModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => !isSearching && setSelectedMode(mode.id)}
                    disabled={isSearching}
                    className={`glass-card-hover p-6 rounded-2xl text-left transition-all ${
                      selectedMode === mode.id
                        ? "border-primary-glow shadow-glow bg-primary-glow/5"
                        : ""
                    } ${isSearching ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedMode === mode.id
                            ? "bg-gradient-to-br from-primary-glow to-accent-magenta"
                            : "bg-surface-tertiary"
                        }`}
                      >
                        <mode.icon
                          className={`w-6 h-6 ${
                            selectedMode === mode.id
                              ? "text-text-inverse"
                              : "text-text-secondary"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-display text-heading-sm text-text-primary">
                          {mode.label}
                        </div>
                        <div className="text-caption text-text-muted">
                          {mode.players}
                        </div>
                      </div>
                    </div>
                    <p className="text-body-sm text-text-secondary">
                      {mode.description}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Queue Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-strong rounded-2xl p-8 text-center relative overflow-hidden"
            >
              {isSearching && (
                <>
                  {/* Animated radar background */}
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-primary-glow"
                  />
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5,
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-primary-glow"
                  />
                  <motion.div
                    animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 1,
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-primary-glow"
                  />
                </>
              )}

              <motion.div
                animate={isSearching ? { scale: [1, 1.1, 1] } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isSearching ? Infinity : 0,
                }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center shadow-glow relative z-10"
              >
                {isSearching ? (
                  <Loader2 className="w-12 h-12 text-text-inverse animate-spin" />
                ) : (
                  <Swords className="w-12 h-12 text-text-inverse" />
                )}
              </motion.div>

              <h2 className="font-display text-heading-lg mb-2 relative z-10">
                {isSearching ? "Searching for opponents..." : "Ready to Play"}
              </h2>
              <p className="text-text-secondary text-body relative z-10 mb-6">
                {isSearching
                  ? `Mode: ${gameModes.find((m) => m.id === selectedMode)?.label}`
                  : "Pick a game mode and start matchmaking"}
              </p>

              {/* Queue Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8 relative z-10">
                <div className="glass-card p-4 rounded-xl">
                  <Users className="w-5 h-5 text-primary-glow mx-auto mb-2" />
                  <div className="font-display text-heading-md">
                    {playersInQueue}
                  </div>
                  <div className="text-caption text-text-muted">In Queue</div>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <Clock className="w-5 h-5 text-secondary-glow mx-auto mb-2" />
                  <div className="font-display text-heading-md">
                    {isSearching ? formatTime(queueTime) : estimatedWait}
                  </div>
                  <div className="text-caption text-text-muted">
                    {isSearching ? "Elapsed" : "Est. Wait"}
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <Zap className="w-5 h-5 text-accent-magenta mx-auto mb-2" />
                  <div className="font-display text-heading-md">Fast</div>
                  <div className="text-caption text-text-muted">
                    Match Speed
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10">
                {isSearching ? (
                  <button
                    onClick={handleCancel}
                    className="btn-danger gap-2 px-8 py-4 text-body-lg"
                  >
                    <X className="w-5 h-5" />
                    Cancel Search
                  </button>
                ) : (
                  <button
                    onClick={handleStartSearch}
                    className="btn-primary gap-2 px-8 py-4 text-body-lg"
                  >
                    <Swords className="w-5 h-5" />
                    Start Matchmaking
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="font-display text-heading-sm mb-4 text-text-secondary">
          Matchmaking Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              text: "Queue during peak hours for faster matches",
              color: "text-primary-glow",
            },
            {
              icon: Crown,
              text: "Win streaks increase your MMR and rewards",
              color: "text-secondary-glow",
            },
            {
              icon: Users,
              text: "Invite friends to skip the queue entirely",
              color: "text-accent-magenta",
            },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <tip.icon
                className={`w-5 h-5 mt-0.5 ${tip.color} flex-shrink-0`}
              />
              <p className="text-body-sm text-text-secondary">{tip.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DoorOpen,
  ArrowLeft,
  Ticket,
  Users,
  Clock,
  Coins,
  Lock,
  Globe,
  ArrowRight,
  History,
  AlertCircle,
  KeyRound,
} from "lucide-react";

const recentRooms = [
  {
    code: "XK7M2P",
    name: "Friday Night Ludo",
    host: "PlayerTwo",
    players: 3,
    maxPlayers: 4,
    mode: "classic",
    entryFee: 100,
    privacy: "private" as const,
    playedAt: "2 hours ago",
  },
  {
    code: "Q9RT4B",
    name: "Quick Duel",
    host: "PlayerThree",
    players: 2,
    maxPlayers: 2,
    mode: "quick",
    entryFee: 250,
    privacy: "private" as const,
    playedAt: "Yesterday",
  },
  {
    code: "LM3Z8N",
    name: "Championship Round",
    host: "PlayerFour",
    players: 4,
    maxPlayers: 4,
    mode: "classic",
    entryFee: 500,
    privacy: "private" as const,
    playedAt: "3 days ago",
  },
];

export default function JoinRoomPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    const code = roomCode.trim().toUpperCase();
    if (!code) {
      setError("Please enter a room code");
      return;
    }
    if (code.length < 4 || code.length > 8) {
      setError("Room code must be 4-8 characters");
      return;
    }
    if (!/^[A-Z0-9]+$/.test(code)) {
      setError("Room code can only contain letters and numbers");
      return;
    }
    setError("");
    router.push(`/room/${code}`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRoomCode(text.trim().toUpperCase().slice(0, 8));
    } catch {
      // Clipboard API may not be available
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
          <h1 className="font-display text-display-md gradient-text">
            Join Room
          </h1>
          <p className="text-text-secondary mt-1">
            Enter a room code to join a private match
          </p>
        </div>
        <Link href="/game-modes" className="btn-ghost gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Game Modes
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Join Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-strong rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-glow to-accent-magenta flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-text-inverse" />
            </div>
            <div>
              <h2 className="font-display text-heading-md">Enter Room Code</h2>
              <p className="text-body-sm text-text-muted">
                Ask the host for the 6-digit code
              </p>
            </div>
          </div>

          <label className="label">Room Code</label>
          <div className="relative">
            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="e.g. XK7M2P"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase().slice(0, 8));
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className={`input pl-12 text-heading-md font-display tracking-widest uppercase ${
                error ? "input-error" : ""
              }`}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 mt-3 text-body-sm text-accent-red"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePaste}
              className="btn-ghost gap-2 text-body-sm"
            >
              Paste Code
            </button>
            <button onClick={handleJoin} className="btn-primary flex-1 gap-2">
              Join Room
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 p-4 glass-card rounded-xl">
            <p className="text-body-sm text-text-secondary">
              <Lock className="w-4 h-4 inline-block mr-2 text-accent-magenta" />
              Private rooms require a valid code from the host. Public rooms can
              be found via matchmaking.
            </p>
          </div>
        </motion.div>

        {/* Recent Rooms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-strong rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-secondary-glow" />
            <h2 className="font-display text-heading-md">Recent Rooms</h2>
          </div>

          <div className="space-y-3">
            {recentRooms.map((room, index) => (
              <motion.div
                key={room.code}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={`/room/${room.code}`}
                  className="glass-card-hover p-4 rounded-2xl block hover:border-primary-glow transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-display text-heading-sm text-text-primary group-hover:text-primary-glow transition-colors">
                        {room.name}
                      </div>
                      <div className="text-caption text-text-muted mt-1">
                        Hosted by {room.host} • {room.playedAt}
                      </div>
                    </div>
                    <div className="font-display text-heading-sm gradient-text tracking-wider">
                      {room.code}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-body-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {room.players}/{room.maxPlayers}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <Clock className="w-3.5 h-3.5" />
                      {room.mode}
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      {room.entryFee === 0 ? "Free" : `${room.entryFee}`}
                    </span>
                    <span className="flex items-center gap-1">
                      {room.privacy === "private" ? (
                        <Lock className="w-3.5 h-3.5 text-accent-magenta" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-accent-green" />
                      )}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/room/create" className="btn-ghost gap-2 text-body-sm">
              <DoorOpen className="w-4 h-4" />
              Create a new room instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

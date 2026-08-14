"use client";

import { motion } from "framer-motion";

const PLAYER_COLORS = {
  red: { main: "#EF4444", glow: "#F87171", light: "#FEF2F2" },
  green: { main: "#22C55E", glow: "#4ADE80", light: "#F0FDF4" },
  yellow: { main: "#EAB308", glow: "#FDE047", light: "#FEFCE8" },
  blue: { main: "#3B82F6", glow: "#60A5FA", light: "#EFF6FF" },
} as const;

interface GameOverProps {
  winnerId: string;
  players: Array<{
    userId: string;
    username: string;
    color: keyof typeof PLAYER_COLORS;
  }>;
  currentUserId: string;
  onBackToDashboard: () => void;
}

export function GameOver({
  winnerId,
  players,
  currentUserId,
  onBackToDashboard,
}: GameOverProps) {
  const winner = players.find((p) => p.userId === winnerId);
  const isWinner = winnerId === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        style={{
          background: "#111827",
          borderRadius: 24,
          padding: 40,
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          border: "1px solid #374151",
          boxShadow: "0 0 60px rgba(34,211,238,0.2)",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 8,
            background: "linear-gradient(135deg, #22D3EE, #FBBF24)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Game Complete!
        </h2>
        <p style={{ fontSize: 18, color: "#D1D5DB", marginBottom: 24 }}>
          {isWinner ? "You Won! 🎉" : `${winner?.username || "Someone"} Wins!`}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {players.map((p, i) => (
            <div
              key={p.userId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background:
                  p.userId === currentUserId ? "#3B82F620" : "#1F2937",
                borderRadius: 12,
                border:
                  p.userId === currentUserId
                    ? "1px solid #3B82F6"
                    : "1px solid #374151",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color:
                    i === 0
                      ? "#FBBF24"
                      : i === 1
                        ? "#9CA3AF"
                        : i === 2
                          ? "#EF4444"
                          : "#6B7280",
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontWeight: 600, color: "#F9FAFB" }}>
                {p.username}
              </span>
              {p.userId === winnerId && (
                <span
                  style={{ marginLeft: "auto", fontSize: 12, color: "#FBBF24" }}
                >
                  WINNER
                </span>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onBackToDashboard}
          style={{
            width: "100%",
            padding: "14px 24",
            borderRadius: 12,
            background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </motion.div>
    </motion.div>
  );
}

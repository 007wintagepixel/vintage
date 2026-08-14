"use client";

import { motion } from "framer-motion";

const PLAYER_COLORS = {
  red: { main: "#EF4444", glow: "#F87171", light: "#FEF2F2" },
  green: { main: "#22C55E", glow: "#4ADE80", light: "#F0FDF4" },
  yellow: { main: "#EAB308", glow: "#FDE047", light: "#FEFCE8" },
  blue: { main: "#3B82F6", glow: "#60A5FA", light: "#EFF6FF" },
} as const;

interface TokenInfo {
  id: number;
  position: number;
  isLegal: boolean;
  isFinished: boolean;
}

interface PlayerHandProps {
  tokens: TokenInfo[];
  color: keyof typeof PLAYER_COLORS;
  isCurrentPlayer: boolean;
  onTokenClick: (tokenId: number) => void;
}

export function PlayerHand({
  tokens,
  color,
  isCurrentPlayer,
  onTokenClick,
}: PlayerHandProps) {
  const colorConfig = PLAYER_COLORS[color];

  if (!isCurrentPlayer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        padding: 16,
      }}
    >
      {tokens.map((token, index) => (
        <motion.button
          key={token.id}
          onClick={() => !token.isFinished && onTokenClick(token.id)}
          disabled={token.isFinished || !token.isLegal}
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: token.isFinished
              ? `linear-gradient(135deg, ${colorConfig.glow}, ${colorConfig.main})`
              : token.isLegal
                ? `linear-gradient(135deg, ${colorConfig.light}, ${colorConfig.main}20)`
                : "#f3f4f6",
            border: `2px solid ${token.isLegal ? colorConfig.glow : token.isFinished ? colorConfig.main : "#e5e7eb"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "16px",
            color: token.isFinished
              ? "#fff"
              : token.isLegal
                ? colorConfig.main
                : "#9ca3af",
            cursor:
              token.isLegal && !token.isFinished ? "pointer" : "not-allowed",
            opacity: token.isFinished || token.isLegal ? 1 : 0.5,
            boxShadow: token.isLegal
              ? `0 0 15px ${colorConfig.glow}60, 0 4px 12px rgba(0,0,0,0.15)`
              : token.isFinished
                ? `0 4px 12px ${colorConfig.glow}40`
                : "none",
            transition: "all 0.2s",
          }}
          whileTap={{ scale: 0.9 }}
        >
          {token.isFinished ? (
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </motion.div>
          ) : (
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              {index + 1}
            </span>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}

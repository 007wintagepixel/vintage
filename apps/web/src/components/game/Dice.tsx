"use client";

import { motion } from "framer-motion";

const PLAYER_COLORS = {
  red: { main: "#EF4444", glow: "#F87171", light: "#FEF2F2" },
  green: { main: "#22C55E", glow: "#4ADE80", light: "#F0FDF4" },
  yellow: { main: "#EAB308", glow: "#FDE047", light: "#FEFCE8" },
  blue: { main: "#3B82F6", glow: "#60A5FA", light: "#EFF6FF" },
} as const;

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  playerColor: keyof typeof PLAYER_COLORS;
}

export function Dice({
  value,
  isRolling,
  canRoll,
  onRoll,
  playerColor,
}: DiceProps) {
  const colorConfig = PLAYER_COLORS[playerColor];

  const diceFaces = [
    [{ x: 0.5, y: 0.5 }],
    [
      { x: 0.25, y: 0.25 },
      { x: 0.75, y: 0.75 },
    ],
    [
      { x: 0.25, y: 0.25 },
      { x: 0.5, y: 0.5 },
      { x: 0.75, y: 0.75 },
    ],
    [
      { x: 0.25, y: 0.25 },
      { x: 0.75, y: 0.25 },
      { x: 0.25, y: 0.75 },
      { x: 0.75, y: 0.75 },
    ],
    [
      { x: 0.25, y: 0.25 },
      { x: 0.75, y: 0.25 },
      { x: 0.5, y: 0.5 },
      { x: 0.25, y: 0.75 },
      { x: 0.75, y: 0.75 },
    ],
    [
      { x: 0.25, y: 0.25 },
      { x: 0.75, y: 0.25 },
      { x: 0.25, y: 0.5 },
      { x: 0.75, y: 0.5 },
      { x: 0.25, y: 0.75 },
      { x: 0.75, y: 0.75 },
    ],
  ];

  const dots = value ? diceFaces[value - 1] : diceFaces[0];

  return (
    <motion.button
      onClick={onRoll}
      disabled={!canRoll || isRolling}
      className="game-dice"
      style={{
        width: 80,
        height: 80,
        borderRadius: 16,
        background: `linear-gradient(135deg, #fff 0%, #f3f4f6 100%)`,
        border: `3px solid ${colorConfig.main}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5), 0 0 0 1px rgba(0,0,0,0.1)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 12,
        cursor: canRoll ? "pointer" : "not-allowed",
        opacity: canRoll ? 1 : 0.5,
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotate: isRolling ? 360 : 0,
        scale: isRolling ? [1, 1.1, 1] : 1,
      }}
      transition={{
        rotate: {
          duration: 0.5,
          repeat: isRolling ? Infinity : 0,
          ease: "linear",
        },
        scale: { duration: 0.3, repeat: isRolling ? Infinity : 0 },
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          width: "100%",
          height: "100%",
        }}
      >
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, #fff, ${colorConfig.main})`,
              boxShadow: `0 2px 4px rgba(0,0,0,0.3)`,
              placeSelf: "center",
            }}
            animate={{ scale: isRolling ? [1, 0.5, 1] : 1 }}
            transition={{
              duration: 0.3,
              repeat: isRolling ? Infinity : 0,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
      {isRolling && (
        <motion.span
          className="rolling-text"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{
            fontSize: 10,
            fontWeight: "bold",
            color: colorConfig.main,
            marginTop: 4,
          }}
        >
          ROLLING...
        </motion.span>
      )}
    </motion.button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TOKEN_RADIUS = 16;
const CELL_SIZE = 40;
const BOARD_PADDING = 60;

const PLAYER_COLORS = {
  red: { main: "#EF4444", glow: "#F87171", light: "#FEF2F2" },
  green: { main: "#22C55E", glow: "#4ADE80", light: "#F0FDF4" },
  yellow: { main: "#EAB308", glow: "#FDE047", light: "#FEFCE8" },
  blue: { main: "#3B82F6", glow: "#60A5FA", light: "#EFF6FF" },
} as const;

interface TokenProps {
  id: number;
  position: number; // -1 = home, 0-51 = track, 52-55 = home lane, 56 = finished
  color: keyof typeof PLAYER_COLORS;
  // playerId: string; // Accepted for future use (analytics, debugging)
  isCurrentPlayer: boolean;
  isLegalMove: boolean;
  onClick: (tokenId: number) => void;
}

function getTrackCoordinates(index: number): { x: number; y: number } {
  if (index < 0) return { x: -100, y: -100 };
  if (index >= 52 && index <= 55) return { x: -100, y: -100 };
  if (index === 56) return { x: -100, y: -100 };

  const perimeter = 52;
  const progress = index / perimeter;
  const side = Math.floor(progress * 4);
  const sideProgress = (progress * 4) % 1;
  const sideIndex = Math.floor(sideProgress * 13);
  // const offset = BOARD_PADDING + CELL_SIZE * 6; // Used in switch cases below

  let x = 0;
  let y = 0;

  switch (side) {
    case 0:
      x = BOARD_PADDING + CELL_SIZE * 6 + sideIndex * CELL_SIZE;
      y = BOARD_PADDING;
      break;
    case 1:
      x = BOARD_PADDING + CELL_SIZE * 18;
      y = BOARD_PADDING + CELL_SIZE * 6 + sideIndex * CELL_SIZE;
      break;
    case 2:
      x = BOARD_PADDING + CELL_SIZE * 18 - sideIndex * CELL_SIZE;
      y = BOARD_PADDING + CELL_SIZE * 18;
      break;
    case 3:
      x = BOARD_PADDING;
      y = BOARD_PADDING + CELL_SIZE * 18 - sideIndex * CELL_SIZE;
      break;
    default:
      x = BOARD_PADDING;
      y = BOARD_PADDING;
  }

  return { x: x + CELL_SIZE / 2, y: y + CELL_SIZE / 2 };
}

function getHomeLaneCoordinates(
  color: keyof typeof PLAYER_COLORS,
  laneIndex: number,
): { x: number; y: number } {
  const centerX = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
  const centerY = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
  const laneOffset = 30;

  switch (color) {
    case "red":
      return { x: centerX - laneOffset * (4 - laneIndex), y: centerY };
    case "green":
      return { x: centerX, y: centerY - laneOffset * (4 - laneIndex) };
    case "yellow":
      return { x: centerX + laneOffset * (4 - laneIndex), y: centerY };
    case "blue":
      return { x: centerX, y: centerY + laneOffset * (4 - laneIndex) };
  }
}

function getHomePosition(
  color: keyof typeof PLAYER_COLORS,
  tokenIndex: number,
): { x: number; y: number } {
  const basePositions = {
    red: [
      {
        x: BOARD_PADDING + CELL_SIZE * 1.5,
        y: BOARD_PADDING + CELL_SIZE * 1.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 3.5,
        y: BOARD_PADDING + CELL_SIZE * 1.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 1.5,
        y: BOARD_PADDING + CELL_SIZE * 3.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 3.5,
        y: BOARD_PADDING + CELL_SIZE * 3.5,
      },
    ],
    green: [
      {
        x: BOARD_PADDING + CELL_SIZE * 10.5,
        y: BOARD_PADDING + CELL_SIZE * 1.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 12.5,
        y: BOARD_PADDING + CELL_SIZE * 1.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 10.5,
        y: BOARD_PADDING + CELL_SIZE * 3.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 12.5,
        y: BOARD_PADDING + CELL_SIZE * 3.5,
      },
    ],
    yellow: [
      {
        x: BOARD_PADDING + CELL_SIZE * 10.5,
        y: BOARD_PADDING + CELL_SIZE * 10.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 12.5,
        y: BOARD_PADDING + CELL_SIZE * 10.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 10.5,
        y: BOARD_PADDING + CELL_SIZE * 12.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 12.5,
        y: BOARD_PADDING + CELL_SIZE * 12.5,
      },
    ],
    blue: [
      {
        x: BOARD_PADDING + CELL_SIZE * 1.5,
        y: BOARD_PADDING + CELL_SIZE * 10.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 3.5,
        y: BOARD_PADDING + CELL_SIZE * 10.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 1.5,
        y: BOARD_PADDING + CELL_SIZE * 12.5,
      },
      {
        x: BOARD_PADDING + CELL_SIZE * 3.5,
        y: BOARD_PADDING + CELL_SIZE * 12.5,
      },
    ],
  };
  return basePositions[color][tokenIndex];
}

function getFinishedPosition(): { x: number; y: number } {
  const centerX = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
  const centerY = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
  return { x: centerX, y: centerY };
}

function isInHome(position: number): boolean {
  return position === -1;
}

function isFinished(position: number): boolean {
  return position === 56;
}

function isInHomeLane(position: number): boolean {
  return position >= 52 && position <= 55;
}

export function Token({
  id,
  position,
  color,
  // playerId, // Accepted for future use (analytics, debugging)
  isCurrentPlayer,
  isLegalMove,
  onClick,
}: TokenProps) {
  const colorConfig = PLAYER_COLORS[color];
  const inHome = isInHome(position);
  const finished = isFinished(position);
  const inHomeLane = isInHomeLane(position);

  let visualX = 0;
  let visualY = 0;

  if (inHome) {
    const homePos = getHomePosition(color, id);
    visualX = homePos.x;
    visualY = homePos.y;
  } else if (finished) {
    const finishedPos = getFinishedPosition();
    visualX = finishedPos.x;
    visualY = finishedPos.y;
  } else if (inHomeLane) {
    const laneIndex = position - 52;
    const lanePos = getHomeLaneCoordinates(color, laneIndex);
    visualX = lanePos.x;
    visualY = lanePos.y;
  } else {
    const trackPos = getTrackCoordinates(position);
    visualX = trackPos.x;
    visualY = trackPos.y;
  }

  const [displayX, setDisplayX] = useState(visualX);
  const [displayY, setDisplayY] = useState(visualY);

  useEffect(() => {
    const animate = () => {
      setDisplayX((prev) => prev + (visualX - prev) * 0.15);
      setDisplayY((prev) => prev + (visualY - prev) * 0.15);
      if (
        Math.abs(displayX - visualX) > 1 ||
        Math.abs(displayY - visualY) > 1
      ) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [visualX, visualY, displayX, displayY]);

  const canMove = isCurrentPlayer && isLegalMove && !finished;

  return (
    <motion.div
      onClick={() => canMove && onClick(id)}
      style={{
        position: "absolute",
        left: displayX - TOKEN_RADIUS,
        top: displayY - TOKEN_RADIUS,
        width: TOKEN_RADIUS * 2,
        height: TOKEN_RADIUS * 2,
        zIndex: inHomeLane ? 10 : 5,
        cursor: canMove ? "pointer" : "default",
        touchAction: "none",
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        scale: canMove ? 1.15 : 1,
        boxShadow: canMove
          ? `0 0 20px ${colorConfig.glow}, 0 0 40px ${colorConfig.glow}`
          : "0 4px 12px rgba(0,0,0,0.4)",
      }}
      transition={{ duration: 0.2 }}
      className="token"
    >
      <div
        className="token-inner"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${colorConfig.light}, ${colorConfig.main})`,
          border: `3px solid ${colorConfig.glow}`,
          boxShadow: `
            inset 0 -4px 8px ${colorConfig.main},
            inset 0 4px 8px ${colorConfig.light},
            0 4px 12px rgba(0,0,0,0.4)
          `,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "14px",
          color: "#fff",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        {id + 1}
      </div>

      {canMove && (
        <motion.div
          className="moving-ring"
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: `2px solid ${colorConfig.glow}`,
            opacity: 0.6,
          }}
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      {finished && (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "#fff",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
}

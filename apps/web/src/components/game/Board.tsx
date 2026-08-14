"use client";

import { useRef, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

// ============================================
// Board Constants (used by coordinate functions)
// ============================================

// const BOARD_SIZE = 52;
// const TOKEN_RADIUS = 16;
const CELL_SIZE = 40;
const BOARD_PADDING = 60;

const PLAYER_COLORS = {
  red: { main: "#EF4444", glow: "#F87171", light: "#FEF2F2" },
  green: { main: "#22C55E", glow: "#4ADE80", light: "#F0FDF4" },
  yellow: { main: "#EAB308", glow: "#FDE047", light: "#FEFCE8" },
  blue: { main: "#3B82F6", glow: "#60A5FA", light: "#EFF6FF" },
} as const;

const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];
const START_POSITIONS = { red: 0, green: 13, yellow: 26, blue: 39 };
// const HOME_LANE_ENTRY = { red: 51, green: 12, yellow: 25, blue: 38 };

// interface BoardTokenData {
//   id: number;
//   position: number;
//   color: keyof typeof PLAYER_COLORS;
//   playerId: string;
//   isCurrentPlayer: boolean;
//   isLegalMove: boolean;
//   onClick: (tokenId: number) => void;
// }

function getTrackCoordinates(index: number): Position {
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

// ============================================
// Coordinate Helper Functions (for future use - token positioning, animations)
// ============================================

// function _getHomeLaneCoordinates(
//   color: keyof typeof PLAYER_COLORS,
//   laneIndex: number,
// ): Position {
//   const centerX = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
//   const centerY = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
//   const laneOffset = 30;
//
//   switch (color) {
//     case "red":
//       return { x: centerX - laneOffset * (4 - laneIndex), y: centerY };
//     case "green":
//       return { x: centerX, y: centerY - laneOffset * (4 - laneIndex) };
//     case "yellow":
//       return { x: centerX + laneOffset * (4 - laneIndex), y: centerY };
//     case "blue":
//       return { x: centerX, y: centerY + laneOffset * (4 - laneIndex) };
//   }
// }
//
// function _getHomePosition(
//   color: keyof typeof PLAYER_COLORS,
//   tokenIndex: number,
// ): Position {
//   const basePositions = {
//     red: [
//       {
//         x: BOARD_PADDING + CELL_SIZE * 1.5,
//         y: BOARD_PADDING + CELL_SIZE * 1.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 3.5,
//         y: BOARD_PADDING + CELL_SIZE * 1.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 1.5,
//         y: BOARD_PADDING + CELL_SIZE * 3.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 3.5,
//         y: BOARD_PADDING + CELL_SIZE * 3.5,
//       },
//     ],
//     green: [
//       {
//         x: BOARD_PADDING + CELL_SIZE * 10.5,
//         y: BOARD_PADDING + CELL_SIZE * 1.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 12.5,
//         y: BOARD_PADDING + CELL_SIZE * 1.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 10.5,
//         y: BOARD_PADDING + CELL_SIZE * 3.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 12.5,
//         y: BOARD_PADDING + CELL_SIZE * 3.5,
//       },
//     ],
//     yellow: [
//       {
//         x: BOARD_PADDING + CELL_SIZE * 10.5,
//         y: BOARD_PADDING + CELL_SIZE * 10.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 12.5,
//         y: BOARD_PADDING + CELL_SIZE * 10.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 10.5,
//         y: BOARD_PADDING + CELL_SIZE * 12.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 12.5,
//         y: BOARD_PADDING + CELL_SIZE * 12.5,
//       },
//     ],
//     blue: [
//       {
//         x: BOARD_PADDING + CELL_SIZE * 1.5,
//         y: BOARD_PADDING + CELL_SIZE * 10.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 3.5,
//         y: BOARD_PADDING + CELL_SIZE * 10.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 1.5,
//         y: BOARD_PADDING + CELL_SIZE * 12.5,
//       },
//       {
//         x: BOARD_PADDING + CELL_SIZE * 3.5,
//         y: BOARD_PADDING + CELL_SIZE * 12.5,
//       },
//     ],
//   };
//   return basePositions[color][tokenIndex];
// }
//
// function _getFinishedPosition(): Position {
//   const centerX = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
//   const centerY = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
//   return { x: centerX, y: centerY };
// }

function isSafeCell(position: number): boolean {
  return SAFE_CELLS.includes(position);
}

export function Board({ tokens: _tokens }: { tokens: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawBoard = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw board background
      ctx.fillStyle = "#0C0A09";
      ctx.fillRect(0, 0, width, height);

      // Draw main track
      drawTrack(ctx);
      // Draw home lanes
      drawHomeLanes(ctx);
      // Draw center area
      drawCenter(ctx);
      // Draw safe cell indicators
      drawSafeCells(ctx);
    };

    const drawTrack = (ctx: CanvasRenderingContext2D) => {
      // Draw 4 arms of the cross
      // const armWidth = CELL_SIZE * 6;
      // const armLength = CELL_SIZE * 13;
      const centerX = BOARD_PADDING + CELL_SIZE * 12;
      const centerY = BOARD_PADDING + CELL_SIZE * 12;

      // Horizontal arms
      ctx.fillStyle = "#1F2937";
      ctx.fillRect(BOARD_PADDING, centerY, CELL_SIZE * 6, CELL_SIZE * 6); // Left
      ctx.fillRect(
        centerX + CELL_SIZE * 6,
        centerY,
        CELL_SIZE * 6,
        CELL_SIZE * 6,
      ); // Right

      // Vertical arms
      ctx.fillRect(centerX, BOARD_PADDING, CELL_SIZE * 6, CELL_SIZE * 6); // Top
      ctx.fillRect(
        centerX,
        centerY + CELL_SIZE * 6,
        CELL_SIZE * 6,
        CELL_SIZE * 6,
      ); // Bottom

      // Draw track cells
      for (let i = 0; i < 52; i++) {
        const pos = getTrackCoordinates(i);
        const isSafe = isSafeCell(i);
        const isStart = Object.values(START_POSITIONS).includes(i);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, CELL_SIZE * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = isSafe
          ? "#22D3EE40"
          : isStart
            ? "#FBBF2440"
            : "#374151";
        ctx.fill();
        ctx.strokeStyle = isSafe ? "#22D3EE" : isStart ? "#FBBF24" : "#4B5563";
        ctx.lineWidth = isSafe || isStart ? 2 : 1;
        ctx.stroke();
      }
    };

    const drawHomeLanes = (ctx: CanvasRenderingContext2D) => {
      const centerX = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
      const centerY = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
      const laneOffset = 30;
      const laneWidth = 24;

      Object.entries(PLAYER_COLORS).forEach(([color, config]) => {
        for (let i = 0; i < 4; i++) {
          let x = 0,
            y = 0,
            w = 0,
            h = 0;
          switch (color) {
            case "red":
              x = centerX - laneOffset * (4 - i) - laneWidth / 2;
              y = centerY - laneWidth / 2;
              w = laneWidth;
              h = laneWidth;
              break;
            case "green":
              x = centerX - laneWidth / 2;
              y = centerY - laneOffset * (4 - i) - laneWidth / 2;
              w = laneWidth;
              h = laneWidth;
              break;
            case "yellow":
              x = centerX + laneOffset * (4 - i) - laneWidth / 2;
              y = centerY - laneWidth / 2;
              w = laneWidth;
              h = laneWidth;
              break;
            case "blue":
              x = centerX - laneWidth / 2;
              y = centerY + laneOffset * (4 - i) - laneWidth / 2;
              w = laneWidth;
              h = laneWidth;
              break;
          }

          ctx.fillStyle = `${config.main}20`;
          ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = config.main;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, w, h);
        }
      });
    };

    const drawCenter = (ctx: CanvasRenderingContext2D) => {
      const centerX = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
      const centerY = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
      const size = CELL_SIZE * 6;

      // Center square
      ctx.fillStyle = "#111827";
      ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);

      // Four triangles
      const triangleSize = size / 2;
      Object.entries(PLAYER_COLORS).forEach(([color, config]) => {
        ctx.fillStyle = `${config.main}30`;
        ctx.beginPath();
        switch (color) {
          case "red":
            ctx.moveTo(centerX - triangleSize, centerY - triangleSize);
            ctx.lineTo(centerX + triangleSize, centerY);
            ctx.lineTo(centerX - triangleSize, centerY + triangleSize);
            break;
          case "green":
            ctx.moveTo(centerX - triangleSize, centerY - triangleSize);
            ctx.lineTo(centerX, centerY - triangleSize);
            ctx.lineTo(centerX, centerY + triangleSize);
            break;
          case "yellow":
            ctx.moveTo(centerX + triangleSize, centerY - triangleSize);
            ctx.lineTo(centerX - triangleSize, centerY);
            ctx.lineTo(centerX + triangleSize, centerY + triangleSize);
            break;
          case "blue":
            ctx.moveTo(centerX - triangleSize, centerY - triangleSize);
            ctx.lineTo(centerX + triangleSize, centerY - triangleSize);
            ctx.lineTo(centerX, centerY + triangleSize);
            break;
        }
        ctx.closePath();
        ctx.fill();
      });
    };

    const drawSafeCells = (ctx: CanvasRenderingContext2D) => {
      SAFE_CELLS.forEach((cellIndex) => {
        const pos = getTrackCoordinates(cellIndex);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, CELL_SIZE * 0.45, 0, Math.PI * 2);
        ctx.strokeStyle = "#22D3EE";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    };

    drawBoard();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: 16,
        boxShadow: "0 0 60px rgba(34,211,238,0.1), 0 20px 40px rgba(0,0,0,0.4)",
        background: "#0C0A09",
      }}
    />
  );
}

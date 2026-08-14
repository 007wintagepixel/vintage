"use client";

import { motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";

const PLAYER_COLORS = {
  red: { main: "#EF4444", glow: "#F87171", light: "#FEF2F2" },
  green: { main: "#22C55E", glow: "#4ADE80", light: "#F0FDF4" },
  yellow: { main: "#EAB308", glow: "#FDE047", light: "#FEFCE8" },
  blue: { main: "#3B82F6", glow: "#60A5FA", light: "#EFF6FF" },
} as const;

interface PlayerPanelData {
  userId: string;
  username: string;
  color: keyof typeof PLAYER_COLORS;
  tokens: Array<{
    id: number;
    position: number;
    isLegal?: boolean;
  }>;
  isCurrentTurn: boolean;
  isBot: boolean;
  hasRolled: boolean;
  diceValue?: number;
}

interface SidebarProps {
  players: PlayerPanelData[];
  currentPlayerColor: keyof typeof PLAYER_COLORS | null;
  gameStatus: string;
  onTokenClick: (tokenId: number) => void;
  onToggleChat: () => void;
  showChat: boolean;
  onLeaveMatch: () => void;
}

export function Sidebar({
  players,
  currentPlayerColor,
  gameStatus,
  onTokenClick,
  onToggleChat,
  showChat,
  onLeaveMatch,
}: SidebarProps) {
  const currentPlayer = players.find((p) => p.color === currentPlayerColor);

  return (
    <aside
      className="sidebar-left"
      style={{
        width: 280,
        padding: 20,
        overflowY: "auto",
        background: "linear-gradient(180deg, #111827 0%, #0C0A09 100%)",
        borderRight: "1px solid #1F2937",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "1px solid #374151",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 18, color: "#F9FAFB" }}>
          Players
        </h2>
        <button
          onClick={onToggleChat}
          className={`chat-toggle ${showChat ? "active" : ""}`}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: showChat ? "#3B82F6" : "#374151",
            border: "none",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <MessageSquare size={14} /> Chat
        </button>
      </div>

      {currentPlayerColor && (
        <motion.div
          key={currentPlayer?.color}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${PLAYER_COLORS[currentPlayerColor]?.light || "#EFF6FF"} 0%, ${PLAYER_COLORS[currentPlayerColor]?.main || "#3B82F6"}15 100%)`,
            border: `1px solid ${PLAYER_COLORS[currentPlayerColor]?.main || "#3B82F6"}40`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${PLAYER_COLORS[currentPlayerColor]?.glow || "#60A5FA"}, ${PLAYER_COLORS[currentPlayerColor]?.main || "#3B82F6"})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 16,
                color: "#fff",
              }}
            >
              {currentPlayer?.username[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1f2937" }}>
                {currentPlayer?.username}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {gameStatus === "in_progress"
                  ? "Current Turn"
                  : gameStatus === "completed"
                    ? "Winner! 🏆"
                    : "Game Starting..."}
              </div>
            </div>
          </div>
          {currentPlayer?.diceValue && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 10,
                background: "linear-gradient(135deg, #fff, #f3f4f6)",
                border: "3px solid #3B82F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: "bold",
                color: "#3B82F6",
                boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
                margin: "0 auto",
              }}
            >
              {currentPlayer.diceValue}
            </motion.div>
          )}
        </motion.div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {players.map((player, index) => (
          <PlayerPanel
            key={player.userId}
            player={player}
            isCurrentTurn={
              index === players.findIndex((p) => p.color === currentPlayerColor)
            }
            onTokenClick={onTokenClick}
          />
        ))}
      </div>

      <button
        onClick={onLeaveMatch}
        style={{
          marginTop: 24,
          width: "100%",
          padding: "12px 16px",
          borderRadius: 10,
          background: "rgba(239,68,68,0.2)",
          border: "1px solid #EF4444",
          color: "#EF4444",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <X size={16} /> Leave Match
      </button>
    </aside>
  );
}

function PlayerPanel({
  player,
  isCurrentTurn,
  onTokenClick,
}: {
  player: PlayerPanelData;
  isCurrentTurn: boolean;
  onTokenClick: (tokenId: number) => void;
}) {
  const colorConfig = PLAYER_COLORS[player.color];
  const legalTokenIds = new Set(
    player.tokens.filter((t) => t.isLegal).map((t) => t.id),
  );
  const finishedCount = player.tokens.filter((t) => t.position === 56).length;
  const inHomeLaneCount = player.tokens.filter(
    (t) => t.position >= 52 && t.position <= 55,
  ).length;
  const onBoardCount = player.tokens.filter(
    (t) => t.position >= 0 && t.position <= 51,
  ).length;
  const inHomeCount = player.tokens.filter((t) => t.position === -1).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: isCurrentTurn ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: `linear-gradient(135deg, ${colorConfig.light} 0%, ${colorConfig.main}10 100%)`,
        border: `2px solid ${isCurrentTurn ? colorConfig.glow : colorConfig.main}40`,
        borderRadius: 16,
        padding: 16,
        boxShadow: isCurrentTurn
          ? `0 0 30px ${colorConfig.glow}60, 0 4px 12px rgba(0,0,0,0.2)`
          : "0 4px 12px rgba(0,0,0,0.15)",
        transition: "all 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isCurrentTurn && (
        <motion.div
          className="turn-indicator"
          style={{
            position: "absolute",
            top: -2,
            left: -2,
            right: -2,
            height: 4,
            background: `linear-gradient(90deg, ${colorConfig.glow}, ${colorConfig.main})`,
            borderRadius: "16px 16px 0 0",
          }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div
        className="player-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          className="player-avatar"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colorConfig.glow}, ${colorConfig.main})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 18,
            color: "#fff",
            boxShadow: `0 4px 12px ${colorConfig.glow}60`,
          }}
        >
          {player.username[0].toUpperCase()}
        </div>
        <div className="player-info" style={{ flex: 1, minWidth: 0 }}>
          <div
            className="player-name"
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "#1f2937",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {player.username}{" "}
            {player.isBot && (
              <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 6 }}>
                BOT
              </span>
            )}
          </div>
          <div
            className="player-status"
            style={{ fontSize: 12, color: "#6b7280" }}
          >
            {isCurrentTurn ? "Your Turn" : "Waiting for turn"}
          </div>
        </div>
      </div>

      <div
        className="token-status"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          className={`status-item ${finishedCount > 0 ? "active" : ""}`}
          style={{
            textAlign: "center",
            padding: "8px 4px",
            borderRadius: 8,
            background:
              finishedCount > 0 ? `${colorConfig.main}15` : "transparent",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: finishedCount > 0 ? colorConfig.main : "#9ca3af",
            }}
          >
            {finishedCount}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Home
          </div>
        </div>
        <div
          className={`status-item ${inHomeLaneCount > 0 ? "active" : ""}`}
          style={{
            textAlign: "center",
            padding: "8px 4px",
            borderRadius: 8,
            background:
              inHomeLaneCount > 0 ? `${colorConfig.main}15` : "transparent",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: inHomeLaneCount > 0 ? colorConfig.main : "#9ca3af",
            }}
          >
            {inHomeLaneCount}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Lane
          </div>
        </div>
        <div
          className={`status-item ${onBoardCount > 0 ? "active" : ""}`}
          style={{
            textAlign: "center",
            padding: "8px 4px",
            borderRadius: 8,
            background:
              onBoardCount > 0 ? `${colorConfig.main}15` : "transparent",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: onBoardCount > 0 ? colorConfig.main : "#9ca3af",
            }}
          >
            {onBoardCount}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Board
          </div>
        </div>
        <div
          className={`status-item ${inHomeCount > 0 ? "active" : ""}`}
          style={{
            textAlign: "center",
            padding: "8px 4px",
            borderRadius: 8,
            background:
              inHomeCount > 0 ? `${colorConfig.main}15` : "transparent",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: inHomeCount > 0 ? colorConfig.main : "#9ca3af",
            }}
          >
            {inHomeCount}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Base
          </div>
        </div>
      </div>

      <div
        className="player-tokens"
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {player.tokens.map((token, index) => {
          const isLegal = legalTokenIds.has(token.id);
          const isFinished = token.position === 56;

          return (
            <motion.button
              key={token.id}
              onClick={() => !isFinished && onTokenClick(token.id)}
              disabled={isFinished || !isLegal}
              className="token-btn"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: isFinished
                  ? `linear-gradient(135deg, ${colorConfig.glow}, ${colorConfig.main})`
                  : isLegal
                    ? `linear-gradient(135deg, ${colorConfig.light}, ${colorConfig.main}20)`
                    : "#f3f4f6",
                border: `2px solid ${isLegal ? colorConfig.glow : isFinished ? colorConfig.main : "#e5e7eb"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 14,
                color: isFinished
                  ? "#fff"
                  : isLegal
                    ? colorConfig.main
                    : "#9ca3af",
                cursor: isLegal && !isFinished ? "pointer" : "not-allowed",
                opacity: isFinished || isLegal ? 1 : 0.5,
                boxShadow: isLegal
                  ? `0 0 15px ${colorConfig.glow}60, 0 4px 12px rgba(0,0,0,0.15)`
                  : isFinished
                    ? `0 4px 12px ${colorConfig.glow}40`
                    : "none",
                transition: "all 0.2s",
              }}
              whileTap={{ scale: 0.9 }}
            >
              {isFinished ? (
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
                <span style={{ fontSize: 14, fontWeight: "bold" }}>
                  {index + 1}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

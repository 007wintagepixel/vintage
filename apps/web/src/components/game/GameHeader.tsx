"use client";

import { motion } from "framer-motion";
import { X, Wifi, WifiOff, Loader2 } from "lucide-react";

interface ConnectionStatusIndicatorProps {
  status: "connected" | "reconnecting" | "syncing" | "disconnected";
  onRetry?: () => void;
}

export function ConnectionStatusIndicator({
  status,
  onRetry,
}: ConnectionStatusIndicatorProps) {
  const configs = {
    connected: {
      color: "#22C55E",
      icon: Wifi,
      label: "Connected",
    },
    reconnecting: {
      color: "#F59E0B",
      icon: Loader2,
      label: "Reconnecting...",
    },
    syncing: {
      color: "#3B82F6",
      icon: Loader2,
      label: "Syncing...",
    },
    disconnected: {
      color: "#EF4444",
      icon: WifiOff,
      label: "Disconnected",
    },
  };

  const config = configs[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        background: `${config.color}15`,
        border: `1px solid ${config.color}40`,
        borderRadius: 8,
        color: config.color,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <config.icon
        className={
          status === "reconnecting" || status === "syncing"
            ? "animate-spin"
            : ""
        }
        size={14}
      />
      <span>{config.label}</span>
      {status === "reconnecting" && onRetry && (
        <motion.button
          onClick={onRetry}
          whileTap={{ scale: 0.9 }}
          style={{
            marginLeft: 4,
            padding: "2px 8px",
            borderRadius: 4,
            background: `${config.color}20`,
            border: `1px solid ${config.color}40`,
            color: config.color,
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}

interface GameHeaderProps {
  matchId: string;
  connectionStatus: "connected" | "reconnecting" | "syncing" | "disconnected";
  onRetry?: () => void;
  onLeaveMatch: () => void;
}

export function GameHeader({
  matchId,
  connectionStatus,
  onRetry,
  onLeaveMatch,
}: GameHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        background: "rgba(17,24,39,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1F2937",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <motion.button
          onClick={onLeaveMatch}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: 8,
            borderRadius: 8,
            background: "#1F2937",
            border: "1px solid #374151",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={20} />
        </motion.button>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 20,
            background: "linear-gradient(135deg, #22D3EE, #D946EF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ludo Nexus
        </h1>
        <span
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            background: "#1F2937",
            padding: "4px 10px",
            borderRadius: 12,
          }}
        >
          Match: {matchId.slice(0, 8)}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <ConnectionStatusIndicator
          status={connectionStatus}
          onRetry={onRetry}
        />
      </div>
    </header>
  );
}

"use client";

import { motion } from "framer-motion";
import { useGameSocket } from "@/app/game/[matchId]/hooks/useGameSocket";

interface ReconnectionIndicatorProps {
  matchId: string;
  accessToken: string;
  userId: string;
  username: string;
}

export function ReconnectionIndicator({
  matchId,
  accessToken,
  userId,
  username,
}: ReconnectionIndicatorProps) {
  const {
    connectionStatus,
    reconnectionAttempt,
    maxReconnectAttempts,
    lastSyncTime,
  } = useGameSocket(matchId, accessToken, userId, username);

  if (connectionStatus === "connected") {
    return (
      <motion.div
        className="reconnection-indicator connected"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="status-dot connected" />
        <span>Connected</span>
        {lastSyncTime && (
          <span className="last-synced">
            Last synced: {lastSyncTime.toLocaleTimeString()}
          </span>
        )}
      </motion.div>
    );
  }

  if (connectionStatus === "syncing") {
    return (
      <motion.div
        className="reconnection-indicator syncing"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="status-dot syncing" />
        <span>Syncing game state...</span>
      </motion.div>
    );
  }

  if (connectionStatus === "reconnecting") {
    return (
      <motion.div
        className="reconnection-indicator reconnecting"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="status-dot reconnecting" />
        <span>
          Reconnecting... Attempt {reconnectionAttempt} of{" "}
          {maxReconnectAttempts}
        </span>
        <motion.div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: reconnectionAttempt / maxReconnectAttempts }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="reconnection-indicator disconnected"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="status-dot disconnected" />
      <span>Disconnected</span>
    </motion.div>
  );
}

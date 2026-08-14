"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import {
  Board,
  Token,
  Dice,
  PlayerHand,
  Sidebar,
  Chat,
  GameOver,
  GameErrorBoundary,
  GameHeader,
} from "@/components/game";
import { useGameSocket } from "./hooks/useGameSocket";

// ============================================
// Types (from shared-types via hook)
// ============================================

// GameBoardPage is the main exported component
async function GameBoardPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  return <GameBoard matchId={matchId} />;
}

function GameBoard({ matchId }: { matchId: string }) {
  // Auth context - replace with real auth
  const user = { id: "user-1", username: "Player1" };
  const accessToken = "mock-token";

  // Use the new game socket hook
  const {
    // Connection state
    connectionStatus,
    // Game state
    gameState,
    myColor,
    isMyTurn,
    legalMoves,
    // Chat
    chatMessages,
    // Actions
    rollDice,
    moveToken,
    sendChatMessage,
    reconnect,
    leaveMatch,
  } = useGameSocket(matchId, accessToken, user.id, user.username);

  // Local UI state
  const [showChat, setShowChat] = useState(false);

  // ============================================
  // Render
  // ============================================
  if (!gameState) {
    return (
      <div
        className="game-loading"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 16,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: 64,
            height: 64,
            border: "4px solid #e5e7eb",
            borderTopColor: "#3B82F6",
            borderRadius: "50%",
          }}
        />
        <p style={{ color: "#6b7280", fontSize: 16 }}>Loading game...</p>
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          Connecting to match {matchId.slice(0, 8)}...
        </p>
      </div>
    );
  }

  const myPlayerIndex = gameState.players.findIndex((p) => p.color === myColor);
  const myPlayer = myPlayerIndex >= 0 ? gameState.players[myPlayerIndex] : null;

  // Prepare token data for Board component
  const boardTokens = gameState.players.flatMap(
    (player) =>
      player.tokens.map((token) => ({
        ...token,
        color: player.color,
        playerId: player.userId,
        isCurrentPlayer: player.userId === user.id,
        isLegalMove:
          gameState.legalMoves?.some((m) => m.tokenId === token.id) ?? false,
        onClick: (tokenId: number) =>
          moveToken(
            tokenId,
            legalMoves.find((m) => m.tokenId === tokenId)?.toPosition ?? 0,
          ),
      })) as Array<{
        id: number;
        position: number;
        color: "red" | "green" | "yellow" | "blue";
        playerId: string;
        isCurrentPlayer: boolean;
        isLegalMove: boolean;
        onClick: (tokenId: number) => void;
      }>,
  );

  // Prepare tokens for PlayerHand
  const handTokens =
    myPlayer?.tokens.map((token) => ({
      ...token,
      isLegal:
        gameState.legalMoves?.some((m) => m.tokenId === token.id) ?? false,
      isFinished: token.position === 56,
    })) ?? [];

  // Prepare players for Sidebar
  const sidebarPlayers = gameState.players.map((player) => ({
    userId: player.userId,
    username: player.username,
    color: player.color,
    tokens: player.tokens.map((token) => ({
      id: token.id,
      position: token.position,
      isLegal:
        gameState.legalMoves?.some((m) => m.tokenId === token.id) ?? false,
    })),
    isCurrentTurn:
      gameState.currentPlayerIndex === gameState.players.indexOf(player),
    isBot: player.isBot,
    hasRolled: player.hasRolled,
    diceValue: gameState.diceRoll?.value,
  }));

  return (
    <GameErrorBoundary
      fallback={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: 32,
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <RefreshCw size={64} style={{ color: "#EF4444" }} />
          </motion.div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#F9FAFB",
              marginTop: 16,
            }}
          >
            Game Error
          </h2>
          <p
            style={{
              color: "#9CA3AF",
              marginTop: 8,
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            The game encountered an error. Your game state is saved on the
            server.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: 24,
              padding: "14px 32px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Reload Page
          </motion.button>
        </div>
      }
    >
      <GameHeader
        matchId={matchId}
        connectionStatus={connectionStatus}
        onRetry={reconnect}
        onLeaveMatch={leaveMatch}
      />

      <div
        className="game-board-container"
        style={{
          height: "100vh",
          display: "flex",
          background: "#0C0A09",
          color: "#F9FAFB",
        }}
      >
        <Sidebar
          players={sidebarPlayers}
          currentPlayerColor={myColor}
          gameStatus={gameState.status}
          onTokenClick={(tokenId) =>
            moveToken(
              tokenId,
              legalMoves.find((m) => m.tokenId === tokenId)?.toPosition ?? 0,
            )
          }
          onToggleChat={() => setShowChat(!showChat)}
          showChat={showChat}
          onLeaveMatch={leaveMatch}
        />

        <main
          className="game-main"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <div
            className="board-container"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Board tokens={boardTokens} />

            {/* Token components overlay */}
            {boardTokens.map((token) => (
              <Token
                key={`${token.playerId}-${token.id}`}
                id={token.id}
                position={token.position}
                color={token.color}
                isCurrentPlayer={token.isCurrentPlayer}
                isLegalMove={token.isLegalMove}
                onClick={token.onClick}
              />
            ))}

            {myPlayer && (
              <div
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 20,
                }}
              >
                <Dice
                  value={
                    isMyTurn && gameState.diceRoll?.value
                      ? gameState.diceRoll.value
                      : null
                  }
                  isRolling={
                    isMyTurn &&
                    gameState.diceRoll === undefined &&
                    myPlayer.hasRolled
                  }
                  canRoll={
                    isMyTurn &&
                    !myPlayer.hasRolled &&
                    gameState.status === "in_progress"
                  }
                  onRoll={rollDice}
                  playerColor={myColor!}
                />
              </div>
            )}

            <AnimatePresence>
              {gameState.status === "completed" && gameState.winner && (
                <GameOver
                  winnerId={gameState.winner}
                  players={gameState.players.map((p) => ({
                    userId: p.userId,
                    username: p.username,
                    color: p.color,
                  }))}
                  currentUserId={user.id}
                  onBackToDashboard={() =>
                    (window.location.href = "/dashboard")
                  }
                />
              )}
            </AnimatePresence>
          </div>

          {showChat && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 360,
                background: "#0C0A09",
                borderLeft: "1px solid #1F2937",
                zIndex: 20,
              }}
            >
              <Chat
                messages={chatMessages}
                onSend={sendChatMessage}
                currentUserId={user.id}
                _currentUserColor={myColor!}
              />
            </div>
          )}

          {!showChat && myPlayer && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                zIndex: 15,
              }}
            >
              <PlayerHand
                tokens={handTokens}
                color={myColor!}
                isCurrentPlayer={isMyTurn}
                onTokenClick={(tokenId) =>
                  moveToken(
                    tokenId,
                    legalMoves.find((m) => m.tokenId === tokenId)?.toPosition ??
                      0,
                  )
                }
              />
            </div>
          )}
        </main>
      </div>
    </GameErrorBoundary>
  );
}

// Need to import useState for the local showChat state
// import { useState } from "react"; // Already imported at top

export default GameBoardPage;

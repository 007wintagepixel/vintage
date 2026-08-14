"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// ============================================
// Types (matching shared-types)
// ============================================

export type PlayerColor = "red" | "green" | "yellow" | "blue";

export type MatchStatus = "waiting" | "in_progress" | "completed";

export type GameMode = "vs_human" | "vs_ai" | "group" | "tournament";

export interface GameRules {
  entryRoll: 1 | 6;
  extraTurnOnSix: boolean;
  extraTurnOnCapture: boolean;
  extraTurnOnHome: boolean;
  allowBlockades: boolean;
  allowThreeSixes: boolean;
  safeCells: number[];
  teamMode: boolean;
}

export interface TokenState {
  id: number;
  position: number;
  isInHome: boolean;
  isFinished: boolean;
}

export interface PlayerState {
  userId: string;
  username: string;
  color: PlayerColor;
  tokens: TokenState[];
  isActive: boolean;
  isConnected: boolean;
  hasRolled: boolean;
  consecutiveSixes: number;
  isBot: boolean;
  botDifficulty?: "easy" | "medium" | "hard";
  teamId?: number;
}

export interface DiceRoll {
  value: number;
  rolledAt: string;
  rolledBy: string;
  isServerGenerated: boolean;
  auditId: string;
}

export interface LegalMove {
  tokenId: number;
  fromPosition: number;
  toPosition: number;
}

export interface CapturedToken {
  playerId: string;
  tokenId: number;
  fromPosition: number;
}

export interface Move {
  tokenId: number;
  fromPosition: number;
  toPosition: number;
  capturedTokens: CapturedToken[];
  isExtraTurn: boolean;
  gameStateVersion: number;
}

export interface GameState {
  matchId: string;
  roomId?: string;
  tournamentId?: string;
  mode: GameMode;
  rules: GameRules;
  players: PlayerState[];
  currentPlayerIndex: number;
  diceRoll?: DiceRoll;
  legalMoves: LegalMove[];
  moveHistory: any[];
  stateVersion: number;
  status: MatchStatus;
  winner?: string | null;
  rankings: string[];
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: PlayerColor;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

// ============================================
// Socket Event Types
// ============================================

interface DiceRolledEvent {
  userId: string;
  diceRoll: DiceRoll;
  legalMoves: LegalMove[];
  gameState: GameState;
}

interface TokenMovedEvent {
  userId: string;
  move: Move;
  capturedTokens: CapturedToken[];
  gameState: GameState;
}

interface TokenCapturedEvent {
  playerId: string;
  tokenId: number;
  fromPosition: number;
}

interface TurnChangedEvent {
  nextPlayerId: string;
  extraTurn: boolean;
  diceRoll?: DiceRoll;
}

interface MatchCompletedEvent {
  winner: string;
  rankings: string[];
  gameState: GameState;
}

interface PlayerReconnectedEvent {
  userId: string;
  gameState: GameState;
}

interface PlayerDisconnectedEvent {
  userId: string;
}

interface GameErrorEvent {
  code: string;
  message: string;
}

interface ChatMessageEvent {
  userId: string;
  senderName: string;
  senderColor: PlayerColor;
  content: string;
  timestamp: string;
}

// ============================================
// Hook Return Types
// ============================================

export type ConnectionStatus =
  "connected" | "reconnecting" | "syncing" | "disconnected";

export interface UseGameSocketReturn {
  // Connection state
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  reconnectionAttempt: number;

  // Game state
  gameState: GameState | null;
  myColor: PlayerColor | null;
  myPlayerIndex: number;
  isMyTurn: boolean;
  currentPlayer: PlayerState | null;
  legalMoves: LegalMove[];

  // Chat
  chatMessages: ChatMessage[];

  // Errors
  error: GameErrorEvent | null;

  // Actions
  rollDice: () => Promise<void>;
  moveToken: (tokenId: number, toPosition: number) => Promise<void>;
  sendChatMessage: (content: string) => Promise<void>;
  reconnect: () => void;
  leaveMatch: () => void;

  // Internal state setters (for components)
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  setMyColor: React.Dispatch<React.SetStateAction<PlayerColor | null>>;
  setLegalMoves: React.Dispatch<React.SetStateAction<LegalMove[]>>;
  addChatMessage: (msg: ChatMessage) => void;
  setError: React.Dispatch<React.SetStateAction<GameErrorEvent | null>>;
}

// ============================================
// Event Handler Types
// ============================================

export interface GameSocketEventHandlers {
  onDiceRolled?: (data: DiceRolledEvent) => void;
  onTokenMoved?: (data: TokenMovedEvent) => void;
  onTokenCaptured?: (data: TokenCapturedEvent) => void;
  onTurnChanged?: (data: TurnChangedEvent) => void;
  onMatchCompleted?: (data: MatchCompletedEvent) => void;
  onPlayerReconnected?: (data: PlayerReconnectedEvent) => void;
  onPlayerDisconnected?: (data: PlayerDisconnectedEvent) => void;
  onError?: (error: GameErrorEvent) => void;
  onChatMessage?: (data: ChatMessageEvent) => void;
  onGameState?: (state: GameState) => void;
}

// ============================================
// Hook Implementation
// ============================================

export function useGameSocket(
  matchId: string,
  accessToken: string,
  userId: string,
  username: string,
  handlers: GameSocketEventHandlers = {},
): UseGameSocketReturn {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myColor, setMyColor] = useState<PlayerColor | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);
  const [error, setError] = useState<GameErrorEvent | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [legalMoves, setLegalMoves] = useState<LegalMove[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Computed values
  const myPlayerIndex =
    gameState?.players.findIndex((p) => p.color === myColor) ?? -1;
  const isMyTurn = myPlayerIndex === gameState?.currentPlayerIndex;
  const currentPlayer =
    gameState?.players[gameState?.currentPlayerIndex ?? 0] ?? null;

  // Cleanup function
  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.emit("leave_match", { matchId });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus("disconnected");
  }, [matchId]);

  // Reconnect function
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  // Leave match
  const leaveMatch = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Socket connection effect
  useEffect(() => {
    if (!accessToken) return;

    const newSocket = io("/game", {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      setIsConnected(true);
      setConnectionStatus("connected");
      setReconnectionAttempt(0);
      newSocket.emit("join_match", { matchId });
    });

    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        setConnectionStatus("reconnecting");
      }
    });

    newSocket.on("connect_error", () => {
      setConnectionStatus("reconnecting");
      setReconnectionAttempt((prev) => prev + 1);
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      setConnectionStatus("reconnecting");
      setReconnectionAttempt(attemptNumber);
    });

    newSocket.on("reconnect", () => {
      setIsConnected(true);
      setConnectionStatus("syncing");
      setReconnectionAttempt(0);
      newSocket.emit("join_match", { matchId });
    });

    // Game state events
    newSocket.on("match:state", (state: GameState) => {
      setGameState(state);
      const me = state.players.find((p) => p.userId === userId);
      if (me) setMyColor(me.color);
      handlers.onGameState?.(state);
    });

    newSocket.on("dice_rolled", (data: DiceRolledEvent) => {
      setGameState(data.gameState);
      setLegalMoves(data.legalMoves);
      const me = data.gameState.players.find((p) => p.userId === userId);
      if (me) setMyColor(me.color);
      handlers.onDiceRolled?.(data);
    });

    newSocket.on("token_moved", (data: TokenMovedEvent) => {
      setGameState(data.gameState);
      setLegalMoves([]);
      handlers.onTokenMoved?.(data);

      // Add system messages for captures
      if (data.capturedTokens.length > 0) {
        data.capturedTokens.forEach((captured) => {
          const systemMsg: ChatMessage = {
            id: `system-${Date.now()}-${captured.tokenId}`,
            senderId: "system",
            senderName: "System",
            senderColor: "red",
            content: `Token captured and sent home!`,
            timestamp: new Date(),
            isSystem: true,
          };
          setChatMessages((prev) => [...prev, systemMsg]);
        });
        handlers.onTokenCaptured?.({
          playerId: data.capturedTokens[0].playerId,
          tokenId: data.capturedTokens[0].tokenId,
          fromPosition: data.capturedTokens[0].fromPosition,
        });
      }
    });

    newSocket.on("turn_changed", (data: TurnChangedEvent) => {
      setGameState((prev: GameState | null) => {
        if (!prev) return null;
        const nextPlayerIndex = prev.players.findIndex(
          (p) => p.userId === data.nextPlayerId,
        );
        return {
          ...prev,
          currentPlayerIndex:
            nextPlayerIndex >= 0 ? nextPlayerIndex : prev.currentPlayerIndex,
          diceRoll: data.diceRoll || null,
        } as GameState;
      });
      handlers.onTurnChanged?.(data);
    });

    newSocket.on("game_completed", (data: MatchCompletedEvent) => {
      setGameState(data.gameState);
      handlers.onMatchCompleted?.(data);
    });

    newSocket.on("player_reconnected", (data: PlayerReconnectedEvent) => {
      setGameState(data.gameState);
      setConnectionStatus("connected");
      handlers.onPlayerReconnected?.(data);
    });

    newSocket.on("player_disconnected", (data: PlayerDisconnectedEvent) => {
      setGameState((prev: GameState | null) =>
        prev
          ? ({
              ...prev,
              players: prev.players.map((p) =>
                p.userId === data.userId ? { ...p, isConnected: false } : p,
              ),
            } as GameState | null)
          : null,
      );
      handlers.onPlayerDisconnected?.(data);
    });

    newSocket.on("match:error", (data: GameErrorEvent) => {
      setError(data);
      setTimeout(() => setError(null), 5000);
      handlers.onError?.(data);
    });

    newSocket.on("chat_message", (data: ChatMessageEvent) => {
      const msg: ChatMessage = {
        id: data.timestamp,
        senderId: data.userId,
        senderName: data.senderName,
        senderColor: data.senderColor,
        content: data.content,
        timestamp: new Date(data.timestamp),
      };
      setChatMessages((prev) => [...prev, msg]);
      handlers.onChatMessage?.(data);
    });

    return () => {
      cleanup();
    };
  }, [matchId, accessToken, userId, handlers, cleanup]);

  // Roll dice action
  const rollDice = useCallback(async () => {
    if (!socketRef.current || !gameState) return;

    const myPlayer = gameState.players[gameState.currentPlayerIndex];
    if (myPlayer.userId !== userId || myPlayer.hasRolled) return;

    socketRef.current.emit("roll_dice", {
      matchId,
      idempotencyKey: `roll-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    });
  }, [matchId, gameState, userId]);

  // Move token action
  const moveToken = useCallback(
    async (tokenId: number, _toPosition: number) => {
      if (!socketRef.current || !gameState || !myColor) return;

      const myPlayerIndex = gameState.players.findIndex(
        (p) => p.color === myColor,
      );
      if (myPlayerIndex === -1) return;

      // const myPlayer = gameState.players[myPlayerIndex]; // For future use
      const legalMove = gameState.legalMoves?.find(
        (m) => m.tokenId === tokenId,
      );
      if (!legalMove) return;

      socketRef.current.emit("move_token", {
        matchId,
        tokenId,
        toPosition: legalMove.toPosition,
        gameStateVersion: gameState.stateVersion,
        idempotencyKey: `move-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      });
    },
    [matchId, gameState, myColor],
  );

  // Send chat message
  const sendChatMessage = useCallback(
    async (content: string) => {
      if (!socketRef.current || !content.trim()) return;
      socketRef.current.emit("send_chat", { matchId, content: content.trim() });
    },
    [matchId],
  );

  // Add chat message (for system messages)
  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  return {
    // Connection state
    isConnected,
    connectionStatus,
    reconnectionAttempt,

    // Game state
    gameState,
    myColor,
    myPlayerIndex,
    isMyTurn,
    currentPlayer,
    legalMoves,

    // Chat
    chatMessages,

    // Errors
    error,

    // Actions
    rollDice,
    moveToken,
    sendChatMessage,
    reconnect,
    leaveMatch,

    // Internal setters
    setGameState,
    setMyColor,
    setLegalMoves,
    addChatMessage,
    setError,
  };
}

export default useGameSocket;

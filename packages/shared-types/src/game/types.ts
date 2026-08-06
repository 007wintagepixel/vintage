import { z } from 'zod';

// ============================================
// COMMON TYPES
// ============================================

export const UUIDSchema = z.string().uuid();
export type UUID = z.infer<typeof UUIDSchema>;

export const TimestampSchema = z.string().datetime();
export type Timestamp = z.infer<typeof TimestampSchema>;

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });
export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ============================================
// GAME TYPES
// ============================================

export const PlayerColorSchema = z.enum(['red', 'green', 'yellow', 'blue']);
export type PlayerColor = z.infer<typeof PlayerColorSchema>;

export const GameModeSchema = z.enum([
  'vs_ai',
  'vs_human',
  'group',
  'private',
  'team',
  'tournament',
]);
export type GameMode = z.infer<typeof GameModeSchema>;

export const BotDifficultySchema = z.enum(['easy', 'medium', 'hard']);
export type BotDifficulty = z.infer<typeof BotDifficultySchema>;

export const MatchStatusSchema = z.enum([
  'waiting',
  'starting',
  'in_progress',
  'completed',
  'cancelled',
  'abandoned',
]);
export type MatchStatus = z.infer<typeof MatchStatusSchema>;

export const RoomStatusSchema = z.enum(['lobby', 'starting', 'in_progress', 'completed']);
export type RoomStatus = z.infer<typeof RoomStatusSchema>;

export const TournamentStatusSchema = z.enum([
  'draft',
  'published',
  'registration_open',
  'registration_closed',
  'check_in',
  'in_progress',
  'completed',
  'cancelled',
]);
export type TournamentStatus = z.infer<typeof TournamentStatusSchema>;

// ============================================
// GAME RULES CONFIGURATION
// ============================================

export const GameRulesSchema = z.object({
  tokensPerPlayer: z.number().int().positive().default(4),
  entryRoll: z.number().int().positive().default(6),
  allowThreeSixes: z.boolean().default(true),
  extraTurnOnSix: z.boolean().default(true),
  extraTurnOnCapture: z.boolean().default(true),
  extraTurnOnHome: z.boolean().default(true),
  turnTimeSeconds: z.number().int().positive().default(30),
  reconnectionGraceSeconds: z.number().int().positive().default(30),
  inactivityLimit: z.number().int().positive().default(3),
  allowBlockades: z.boolean().default(false),
  safeCells: z.array(z.number().int().min(0).max(51)).default([0, 8, 13, 21, 26, 34, 39, 47]),
  teamMode: z.boolean().default(false),
  botDifficulty: BotDifficultySchema.default('medium'),
});
export type GameRules = z.infer<typeof GameRulesSchema>;

// ============================================
// GAME STATE
// ============================================

export const TokenStateSchema = z.object({
  id: z.number().int().min(0).max(3),
  position: z.number().int().min(-1).max(56), // -1 = home, 0-51 = track, 52-55 = home lane, 56 = finished
  isInHome: z.boolean(),
  isFinished: z.boolean(),
});
export type TokenState = z.infer<typeof TokenStateSchema>;

export const PlayerStateSchema = z.object({
  userId: UUIDSchema,
  color: PlayerColorSchema,
  tokens: z.array(TokenStateSchema).length(4),
  isActive: z.boolean(),
  isConnected: z.boolean(),
  hasRolled: z.boolean(),
  lastMoveAt: TimestampSchema.optional(),
  consecutiveSixes: z.number().int().min(0).max(3).default(0),
  isBot: z.boolean().default(false),
  botDifficulty: BotDifficultySchema.optional(),
  teamId: z.number().int().optional(), // for team mode
});
export type PlayerState = z.infer<typeof PlayerStateSchema>;

export const DiceRollSchema = z.object({
  value: z.number().int().min(1).max(6),
  rolledAt: TimestampSchema,
  rolledBy: UUIDSchema,
  isServerGenerated: z.boolean().default(true),
  auditId: UUIDSchema,
});
export type DiceRoll = z.infer<typeof DiceRollSchema>;

export const MoveSchema = z.object({
  tokenId: z.number().int().min(0).max(3),
  fromPosition: z.number().int().min(-1).max(55),
  toPosition: z.number().int().min(0).max(56),
  capturedTokens: z.array(z.object({
    playerId: UUIDSchema,
    tokenId: z.number().int().min(0).max(3),
    fromPosition: z.number().int(),
  })),
  isExtraTurn: z.boolean(),
  gameStateVersion: z.number().int().positive(),
});
export type Move = z.infer<typeof MoveSchema>;

export const GameStateSchema = z.object({
  matchId: UUIDSchema,
  roomId: UUIDSchema.optional(),
  tournamentId: UUIDSchema.optional(),
  mode: GameModeSchema,
  rules: GameRulesSchema,
  players: z.array(PlayerStateSchema).length(4),
  currentPlayerIndex: z.number().int().min(0).max(3),
  diceRoll: DiceRollSchema.optional(),
  legalMoves: z.array(z.object({
    tokenId: z.number().int().min(0).max(3),
    fromPosition: z.number().int(),
    toPosition: z.number().int(),
  })),
  moveHistory: z.array(MoveSchema),
  stateVersion: z.number().int().positive().default(1),
  status: MatchStatusSchema,
  winner: UUIDSchema.nullable(),
  rankings: z.array(UUIDSchema),
  startedAt: TimestampSchema.optional(),
  completedAt: TimestampSchema.optional(),
  createdAt: TimestampSchema,
});
export type GameState = z.infer<typeof GameStateSchema>;

// ============================================
// MATCH TYPES
// ============================================

export const MatchPlayerSchema = z.object({
  userId: UUIDSchema,
  color: PlayerColorSchema,
  isBot: z.boolean().default(false),
  botDifficulty: BotDifficultySchema.optional(),
  teamId: z.number().int().optional(),
  joinedAt: TimestampSchema,
  leftAt: TimestampSchema.nullable(),
  finalRank: z.number().int().positive().nullable(),
  coinsWon: z.number().int().default(0),
  coinsLost: z.number().int().default(0),
});
export type MatchPlayer = z.infer<typeof MatchPlayerSchema>;

export const MatchSchema = z.object({
  id: UUIDSchema,
  mode: GameModeSchema,
  roomId: UUIDSchema.nullable(),
  tournamentId: UUIDSchema.nullable(),
  players: z.array(MatchPlayerSchema),
  entryFee: z.number().int().nonnegative().default(0),
  prizePool: z.number().int().nonnegative().default(0),
  platformFee: z.number().int().nonnegative().default(0),
  status: MatchStatusSchema,
  winnerId: UUIDSchema.nullable(),
  gameState: GameStateSchema.nullable(),
  startedAt: TimestampSchema.nullable(),
  completedAt: TimestampSchema.nullable(),
  createdAt: TimestampSchema,
});
export type Match = z.infer<typeof MatchSchema>;

// ============================================
// ROOM TYPES
// ============================================

export const RoomPlayerSchema = z.object({
  userId: UUIDSchema,
  color: PlayerColorSchema.nullable(),
  isHost: z.boolean().default(false),
  isReady: z.boolean().default(false),
  isBot: z.boolean().default(false),
  botDifficulty: BotDifficultySchema.optional(),
  teamId: z.number().int().nullable(),
  joinedAt: TimestampSchema,
});
export type RoomPlayer = z.infer<typeof RoomPlayerSchema>;

export const RoomSchema = z.object({
  id: UUIDSchema,
  code: z.string().length(6).toUpperCase(),
  hostId: UUIDSchema,
  name: z.string().max(50).optional(),
  isPublic: z.boolean().default(true),
  hasPassword: z.boolean().default(false),
  passwordHash: z.string().nullable(),
  maxPlayers: z.number().int().min(2).max(4).default(4),
  entryFee: z.number().int().nonnegative().default(0),
  rules: GameRulesSchema,
  status: RoomStatusSchema,
  players: z.array(RoomPlayerSchema),
  spectators: z.array(UUIDSchema).default([]),
  matchId: UUIDSchema.nullable(),
  expiresAt: TimestampSchema,
  createdAt: TimestampSchema,
});
export type Room = z.infer<typeof RoomSchema>;

// ============================================
// TOURNAMENT TYPES
// ============================================

export const TournamentSchema = z.object({
  id: UUIDSchema,
  name: z.string().max(100),
  description: z.string().max(500).optional(),
  mode: z.enum(['knockout', 'scheduled']),
  maxParticipants: z.number().int().positive(),
  entryFee: z.number().int().nonnegative().default(0),
  prizeBreakdown: z.array(z.object({
    rank: z.number().int().positive(),
    percentage: z.number().min(0).max(100),
    fixedAmount: z.number().int().nonnegative().optional(),
  })),
  rules: GameRulesSchema,
  status: TournamentStatusSchema,
  registrationOpensAt: TimestampSchema,
  registrationClosesAt: TimestampSchema,
  checkInStartsAt: TimestampSchema.nullable(),
  checkInEndsAt: TimestampSchema.nullable(),
  startedAt: TimestampSchema.nullable(),
  completedAt: TimestampSchema.nullable(),
  createdAt: TimestampSchema,
  createdBy: UUIDSchema,
});
export type Tournament = z.infer<typeof TournamentSchema>;

export const TournamentRegistrationSchema = z.object({
  id: UUIDSchema,
  tournamentId: UUIDSchema,
  userId: UUIDSchema,
  registeredAt: TimestampSchema,
  checkedIn: z.boolean().default(false),
  checkedInAt: TimestampSchema.nullable(),
  seed: z.number().int().positive().nullable(),
  eliminatedAt: TimestampSchema.nullable(),
  finalRank: z.number().int().positive().nullable(),
  prizeWon: z.number().int().nonnegative().default(0),
});
export type TournamentRegistration = z.infer<typeof TournamentRegistrationSchema>;

// ============================================
// WEBSOCKET EVENTS
// ============================================

export const WSEventTypeSchema = z.enum([
  // Connection
  'connect',
  'disconnect',
  'authenticate',
  'authenticated',
  'auth_failed',
  // Matchmaking
  'join_queue',
  'leave_queue',
  'queue_update',
  'match_found',
  'match_ready',
  // Room
  'create_room',
  'join_room',
  'leave_room',
  'room_update',
  'room_player_ready',
  'room_kick_player',
  'room_transfer_host',
  'room_invite',
  'room_start',
  // Game
  'game_state',
  'roll_dice',
  'dice_rolled',
  'move_token',
  'move_result',
  'turn_change',
  'player_disconnected',
  'player_reconnected',
  'game_completed',
  'game_abandoned',
  // Chat
  'send_message',
  'new_message',
  'typing_start',
  'typing_stop',
  'message_read',
  // Notifications
  'notification',
  'friend_request',
  'friend_accepted',
  'invite_received',
  // Tournament
  'tournament_register',
  'tournament_check_in',
  'tournament_bracket_update',
  'tournament_match_ready',
  // Errors
  'error',
]);
export type WSEventType = z.infer<typeof WSEventTypeSchema>;

export const WSEventSchema = z.object({
  type: WSEventTypeSchema,
  payload: z.unknown(),
  timestamp: TimestampSchema,
  requestId: UUIDSchema.optional(),
});
export type WSEvent = z.infer<typeof WSEventSchema>;

// ============================================
// API RESPONSE TYPES
// ============================================

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.record(z.unknown()).optional(),
    }).optional(),
    meta: z.object({
      requestId: UUIDSchema,
      timestamp: TimestampSchema,
    }),
  });
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodTypeAny>>>;
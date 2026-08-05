"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseSchema = exports.WSEventSchema = exports.WSEventTypeSchema = exports.TournamentRegistrationSchema = exports.TournamentSchema = exports.RoomSchema = exports.RoomPlayerSchema = exports.MatchSchema = exports.MatchPlayerSchema = exports.GameStateSchema = exports.MoveSchema = exports.DiceRollSchema = exports.PlayerStateSchema = exports.TokenStateSchema = exports.GameRulesSchema = exports.TournamentStatusSchema = exports.RoomStatusSchema = exports.MatchStatusSchema = exports.BotDifficultySchema = exports.GameModeSchema = exports.PlayerColorSchema = exports.PaginatedResponseSchema = exports.PaginationSchema = exports.TimestampSchema = exports.UUIDSchema = void 0;
const zod_1 = require("zod");
// ============================================
// COMMON TYPES
// ============================================
exports.UUIDSchema = zod_1.z.string().uuid();
exports.TimestampSchema = zod_1.z.string().datetime();
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(20),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
const PaginatedResponseSchema = (itemSchema) => zod_1.z.object({
    data: zod_1.z.array(itemSchema),
    meta: zod_1.z.object({
        page: zod_1.z.number(),
        limit: zod_1.z.number(),
        total: zod_1.z.number(),
        totalPages: zod_1.z.number(),
    }),
});
exports.PaginatedResponseSchema = PaginatedResponseSchema;
// ============================================
// GAME TYPES
// ============================================
exports.PlayerColorSchema = zod_1.z.enum(['red', 'green', 'yellow', 'blue']);
exports.GameModeSchema = zod_1.z.enum([
    'vs_ai',
    'vs_human',
    'group',
    'private',
    'team',
    'tournament',
]);
exports.BotDifficultySchema = zod_1.z.enum(['easy', 'medium', 'hard']);
exports.MatchStatusSchema = zod_1.z.enum([
    'waiting',
    'starting',
    'in_progress',
    'completed',
    'cancelled',
    'abandoned',
]);
exports.RoomStatusSchema = zod_1.z.enum(['lobby', 'starting', 'in_progress', 'completed']);
exports.TournamentStatusSchema = zod_1.z.enum([
    'draft',
    'published',
    'registration_open',
    'registration_closed',
    'check_in',
    'in_progress',
    'completed',
    'cancelled',
]);
// ============================================
// GAME RULES CONFIGURATION
// ============================================
exports.GameRulesSchema = zod_1.z.object({
    tokensPerPlayer: zod_1.z.number().int().positive().default(4),
    entryRoll: zod_1.z.number().int().positive().default(6),
    allowThreeSixes: zod_1.z.boolean().default(true),
    extraTurnOnSix: zod_1.z.boolean().default(true),
    extraTurnOnCapture: zod_1.z.boolean().default(true),
    extraTurnOnHome: zod_1.z.boolean().default(true),
    turnTimeSeconds: zod_1.z.number().int().positive().default(30),
    reconnectionGraceSeconds: zod_1.z.number().int().positive().default(30),
    inactivityLimit: zod_1.z.number().int().positive().default(3),
    allowBlockades: zod_1.z.boolean().default(false),
    safeCells: zod_1.z.array(zod_1.z.number().int().min(0).max(51)).default([0, 8, 13, 21, 26, 34, 39, 47]),
    teamMode: zod_1.z.boolean().default(false),
    botDifficulty: exports.BotDifficultySchema.default('medium'),
});
// ============================================
// GAME STATE
// ============================================
exports.TokenStateSchema = zod_1.z.object({
    id: zod_1.z.number().int().min(0).max(3),
    position: zod_1.z.number().int().min(-1).max(56), // -1 = home, 0-51 = track, 52-55 = home lane, 56 = finished
    isInHome: zod_1.z.boolean(),
    isFinished: zod_1.z.boolean(),
});
exports.PlayerStateSchema = zod_1.z.object({
    userId: exports.UUIDSchema,
    color: exports.PlayerColorSchema,
    tokens: zod_1.z.array(exports.TokenStateSchema).length(4),
    isActive: zod_1.z.boolean(),
    isConnected: zod_1.z.boolean(),
    hasRolled: zod_1.z.boolean(),
    lastMoveAt: exports.TimestampSchema.optional(),
    consecutiveSixes: zod_1.z.number().int().min(0).max(3).default(0),
    isBot: zod_1.z.boolean().default(false),
    botDifficulty: exports.BotDifficultySchema.optional(),
    teamId: zod_1.z.number().int().optional(), // for team mode
});
exports.DiceRollSchema = zod_1.z.object({
    value: zod_1.z.number().int().min(1).max(6),
    rolledAt: exports.TimestampSchema,
    rolledBy: exports.UUIDSchema,
    isServerGenerated: zod_1.z.boolean().default(true),
    auditId: exports.UUIDSchema,
});
exports.MoveSchema = zod_1.z.object({
    tokenId: zod_1.z.number().int().min(0).max(3),
    fromPosition: zod_1.z.number().int().min(-1).max(55),
    toPosition: zod_1.z.number().int().min(0).max(56),
    capturedTokens: zod_1.z.array(zod_1.z.object({
        playerId: exports.UUIDSchema,
        tokenId: zod_1.z.number().int().min(0).max(3),
        fromPosition: zod_1.z.number().int(),
    })),
    isExtraTurn: zod_1.z.boolean(),
    gameStateVersion: zod_1.z.number().int().positive(),
});
exports.GameStateSchema = zod_1.z.object({
    matchId: exports.UUIDSchema,
    roomId: exports.UUIDSchema.optional(),
    tournamentId: exports.UUIDSchema.optional(),
    mode: exports.GameModeSchema,
    rules: exports.GameRulesSchema,
    players: zod_1.z.array(exports.PlayerStateSchema).length(4),
    currentPlayerIndex: zod_1.z.number().int().min(0).max(3),
    diceRoll: exports.DiceRollSchema.optional(),
    legalMoves: zod_1.z.array(zod_1.z.object({
        tokenId: zod_1.z.number().int().min(0).max(3),
        fromPosition: zod_1.z.number().int(),
        toPosition: zod_1.z.number().int(),
    })),
    moveHistory: zod_1.z.array(exports.MoveSchema),
    stateVersion: zod_1.z.number().int().positive().default(1),
    status: exports.MatchStatusSchema,
    winner: exports.UUIDSchema.nullable(),
    rankings: zod_1.z.array(exports.UUIDSchema),
    startedAt: exports.TimestampSchema.optional(),
    completedAt: exports.TimestampSchema.optional(),
    createdAt: exports.TimestampSchema,
});
// ============================================
// MATCH TYPES
// ============================================
exports.MatchPlayerSchema = zod_1.z.object({
    userId: exports.UUIDSchema,
    color: exports.PlayerColorSchema,
    isBot: zod_1.z.boolean().default(false),
    botDifficulty: exports.BotDifficultySchema.optional(),
    teamId: zod_1.z.number().int().optional(),
    joinedAt: exports.TimestampSchema,
    leftAt: exports.TimestampSchema.nullable(),
    finalRank: zod_1.z.number().int().positive().nullable(),
    coinsWon: zod_1.z.number().int().default(0),
    coinsLost: zod_1.z.number().int().default(0),
});
exports.MatchSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    mode: exports.GameModeSchema,
    roomId: exports.UUIDSchema.nullable(),
    tournamentId: exports.UUIDSchema.nullable(),
    players: zod_1.z.array(exports.MatchPlayerSchema),
    entryFee: zod_1.z.number().int().nonnegative().default(0),
    prizePool: zod_1.z.number().int().nonnegative().default(0),
    platformFee: zod_1.z.number().int().nonnegative().default(0),
    status: exports.MatchStatusSchema,
    winnerId: exports.UUIDSchema.nullable(),
    gameState: exports.GameStateSchema.nullable(),
    startedAt: exports.TimestampSchema.nullable(),
    completedAt: exports.TimestampSchema.nullable(),
    createdAt: exports.TimestampSchema,
});
// ============================================
// ROOM TYPES
// ============================================
exports.RoomPlayerSchema = zod_1.z.object({
    userId: exports.UUIDSchema,
    color: exports.PlayerColorSchema.nullable(),
    isHost: zod_1.z.boolean().default(false),
    isReady: zod_1.z.boolean().default(false),
    isBot: zod_1.z.boolean().default(false),
    botDifficulty: exports.BotDifficultySchema.optional(),
    teamId: zod_1.z.number().int().nullable(),
    joinedAt: exports.TimestampSchema,
});
exports.RoomSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    code: zod_1.z.string().length(6).toUpperCase(),
    hostId: exports.UUIDSchema,
    name: zod_1.z.string().max(50).optional(),
    isPublic: zod_1.z.boolean().default(true),
    hasPassword: zod_1.z.boolean().default(false),
    passwordHash: zod_1.z.string().nullable(),
    maxPlayers: zod_1.z.number().int().min(2).max(4).default(4),
    entryFee: zod_1.z.number().int().nonnegative().default(0),
    rules: exports.GameRulesSchema,
    status: exports.RoomStatusSchema,
    players: zod_1.z.array(exports.RoomPlayerSchema),
    spectators: zod_1.z.array(exports.UUIDSchema).default([]),
    matchId: exports.UUIDSchema.nullable(),
    expiresAt: exports.TimestampSchema,
    createdAt: exports.TimestampSchema,
});
// ============================================
// TOURNAMENT TYPES
// ============================================
exports.TournamentSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    name: zod_1.z.string().max(100),
    description: zod_1.z.string().max(500).optional(),
    mode: zod_1.z.enum(['knockout', 'scheduled']),
    maxParticipants: zod_1.z.number().int().positive(),
    entryFee: zod_1.z.number().int().nonnegative().default(0),
    prizeBreakdown: zod_1.z.array(zod_1.z.object({
        rank: zod_1.z.number().int().positive(),
        percentage: zod_1.z.number().min(0).max(100),
        fixedAmount: zod_1.z.number().int().nonnegative().optional(),
    })),
    rules: exports.GameRulesSchema,
    status: exports.TournamentStatusSchema,
    registrationOpensAt: exports.TimestampSchema,
    registrationClosesAt: exports.TimestampSchema,
    checkInStartsAt: exports.TimestampSchema.nullable(),
    checkInEndsAt: exports.TimestampSchema.nullable(),
    startedAt: exports.TimestampSchema.nullable(),
    completedAt: exports.TimestampSchema.nullable(),
    createdAt: exports.TimestampSchema,
    createdBy: exports.UUIDSchema,
});
exports.TournamentRegistrationSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    tournamentId: exports.UUIDSchema,
    userId: exports.UUIDSchema,
    registeredAt: exports.TimestampSchema,
    checkedIn: zod_1.z.boolean().default(false),
    checkedInAt: exports.TimestampSchema.nullable(),
    seed: zod_1.z.number().int().positive().nullable(),
    eliminatedAt: exports.TimestampSchema.nullable(),
    finalRank: zod_1.z.number().int().positive().nullable(),
    prizeWon: zod_1.z.number().int().nonnegative().default(0),
});
// ============================================
// WEBSOCKET EVENTS
// ============================================
exports.WSEventTypeSchema = zod_1.z.enum([
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
exports.WSEventSchema = zod_1.z.object({
    type: exports.WSEventTypeSchema,
    payload: zod_1.z.unknown(),
    timestamp: exports.TimestampSchema,
    requestId: exports.UUIDSchema.optional(),
});
// ============================================
// API RESPONSE TYPES
// ============================================
const ApiResponseSchema = (dataSchema) => zod_1.z.object({
    success: zod_1.z.boolean(),
    data: dataSchema.optional(),
    error: zod_1.z.object({
        code: zod_1.z.string(),
        message: zod_1.z.string(),
        details: zod_1.z.record(zod_1.z.unknown()).optional(),
    }).optional(),
    meta: zod_1.z.object({
        requestId: exports.UUIDSchema,
        timestamp: exports.TimestampSchema,
    }),
});
exports.ApiResponseSchema = ApiResponseSchema;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentSchemas = exports.RoomSchemas = exports.TournamentBracketSchema = exports.TournamentActionSchema = exports.CreateTournamentSchema = exports.RoomActionSchema = exports.JoinRoomSchema = exports.CreateRoomSchema = exports.RoomInviteSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../game/types");
// ============================================
// ROOM TYPES
// ============================================
exports.RoomInviteSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    roomId: types_1.UUIDSchema,
    invitedBy: types_1.UUIDSchema,
    invitedUserId: types_1.UUIDSchema,
    status: zod_1.z.enum(['pending', 'accepted', 'declined', 'expired']),
    expiresAt: types_1.TimestampSchema,
    createdAt: types_1.TimestampSchema,
});
exports.CreateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().max(50).optional(),
    isPublic: zod_1.z.boolean().default(true),
    password: zod_1.z.string().min(4).max(20).optional(),
    maxPlayers: zod_1.z.number().int().min(2).max(4).default(4),
    entryFee: zod_1.z.number().int().nonnegative().default(0),
    rules: zod_1.z.object({
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
        botDifficulty: zod_1.z.enum(['easy', 'medium', 'hard']).default('medium'),
    }).optional(),
    botFill: zod_1.z.boolean().default(false),
    allowSpectators: zod_1.z.boolean().default(true),
});
exports.JoinRoomSchema = zod_1.z.object({
    roomCode: zod_1.z.string().length(6).toUpperCase(),
    password: zod_1.z.string().optional(),
});
exports.RoomActionSchema = zod_1.z.object({
    roomId: types_1.UUIDSchema,
    action: zod_1.z.enum(['ready', 'unready', 'kick', 'transfer_host', 'invite', 'start']),
    targetUserId: types_1.UUIDSchema.optional(),
    inviteUserId: types_1.UUIDSchema.optional(),
});
// ============================================
// TOURNAMENT TYPES
// ============================================
exports.CreateTournamentSchema = zod_1.z.object({
    name: zod_1.z.string().max(100),
    description: zod_1.z.string().max(500).optional(),
    mode: zod_1.z.enum(['knockout', 'scheduled']),
    maxParticipants: zod_1.z.number().int().positive(),
    entryFee: zod_1.z.number().int().nonnegative().default(0),
    prizeBreakdown: zod_1.z.array(zod_1.z.object({
        rank: zod_1.z.number().int().positive(),
        percentage: zod_1.z.number().min(0).max(100),
        fixedAmount: zod_1.z.number().int().nonnegative().optional(),
    })).min(1),
    rules: zod_1.z.object({
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
        botDifficulty: zod_1.z.enum(['easy', 'medium', 'hard']).default('medium'),
    }),
    registrationOpensAt: zod_1.z.string().datetime(),
    registrationClosesAt: zod_1.z.string().datetime(),
    checkInStartsAt: zod_1.z.string().datetime().optional(),
    checkInEndsAt: zod_1.z.string().datetime().optional(),
}).refine(data => new Date(data.registrationClosesAt) > new Date(data.registrationOpensAt), {
    message: 'Registration must close after it opens',
    path: ['registrationClosesAt'],
}).refine(data => !data.checkInStartsAt || !data.checkInEndsAt || new Date(data.checkInEndsAt) > new Date(data.checkInStartsAt), {
    message: 'Check-in must end after it starts',
    path: ['checkInEndsAt'],
});
exports.TournamentActionSchema = zod_1.z.object({
    tournamentId: types_1.UUIDSchema,
    action: zod_1.z.enum(['register', 'unregister', 'check_in', 'cancel', 'publish']),
});
exports.TournamentBracketSchema = zod_1.z.object({
    tournamentId: types_1.UUIDSchema,
    rounds: zod_1.z.array(zod_1.z.object({
        roundNumber: zod_1.z.number().int().positive(),
        matches: zod_1.z.array(zod_1.z.object({
            matchId: types_1.UUIDSchema.nullable(),
            player1: zod_1.z.object({
                registrationId: types_1.UUIDSchema,
                userId: types_1.UUIDSchema,
                username: zod_1.z.string(),
            }).nullable(),
            player2: zod_1.z.object({
                registrationId: types_1.UUIDSchema,
                userId: types_1.UUIDSchema,
                username: zod_1.z.string(),
            }).nullable(),
            winnerRegistrationId: types_1.UUIDSchema.nullable(),
            status: zod_1.z.enum(['pending', 'ready', 'in_progress', 'completed', 'walkover']),
            scheduledAt: types_1.TimestampSchema.nullable(),
        })),
    })),
});
// ============================================
// EXPORTS
// ============================================
exports.RoomSchemas = {
    RoomInvite: exports.RoomInviteSchema,
    CreateRoom: exports.CreateRoomSchema,
    JoinRoom: exports.JoinRoomSchema,
    RoomAction: exports.RoomActionSchema,
};
exports.TournamentSchemas = {
    CreateTournament: exports.CreateTournamentSchema,
    TournamentAction: exports.TournamentActionSchema,
    TournamentBracket: exports.TournamentBracketSchema,
};

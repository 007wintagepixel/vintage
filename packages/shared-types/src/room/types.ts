import { z } from 'zod';
import { UUIDSchema, TimestampSchema, PaginationSchema } from '../game/types';

// ============================================
// ROOM TYPES
// ============================================

export const RoomInviteSchema = z.object({
  id: UUIDSchema,
  roomId: UUIDSchema,
  invitedBy: UUIDSchema,
  invitedUserId: UUIDSchema,
  status: z.enum(['pending', 'accepted', 'declined', 'expired']),
  expiresAt: TimestampSchema,
  createdAt: TimestampSchema,
});
export type RoomInvite = z.infer<typeof RoomInviteSchema>;

export const CreateRoomSchema = z.object({
  name: z.string().max(50).optional(),
  isPublic: z.boolean().default(true),
  password: z.string().min(4).max(20).optional(),
  maxPlayers: z.number().int().min(2).max(4).default(4),
  entryFee: z.number().int().nonnegative().default(0),
  rules: z.object({
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
    botDifficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  }).optional(),
  botFill: z.boolean().default(false),
  allowSpectators: z.boolean().default(true),
});
export type CreateRoom = z.infer<typeof CreateRoomSchema>;

export const JoinRoomSchema = z.object({
  roomCode: z.string().length(6).toUpperCase(),
  password: z.string().optional(),
});
export type JoinRoom = z.infer<typeof JoinRoomSchema>;

export const RoomActionSchema = z.object({
  roomId: UUIDSchema,
  action: z.enum(['ready', 'unready', 'kick', 'transfer_host', 'invite', 'start']),
  targetUserId: UUIDSchema.optional(),
  inviteUserId: UUIDSchema.optional(),
});
export type RoomAction = z.infer<typeof RoomActionSchema>;

// ============================================
// TOURNAMENT TYPES
// ============================================

export const CreateTournamentSchema = z.object({
  name: z.string().max(100),
  description: z.string().max(500).optional(),
  mode: z.enum(['knockout', 'scheduled']),
  maxParticipants: z.number().int().positive(),
  entryFee: z.number().int().nonnegative().default(0),
  prizeBreakdown: z.array(z.object({
    rank: z.number().int().positive(),
    percentage: z.number().min(0).max(100),
    fixedAmount: z.number().int().nonnegative().optional(),
  })).min(1),
  rules: z.object({
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
    botDifficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  }),
  registrationOpensAt: z.string().datetime(),
  registrationClosesAt: z.string().datetime(),
  checkInStartsAt: z.string().datetime().optional(),
  checkInEndsAt: z.string().datetime().optional(),
}).refine(data => new Date(data.registrationClosesAt) > new Date(data.registrationOpensAt), {
  message: 'Registration must close after it opens',
  path: ['registrationClosesAt'],
}).refine(data => !data.checkInStartsAt || !data.checkInEndsAt || new Date(data.checkInEndsAt) > new Date(data.checkInStartsAt), {
  message: 'Check-in must end after it starts',
  path: ['checkInEndsAt'],
});
export type CreateTournament = z.infer<typeof CreateTournamentSchema>;

export const TournamentActionSchema = z.object({
  tournamentId: UUIDSchema,
  action: z.enum(['register', 'unregister', 'check_in', 'cancel', 'publish']),
});
export type TournamentAction = z.infer<typeof TournamentActionSchema>;

export const TournamentBracketSchema = z.object({
  tournamentId: UUIDSchema,
  rounds: z.array(z.object({
    roundNumber: z.number().int().positive(),
    matches: z.array(z.object({
      matchId: UUIDSchema.nullable(),
      player1: z.object({
        registrationId: UUIDSchema,
        userId: UUIDSchema,
        username: z.string(),
      }).nullable(),
      player2: z.object({
        registrationId: UUIDSchema,
        userId: UUIDSchema,
        username: z.string(),
      }).nullable(),
      winnerRegistrationId: UUIDSchema.nullable(),
      status: z.enum(['pending', 'ready', 'in_progress', 'completed', 'walkover']),
      scheduledAt: TimestampSchema.nullable(),
    })),
  })),
});
export type TournamentBracket = z.infer<typeof TournamentBracketSchema>;

// ============================================
// EXPORTS
// ============================================

export const RoomSchemas = {
  RoomInvite: RoomInviteSchema,
  CreateRoom: CreateRoomSchema,
  JoinRoom: JoinRoomSchema,
  RoomAction: RoomActionSchema,
};

export const TournamentSchemas = {
  CreateTournament: CreateTournamentSchema,
  TournamentAction: TournamentActionSchema,
  TournamentBracket: TournamentBracketSchema,
};
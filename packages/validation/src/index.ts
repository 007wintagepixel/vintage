// ============================================
// @ludo-nexus/validation - Shared Zod Schemas
// Re-exports from shared-types for validation layer
// ============================================

import { z } from 'zod';

// Re-export all schemas from shared-types
export * from '@ludo-nexus/shared-types';

// Additional validation-only schemas

// ============================================
// COMMON VALIDATION HELPERS
// ============================================

export const emailSchema = z.string().email({ message: 'Invalid email address' });
export const phoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number (E.164 format required)' });
export const passwordSchema = z.string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(128)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  });
export const usernameSchema = z.string()
  .min(3, { message: 'Username must be at least 3 characters' })
  .max(20, { message: 'Username must be at most 20 characters' })
  .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' });
export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' });
export const countryCodeSchema = z.string().length(2, { message: 'Country code must be 2 letters (ISO 3166-1)' }).toUpperCase();
export const otpSchema = z.string().length(6).regex(/^\d{6}$/, { message: 'OTP must be 6 digits' });

// ============================================
// PAGINATION VALIDATION
// ============================================

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// ============================================
// ID PARAM VALIDATION
// ============================================

export const idParamSchema = z.object({
  id: uuidSchema,
});
export type IdParam = z.infer<typeof idParamSchema>;

// ============================================
// GAME VALIDATION
// ============================================

export const createMatchSchema = z.object({
  mode: z.enum(['vs_ai', 'vs_human', 'group', 'private', 'team', 'tournament']),
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
  opponentCount: z.number().int().min(1).max(3).optional(), // for vs_ai
  botDifficulty: z.enum(['easy', 'medium', 'hard']).optional(), // for vs_ai
});
export type CreateMatch = z.infer<typeof createMatchSchema>;

export const joinMatchSchema = z.object({
  matchId: uuidSchema,
  idempotencyKey: z.string().max(100),
});
export type JoinMatch = z.infer<typeof joinMatchSchema>;

export const rollDiceSchema = z.object({
  matchId: uuidSchema,
  idempotencyKey: z.string().max(100),
});
export type RollDice = z.infer<typeof rollDiceSchema>;

export const moveTokenSchema = z.object({
  matchId: uuidSchema,
  tokenId: z.number().int().min(0).max(3),
  toPosition: z.number().int().min(-1).max(56),
  gameStateVersion: z.number().int().positive(),
  idempotencyKey: z.string().max(100),
});
export type MoveToken = z.infer<typeof moveTokenSchema>;

export const reconnectMatchSchema = z.object({
  matchId: uuidSchema,
});
export type ReconnectMatch = z.infer<typeof reconnectMatchSchema>;

// ============================================
// ROOM VALIDATION
// ============================================

export const createRoomSchema = z.object({
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
export type CreateRoom = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  roomCode: z.string().length(6).toUpperCase(),
  password: z.string().optional(),
});
export type JoinRoom = z.infer<typeof joinRoomSchema>;

export const roomActionSchema = z.object({
  roomId: uuidSchema,
  action: z.enum(['ready', 'unready', 'kick', 'transfer_host', 'invite', 'start']),
  targetUserId: uuidSchema.optional(),
  inviteUserId: uuidSchema.optional(),
});
export type RoomAction = z.infer<typeof roomActionSchema>;

// ============================================
// TOURNAMENT VALIDATION
// ============================================

export const createTournamentSchema = z.object({
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
export type CreateTournament = z.infer<typeof createTournamentSchema>;

export const tournamentActionSchema = z.object({
  tournamentId: uuidSchema,
  action: z.enum(['register', 'unregister', 'check_in', 'cancel', 'publish']),
});
export type TournamentAction = z.infer<typeof tournamentActionSchema>;

// ============================================
// WALLET VALIDATION
// ============================================

export const depositSchema = z.object({
  amount: z.number().int().positive({ message: 'Amount must be positive' }),
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'wallet']),
  paymentProvider: z.string().max(50).optional(),
  returnUrl: z.string().url().optional(),
});
export type Deposit = z.infer<typeof depositSchema>;

export const withdrawalSchema = z.object({
  amount: z.number().int().positive({ message: 'Amount must be positive' }),
  destinationMethod: z.enum(['upi', 'bank_transfer']),
  destinationDetails: z.object({
    upiId: z.string().max(100).optional(),
    accountNumber: z.string().max(50).optional(),
    ifsc: z.string().max(20).optional(),
    accountHolderName: z.string().max(100).optional(),
  }),
  otp: otpSchema,
});
export type Withdrawal = z.infer<typeof withdrawalSchema>;

export const transactionFilterSchema = z.object({
  type: z.enum(['deposit', 'withdrawal', 'match', 'tournament', 'bonus', 'refund', 'transfer']).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed']).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  minAmount: z.number().int().optional(),
  maxAmount: z.number().int().optional(),
}).merge(paginationQuerySchema);
export type TransactionFilter = z.infer<typeof transactionFilterSchema>;

// ============================================
// CHAT VALIDATION
// ============================================

export const sendMessageSchema = z.object({
  conversationId: uuidSchema,
  content: z.string().min(1).max(2000),
  type: z.enum(['text', 'emoji', 'game_action']).default('text'),
  replyTo: uuidSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});
export type SendMessage = z.infer<typeof sendMessageSchema>;

export const createConversationSchema = z.object({
  type: z.enum(['private', 'team', 'support']),
  participantIds: z.array(uuidSchema).min(1).max(50),
  teamId: z.number().int().optional(),
  initialMessage: z.string().max(2000).optional(),
});
export type CreateConversation = z.infer<typeof createConversationSchema>;

export const messageQuerySchema = z.object({
  conversationId: uuidSchema,
  before: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
});
export type MessageQuery = z.infer<typeof messageQuerySchema>;

// ============================================
// FRIEND VALIDATION
// ============================================

export const sendFriendRequestSchema = z.object({
  username: usernameSchema.optional(),
  userId: uuidSchema.optional(),
  message: z.string().max(200).optional(),
}).refine(data => data.username || data.userId, {
  message: 'Either username or userId must be provided',
});
export type SendFriendRequest = z.infer<typeof sendFriendRequestSchema>;

export const friendActionSchema = z.object({
  requestId: uuidSchema.optional(),
  friendId: uuidSchema.optional(),
  action: z.enum(['accept', 'decline', 'cancel', 'remove', 'block', 'unblock']),
}).refine(data => data.requestId || data.friendId, {
  message: 'Either requestId or friendId must be provided',
});
export type FriendAction = z.infer<typeof friendActionSchema>;

export const userSearchSchema = z.object({
  query: z.string().min(1).max(50),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
export type UserSearch = z.infer<typeof userSearchSchema>;

// ============================================
// PROFILE VALIDATION
// ============================================

export const updateProfileSchema = z.object({
  displayName: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  country: countryCodeSchema.optional(),
  language: z.string().max(10).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  privacySettings: z.object({
    showOnlineStatus: z.boolean().default(true),
    showMatchHistory: z.boolean().default(true),
    allowFriendRequests: z.boolean().default(true),
    allowPrivateChat: z.boolean().default(true),
    allowGameInvites: z.boolean().default(true),
  }).optional(),
});
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
export type ChangePassword = z.infer<typeof changePasswordSchema>;

// ============================================
// KYC VALIDATION
// ============================================

export const kycSubmissionSchema = z.object({
  fullName: z.string().max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nationality: countryCodeSchema,
  address: z.object({
    street: z.string().max(200),
    city: z.string().max(100),
    state: z.string().max(100),
    postalCode: z.string().max(20),
    country: countryCodeSchema,
  }),
  documents: z.array(z.object({
    type: z.enum(['identity', 'address', 'age']),
    documentType: z.enum(['passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement']),
    fileUrl: z.string().url(),
  })).min(2).max(5),
});
export type KYCSubmission = z.infer<typeof kycSubmissionSchema>;

// ============================================
// ADMIN VALIDATION
// ============================================

export const createAdminSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  fullName: z.string().max(100),
  password: passwordSchema,
  role: z.enum(['admin', 'moderator', 'support']),
  permissions: z.array(z.string()).optional(),
});
export type CreateAdmin = z.infer<typeof createAdminSchema>;

export const updateGameSettingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string().max(100),
    value: z.unknown(),
  })).min(1),
});
export type UpdateGameSettings = z.infer<typeof updateGameSettingsSchema>;

export const adminUserFilterSchema = z.object({
  search: z.string().optional(),
  kycStatus: z.enum(['not_started', 'draft', 'submitted', 'under_review', 'additional_info', 'verified', 'rejected', 'expired']).optional(),
  isActive: z.boolean().optional(),
  isBanned: z.boolean().optional(),
}).merge(paginationQuerySchema);
export type AdminUserFilter = z.infer<typeof adminUserFilterSchema>;

// ============================================
// VALIDATION MIDDLEWARE HELPER
// ============================================

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new ValidationError('Validation failed', errors);
    }
    return result.data;
  };
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new ValidationError('Query validation failed', errors);
    }
    return result.data;
  };
}

export function validateParams<T extends z.ZodTypeAny>(schema: T) {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new ValidationError('Params validation failed', errors);
    }
    return result.data;
  };
}

export class ValidationError extends Error {
  public readonly errors: Array<{ field: string; message: string }>;
  
  constructor(message: string, errors: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// ============================================
// EXPORTS
// ============================================

export const Validation = {
  // Common
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  username: usernameSchema,
  uuid: uuidSchema,
  countryCode: countryCodeSchema,
  otp: otpSchema,
  pagination: paginationQuerySchema,
  idParam: idParamSchema,
  
  // Game
  createMatch: createMatchSchema,
  joinMatch: joinMatchSchema,
  rollDice: rollDiceSchema,
  moveToken: moveTokenSchema,
  reconnectMatch: reconnectMatchSchema,
  
  // Room
  createRoom: createRoomSchema,
  joinRoom: joinRoomSchema,
  roomAction: roomActionSchema,
  
  // Tournament
  createTournament: createTournamentSchema,
  tournamentAction: tournamentActionSchema,
  
  // Wallet
  deposit: depositSchema,
  withdrawal: withdrawalSchema,
  transactionFilter: transactionFilterSchema,
  
  // Chat
  sendMessage: sendMessageSchema,
  createConversation: createConversationSchema,
  messageQuery: messageQuerySchema,
  
  // Friend
  sendFriendRequest: sendFriendRequestSchema,
  friendAction: friendActionSchema,
  userSearch: userSearchSchema,
  
  // Profile
  updateProfile: updateProfileSchema,
  changePassword: changePasswordSchema,
  
  // KYC
  kycSubmission: kycSubmissionSchema,
  
  // Admin
  createAdmin: createAdminSchema,
  updateGameSettings: updateGameSettingsSchema,
  adminUserFilter: adminUserFilterSchema,
  
  // Helpers
  validateBody,
  validateQuery,
  validateParams,
  ValidationError,
};
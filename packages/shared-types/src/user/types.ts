import { z } from 'zod';
import { UUIDSchema, TimestampSchema, PaginationSchema } from '../game/types';

// ============================================
// USER TYPES
// ============================================

export const UserProfileSchema = z.object({
  id: UUIDSchema,
  username: z.string().min(3).max(20),
  fullName: z.string().max(100),
  email: z.string().email(),
  country: z.string().length(2),
  mobileNumber: z.string(),
  avatarUrl: z.string().url().nullable(),
  isVerified: z.boolean().default(false),
  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  kycStatus: z.enum(['not_started', 'draft', 'submitted', 'under_review', 'additional_info', 'verified', 'rejected', 'expired']).default('not_started'),
  level: z.number().int().positive().default(1),
  experience: z.number().int().nonnegative().default(0),
  experienceToNextLevel: z.number().int().positive().default(1000),
  totalMatches: z.number().int().nonnegative().default(0),
  wins: z.number().int().nonnegative().default(0),
  losses: z.number().int().nonnegative().default(0),
  winRate: z.number().min(0).max(100).default(0),
  currentStreak: z.number().int().default(0),
  bestStreak: z.number().int().nonnegative().default(0),
  demoCoinsEarned: z.number().int().nonnegative().default(0),
  tournamentsWon: z.number().int().nonnegative().default(0),
  referralCode: z.string().max(20),
  referredBy: UUIDSchema.nullable(),
  createdAt: TimestampSchema,
  lastLoginAt: TimestampSchema.nullable(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UpdateProfileSchema = z.object({
  displayName: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  country: z.string().length(2).optional(),
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
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export const UserStatsSchema = z.object({
  totalMatches: z.number().int().nonnegative(),
  wins: z.number().int().nonnegative(),
  losses: z.number().int().nonnegative(),
  draws: z.number().int().nonnegative(),
  winRate: z.number().min(0).max(100),
  vsAI: z.object({
    played: z.number().int().nonnegative(),
    won: z.number().int().nonnegative(),
  }),
  vsHuman: z.object({
    played: z.number().int().nonnegative(),
    won: z.number().int().nonnegative(),
  }),
  team: z.object({
    played: z.number().int().nonnegative(),
    won: z.number().int().nonnegative(),
  }),
  tournament: z.object({
    played: z.number().int().nonnegative(),
    won: z.number().int().nonnegative(),
  }),
  averageGameDuration: z.number().nonnegative(),
  favoriteColor: z.enum(['red', 'green', 'yellow', 'blue']).nullable(),
  mostCapturesInGame: z.number().int().nonnegative(),
  perfectGames: z.number().int().nonnegative(),
});
export type UserStats = z.infer<typeof UserStatsSchema>;

export const AchievementSchema = z.object({
  id: UUIDSchema,
  code: z.string().max(50),
  name: z.string().max(100),
  description: z.string().max(500),
  icon: z.string().max(100),
  category: z.enum(['gameplay', 'social', 'tournament', 'streak', 'special']),
  requirement: z.object({
    type: z.string(),
    value: z.number(),
  }),
  reward: z.object({
    type: z.enum(['demo_coins', 'badge', 'title', 'avatar_frame']),
    value: z.number().int().nonnegative().optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
  isSecret: z.boolean().default(false),
  createdAt: TimestampSchema,
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const UserAchievementSchema = z.object({
  userId: UUIDSchema,
  achievementId: UUIDSchema,
  unlockedAt: TimestampSchema,
  progress: z.number().int().nonnegative().default(0),
  isCompleted: z.boolean().default(false),
});
export type UserAchievement = z.infer<typeof UserAchievementSchema>;

// ============================================
// KYC TYPES
// ============================================

export const KYCDocumentSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  type: z.enum(['identity', 'address', 'age']),
  documentType: z.enum(['passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement']),
  fileUrl: z.string().url(),
  status: z.enum(['pending', 'approved', 'rejected']),
  reviewedAt: TimestampSchema.nullable(),
  reviewedBy: UUIDSchema.nullable(),
  rejectionReason: z.string().nullable(),
  createdAt: TimestampSchema,
});
export type KYCDocument = z.infer<typeof KYCDocumentSchema>;

export const KYCSubmissionSchema = z.object({
  userId: UUIDSchema,
  fullName: z.string().max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nationality: z.string().length(2),
  address: z.object({
    street: z.string().max(200),
    city: z.string().max(100),
    state: z.string().max(100),
    postalCode: z.string().max(20),
    country: z.string().length(2),
  }),
  documents: z.array(z.object({
    type: z.enum(['identity', 'address', 'age']),
    documentType: z.enum(['passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement']),
    fileUrl: z.string().url(),
  })).min(2).max(5),
});
export type KYCSubmission = z.infer<typeof KYCSubmissionSchema>;

// ============================================
// EXPORTS
// ============================================

export const UserSchemas = {
  UserProfile: UserProfileSchema,
  UpdateProfile: UpdateProfileSchema,
  UserStats: UserStatsSchema,
  Achievement: AchievementSchema,
  UserAchievement: UserAchievementSchema,
  KYCDocument: KYCDocumentSchema,
  KYCSubmission: KYCSubmissionSchema,
};
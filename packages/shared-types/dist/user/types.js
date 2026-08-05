"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemas = exports.KYCSubmissionSchema = exports.KYCDocumentSchema = exports.UserAchievementSchema = exports.AchievementSchema = exports.UserStatsSchema = exports.UpdateProfileSchema = exports.UserProfileSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../game/types");
// ============================================
// USER TYPES
// ============================================
exports.UserProfileSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    username: zod_1.z.string().min(3).max(20),
    fullName: zod_1.z.string().max(100),
    email: zod_1.z.string().email(),
    country: zod_1.z.string().length(2),
    mobileNumber: zod_1.z.string(),
    avatarUrl: zod_1.z.string().url().nullable(),
    isVerified: zod_1.z.boolean().default(false),
    isEmailVerified: zod_1.z.boolean().default(false),
    isPhoneVerified: zod_1.z.boolean().default(false),
    kycStatus: zod_1.z.enum(['not_started', 'draft', 'submitted', 'under_review', 'additional_info', 'verified', 'rejected', 'expired']).default('not_started'),
    level: zod_1.z.number().int().positive().default(1),
    experience: zod_1.z.number().int().nonnegative().default(0),
    experienceToNextLevel: zod_1.z.number().int().positive().default(1000),
    totalMatches: zod_1.z.number().int().nonnegative().default(0),
    wins: zod_1.z.number().int().nonnegative().default(0),
    losses: zod_1.z.number().int().nonnegative().default(0),
    winRate: zod_1.z.number().min(0).max(100).default(0),
    currentStreak: zod_1.z.number().int().default(0),
    bestStreak: zod_1.z.number().int().nonnegative().default(0),
    demoCoinsEarned: zod_1.z.number().int().nonnegative().default(0),
    tournamentsWon: zod_1.z.number().int().nonnegative().default(0),
    referralCode: zod_1.z.string().max(20),
    referredBy: types_1.UUIDSchema.nullable(),
    createdAt: types_1.TimestampSchema,
    lastLoginAt: types_1.TimestampSchema.nullable(),
});
exports.UpdateProfileSchema = zod_1.z.object({
    displayName: zod_1.z.string().max(50).optional(),
    bio: zod_1.z.string().max(500).optional(),
    country: zod_1.z.string().length(2).optional(),
    language: zod_1.z.string().max(10).optional(),
    avatarUrl: zod_1.z.string().url().nullable().optional(),
    privacySettings: zod_1.z.object({
        showOnlineStatus: zod_1.z.boolean().default(true),
        showMatchHistory: zod_1.z.boolean().default(true),
        allowFriendRequests: zod_1.z.boolean().default(true),
        allowPrivateChat: zod_1.z.boolean().default(true),
        allowGameInvites: zod_1.z.boolean().default(true),
    }).optional(),
});
exports.UserStatsSchema = zod_1.z.object({
    totalMatches: zod_1.z.number().int().nonnegative(),
    wins: zod_1.z.number().int().nonnegative(),
    losses: zod_1.z.number().int().nonnegative(),
    draws: zod_1.z.number().int().nonnegative(),
    winRate: zod_1.z.number().min(0).max(100),
    vsAI: zod_1.z.object({
        played: zod_1.z.number().int().nonnegative(),
        won: zod_1.z.number().int().nonnegative(),
    }),
    vsHuman: zod_1.z.object({
        played: zod_1.z.number().int().nonnegative(),
        won: zod_1.z.number().int().nonnegative(),
    }),
    team: zod_1.z.object({
        played: zod_1.z.number().int().nonnegative(),
        won: zod_1.z.number().int().nonnegative(),
    }),
    tournament: zod_1.z.object({
        played: zod_1.z.number().int().nonnegative(),
        won: zod_1.z.number().int().nonnegative(),
    }),
    averageGameDuration: zod_1.z.number().nonnegative(),
    favoriteColor: zod_1.z.enum(['red', 'green', 'yellow', 'blue']).nullable(),
    mostCapturesInGame: zod_1.z.number().int().nonnegative(),
    perfectGames: zod_1.z.number().int().nonnegative(),
});
exports.AchievementSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    code: zod_1.z.string().max(50),
    name: zod_1.z.string().max(100),
    description: zod_1.z.string().max(500),
    icon: zod_1.z.string().max(100),
    category: zod_1.z.enum(['gameplay', 'social', 'tournament', 'streak', 'special']),
    requirement: zod_1.z.object({
        type: zod_1.z.string(),
        value: zod_1.z.number(),
    }),
    reward: zod_1.z.object({
        type: zod_1.z.enum(['demo_coins', 'badge', 'title', 'avatar_frame']),
        value: zod_1.z.number().int().nonnegative().optional(),
        metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
    isSecret: zod_1.z.boolean().default(false),
    createdAt: types_1.TimestampSchema,
});
exports.UserAchievementSchema = zod_1.z.object({
    userId: types_1.UUIDSchema,
    achievementId: types_1.UUIDSchema,
    unlockedAt: types_1.TimestampSchema,
    progress: zod_1.z.number().int().nonnegative().default(0),
    isCompleted: zod_1.z.boolean().default(false),
});
// ============================================
// KYC TYPES
// ============================================
exports.KYCDocumentSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    userId: types_1.UUIDSchema,
    type: zod_1.z.enum(['identity', 'address', 'age']),
    documentType: zod_1.z.enum(['passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement']),
    fileUrl: zod_1.z.string().url(),
    status: zod_1.z.enum(['pending', 'approved', 'rejected']),
    reviewedAt: types_1.TimestampSchema.nullable(),
    reviewedBy: types_1.UUIDSchema.nullable(),
    rejectionReason: zod_1.z.string().nullable(),
    createdAt: types_1.TimestampSchema,
});
exports.KYCSubmissionSchema = zod_1.z.object({
    userId: types_1.UUIDSchema,
    fullName: zod_1.z.string().max(100),
    dateOfBirth: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    nationality: zod_1.z.string().length(2),
    address: zod_1.z.object({
        street: zod_1.z.string().max(200),
        city: zod_1.z.string().max(100),
        state: zod_1.z.string().max(100),
        postalCode: zod_1.z.string().max(20),
        country: zod_1.z.string().length(2),
    }),
    documents: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['identity', 'address', 'age']),
        documentType: zod_1.z.enum(['passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement']),
        fileUrl: zod_1.z.string().url(),
    })).min(2).max(5),
});
// ============================================
// EXPORTS
// ============================================
exports.UserSchemas = {
    UserProfile: exports.UserProfileSchema,
    UpdateProfile: exports.UpdateProfileSchema,
    UserStats: exports.UserStatsSchema,
    Achievement: exports.AchievementSchema,
    UserAchievement: exports.UserAchievementSchema,
    KYCDocument: exports.KYCDocumentSchema,
    KYCSubmission: exports.KYCSubmissionSchema,
};

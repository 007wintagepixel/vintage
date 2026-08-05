import { z } from 'zod';
export declare const UserProfileSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    country: z.ZodString;
    mobileNumber: z.ZodString;
    avatarUrl: z.ZodNullable<z.ZodString>;
    isVerified: z.ZodDefault<z.ZodBoolean>;
    isEmailVerified: z.ZodDefault<z.ZodBoolean>;
    isPhoneVerified: z.ZodDefault<z.ZodBoolean>;
    kycStatus: z.ZodDefault<z.ZodEnum<["not_started", "draft", "submitted", "under_review", "additional_info", "verified", "rejected", "expired"]>>;
    level: z.ZodDefault<z.ZodNumber>;
    experience: z.ZodDefault<z.ZodNumber>;
    experienceToNextLevel: z.ZodDefault<z.ZodNumber>;
    totalMatches: z.ZodDefault<z.ZodNumber>;
    wins: z.ZodDefault<z.ZodNumber>;
    losses: z.ZodDefault<z.ZodNumber>;
    winRate: z.ZodDefault<z.ZodNumber>;
    currentStreak: z.ZodDefault<z.ZodNumber>;
    bestStreak: z.ZodDefault<z.ZodNumber>;
    demoCoinsEarned: z.ZodDefault<z.ZodNumber>;
    tournamentsWon: z.ZodDefault<z.ZodNumber>;
    referralCode: z.ZodString;
    referredBy: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    lastLoginAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    username: string;
    fullName: string;
    email: string;
    country: string;
    mobileNumber: string;
    referralCode: string;
    avatarUrl: string | null;
    isVerified: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    kycStatus: "draft" | "not_started" | "submitted" | "under_review" | "additional_info" | "verified" | "rejected" | "expired";
    level: number;
    experience: number;
    experienceToNextLevel: number;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    currentStreak: number;
    bestStreak: number;
    demoCoinsEarned: number;
    tournamentsWon: number;
    referredBy: string | null;
    lastLoginAt: string | null;
}, {
    id: string;
    createdAt: string;
    username: string;
    fullName: string;
    email: string;
    country: string;
    mobileNumber: string;
    referralCode: string;
    avatarUrl: string | null;
    referredBy: string | null;
    lastLoginAt: string | null;
    isVerified?: boolean | undefined;
    isEmailVerified?: boolean | undefined;
    isPhoneVerified?: boolean | undefined;
    kycStatus?: "draft" | "not_started" | "submitted" | "under_review" | "additional_info" | "verified" | "rejected" | "expired" | undefined;
    level?: number | undefined;
    experience?: number | undefined;
    experienceToNextLevel?: number | undefined;
    totalMatches?: number | undefined;
    wins?: number | undefined;
    losses?: number | undefined;
    winRate?: number | undefined;
    currentStreak?: number | undefined;
    bestStreak?: number | undefined;
    demoCoinsEarned?: number | undefined;
    tournamentsWon?: number | undefined;
}>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export declare const UpdateProfileSchema: z.ZodObject<{
    displayName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    privacySettings: z.ZodOptional<z.ZodObject<{
        showOnlineStatus: z.ZodDefault<z.ZodBoolean>;
        showMatchHistory: z.ZodDefault<z.ZodBoolean>;
        allowFriendRequests: z.ZodDefault<z.ZodBoolean>;
        allowPrivateChat: z.ZodDefault<z.ZodBoolean>;
        allowGameInvites: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        showOnlineStatus: boolean;
        showMatchHistory: boolean;
        allowFriendRequests: boolean;
        allowPrivateChat: boolean;
        allowGameInvites: boolean;
    }, {
        showOnlineStatus?: boolean | undefined;
        showMatchHistory?: boolean | undefined;
        allowFriendRequests?: boolean | undefined;
        allowPrivateChat?: boolean | undefined;
        allowGameInvites?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    country?: string | undefined;
    avatarUrl?: string | null | undefined;
    displayName?: string | undefined;
    bio?: string | undefined;
    language?: string | undefined;
    privacySettings?: {
        showOnlineStatus: boolean;
        showMatchHistory: boolean;
        allowFriendRequests: boolean;
        allowPrivateChat: boolean;
        allowGameInvites: boolean;
    } | undefined;
}, {
    country?: string | undefined;
    avatarUrl?: string | null | undefined;
    displayName?: string | undefined;
    bio?: string | undefined;
    language?: string | undefined;
    privacySettings?: {
        showOnlineStatus?: boolean | undefined;
        showMatchHistory?: boolean | undefined;
        allowFriendRequests?: boolean | undefined;
        allowPrivateChat?: boolean | undefined;
        allowGameInvites?: boolean | undefined;
    } | undefined;
}>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
export declare const UserStatsSchema: z.ZodObject<{
    totalMatches: z.ZodNumber;
    wins: z.ZodNumber;
    losses: z.ZodNumber;
    draws: z.ZodNumber;
    winRate: z.ZodNumber;
    vsAI: z.ZodObject<{
        played: z.ZodNumber;
        won: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        played: number;
        won: number;
    }, {
        played: number;
        won: number;
    }>;
    vsHuman: z.ZodObject<{
        played: z.ZodNumber;
        won: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        played: number;
        won: number;
    }, {
        played: number;
        won: number;
    }>;
    team: z.ZodObject<{
        played: z.ZodNumber;
        won: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        played: number;
        won: number;
    }, {
        played: number;
        won: number;
    }>;
    tournament: z.ZodObject<{
        played: z.ZodNumber;
        won: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        played: number;
        won: number;
    }, {
        played: number;
        won: number;
    }>;
    averageGameDuration: z.ZodNumber;
    favoriteColor: z.ZodNullable<z.ZodEnum<["red", "green", "yellow", "blue"]>>;
    mostCapturesInGame: z.ZodNumber;
    perfectGames: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    team: {
        played: number;
        won: number;
    };
    tournament: {
        played: number;
        won: number;
    };
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    draws: number;
    vsAI: {
        played: number;
        won: number;
    };
    vsHuman: {
        played: number;
        won: number;
    };
    averageGameDuration: number;
    favoriteColor: "red" | "green" | "yellow" | "blue" | null;
    mostCapturesInGame: number;
    perfectGames: number;
}, {
    team: {
        played: number;
        won: number;
    };
    tournament: {
        played: number;
        won: number;
    };
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    draws: number;
    vsAI: {
        played: number;
        won: number;
    };
    vsHuman: {
        played: number;
        won: number;
    };
    averageGameDuration: number;
    favoriteColor: "red" | "green" | "yellow" | "blue" | null;
    mostCapturesInGame: number;
    perfectGames: number;
}>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export declare const AchievementSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    icon: z.ZodString;
    category: z.ZodEnum<["gameplay", "social", "tournament", "streak", "special"]>;
    requirement: z.ZodObject<{
        type: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        type: string;
    }, {
        value: number;
        type: string;
    }>;
    reward: z.ZodObject<{
        type: z.ZodEnum<["demo_coins", "badge", "title", "avatar_frame"]>;
        value: z.ZodOptional<z.ZodNumber>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "demo_coins" | "badge" | "title" | "avatar_frame";
        value?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
    }, {
        type: "demo_coins" | "badge" | "title" | "avatar_frame";
        value?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
    }>;
    isSecret: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    id: string;
    createdAt: string;
    name: string;
    description: string;
    icon: string;
    category: "tournament" | "gameplay" | "social" | "streak" | "special";
    requirement: {
        value: number;
        type: string;
    };
    reward: {
        type: "demo_coins" | "badge" | "title" | "avatar_frame";
        value?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
    };
    isSecret: boolean;
}, {
    code: string;
    id: string;
    createdAt: string;
    name: string;
    description: string;
    icon: string;
    category: "tournament" | "gameplay" | "social" | "streak" | "special";
    requirement: {
        value: number;
        type: string;
    };
    reward: {
        type: "demo_coins" | "badge" | "title" | "avatar_frame";
        value?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
    };
    isSecret?: boolean | undefined;
}>;
export type Achievement = z.infer<typeof AchievementSchema>;
export declare const UserAchievementSchema: z.ZodObject<{
    userId: z.ZodString;
    achievementId: z.ZodString;
    unlockedAt: z.ZodString;
    progress: z.ZodDefault<z.ZodNumber>;
    isCompleted: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    achievementId: string;
    unlockedAt: string;
    progress: number;
    isCompleted: boolean;
}, {
    userId: string;
    achievementId: string;
    unlockedAt: string;
    progress?: number | undefined;
    isCompleted?: boolean | undefined;
}>;
export type UserAchievement = z.infer<typeof UserAchievementSchema>;
export declare const KYCDocumentSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<["identity", "address", "age"]>;
    documentType: z.ZodEnum<["passport", "drivers_license", "national_id", "utility_bill", "bank_statement"]>;
    fileUrl: z.ZodString;
    status: z.ZodEnum<["pending", "approved", "rejected"]>;
    reviewedAt: z.ZodNullable<z.ZodString>;
    reviewedBy: z.ZodNullable<z.ZodString>;
    rejectionReason: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "identity" | "address" | "age";
    status: "rejected" | "pending" | "approved";
    id: string;
    userId: string;
    createdAt: string;
    documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
    fileUrl: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason: string | null;
}, {
    type: "identity" | "address" | "age";
    status: "rejected" | "pending" | "approved";
    id: string;
    userId: string;
    createdAt: string;
    documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
    fileUrl: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason: string | null;
}>;
export type KYCDocument = z.infer<typeof KYCDocumentSchema>;
export declare const KYCSubmissionSchema: z.ZodObject<{
    userId: z.ZodString;
    fullName: z.ZodString;
    dateOfBirth: z.ZodString;
    nationality: z.ZodString;
    address: z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        postalCode: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        country: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
    }, {
        country: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
    }>;
    documents: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["identity", "address", "age"]>;
        documentType: z.ZodEnum<["passport", "drivers_license", "national_id", "utility_bill", "bank_statement"]>;
        fileUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "identity" | "address" | "age";
        documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
        fileUrl: string;
    }, {
        type: "identity" | "address" | "age";
        documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
        fileUrl: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    userId: string;
    fullName: string;
    dateOfBirth: string;
    address: {
        country: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
    };
    nationality: string;
    documents: {
        type: "identity" | "address" | "age";
        documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
        fileUrl: string;
    }[];
}, {
    userId: string;
    fullName: string;
    dateOfBirth: string;
    address: {
        country: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
    };
    nationality: string;
    documents: {
        type: "identity" | "address" | "age";
        documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
        fileUrl: string;
    }[];
}>;
export type KYCSubmission = z.infer<typeof KYCSubmissionSchema>;
export declare const UserSchemas: {
    UserProfile: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        email: z.ZodString;
        country: z.ZodString;
        mobileNumber: z.ZodString;
        avatarUrl: z.ZodNullable<z.ZodString>;
        isVerified: z.ZodDefault<z.ZodBoolean>;
        isEmailVerified: z.ZodDefault<z.ZodBoolean>;
        isPhoneVerified: z.ZodDefault<z.ZodBoolean>;
        kycStatus: z.ZodDefault<z.ZodEnum<["not_started", "draft", "submitted", "under_review", "additional_info", "verified", "rejected", "expired"]>>;
        level: z.ZodDefault<z.ZodNumber>;
        experience: z.ZodDefault<z.ZodNumber>;
        experienceToNextLevel: z.ZodDefault<z.ZodNumber>;
        totalMatches: z.ZodDefault<z.ZodNumber>;
        wins: z.ZodDefault<z.ZodNumber>;
        losses: z.ZodDefault<z.ZodNumber>;
        winRate: z.ZodDefault<z.ZodNumber>;
        currentStreak: z.ZodDefault<z.ZodNumber>;
        bestStreak: z.ZodDefault<z.ZodNumber>;
        demoCoinsEarned: z.ZodDefault<z.ZodNumber>;
        tournamentsWon: z.ZodDefault<z.ZodNumber>;
        referralCode: z.ZodString;
        referredBy: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        lastLoginAt: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        username: string;
        fullName: string;
        email: string;
        country: string;
        mobileNumber: string;
        referralCode: string;
        avatarUrl: string | null;
        isVerified: boolean;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        kycStatus: "draft" | "not_started" | "submitted" | "under_review" | "additional_info" | "verified" | "rejected" | "expired";
        level: number;
        experience: number;
        experienceToNextLevel: number;
        totalMatches: number;
        wins: number;
        losses: number;
        winRate: number;
        currentStreak: number;
        bestStreak: number;
        demoCoinsEarned: number;
        tournamentsWon: number;
        referredBy: string | null;
        lastLoginAt: string | null;
    }, {
        id: string;
        createdAt: string;
        username: string;
        fullName: string;
        email: string;
        country: string;
        mobileNumber: string;
        referralCode: string;
        avatarUrl: string | null;
        referredBy: string | null;
        lastLoginAt: string | null;
        isVerified?: boolean | undefined;
        isEmailVerified?: boolean | undefined;
        isPhoneVerified?: boolean | undefined;
        kycStatus?: "draft" | "not_started" | "submitted" | "under_review" | "additional_info" | "verified" | "rejected" | "expired" | undefined;
        level?: number | undefined;
        experience?: number | undefined;
        experienceToNextLevel?: number | undefined;
        totalMatches?: number | undefined;
        wins?: number | undefined;
        losses?: number | undefined;
        winRate?: number | undefined;
        currentStreak?: number | undefined;
        bestStreak?: number | undefined;
        demoCoinsEarned?: number | undefined;
        tournamentsWon?: number | undefined;
    }>;
    UpdateProfile: z.ZodObject<{
        displayName: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        language: z.ZodOptional<z.ZodString>;
        avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        privacySettings: z.ZodOptional<z.ZodObject<{
            showOnlineStatus: z.ZodDefault<z.ZodBoolean>;
            showMatchHistory: z.ZodDefault<z.ZodBoolean>;
            allowFriendRequests: z.ZodDefault<z.ZodBoolean>;
            allowPrivateChat: z.ZodDefault<z.ZodBoolean>;
            allowGameInvites: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            showOnlineStatus: boolean;
            showMatchHistory: boolean;
            allowFriendRequests: boolean;
            allowPrivateChat: boolean;
            allowGameInvites: boolean;
        }, {
            showOnlineStatus?: boolean | undefined;
            showMatchHistory?: boolean | undefined;
            allowFriendRequests?: boolean | undefined;
            allowPrivateChat?: boolean | undefined;
            allowGameInvites?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        country?: string | undefined;
        avatarUrl?: string | null | undefined;
        displayName?: string | undefined;
        bio?: string | undefined;
        language?: string | undefined;
        privacySettings?: {
            showOnlineStatus: boolean;
            showMatchHistory: boolean;
            allowFriendRequests: boolean;
            allowPrivateChat: boolean;
            allowGameInvites: boolean;
        } | undefined;
    }, {
        country?: string | undefined;
        avatarUrl?: string | null | undefined;
        displayName?: string | undefined;
        bio?: string | undefined;
        language?: string | undefined;
        privacySettings?: {
            showOnlineStatus?: boolean | undefined;
            showMatchHistory?: boolean | undefined;
            allowFriendRequests?: boolean | undefined;
            allowPrivateChat?: boolean | undefined;
            allowGameInvites?: boolean | undefined;
        } | undefined;
    }>;
    UserStats: z.ZodObject<{
        totalMatches: z.ZodNumber;
        wins: z.ZodNumber;
        losses: z.ZodNumber;
        draws: z.ZodNumber;
        winRate: z.ZodNumber;
        vsAI: z.ZodObject<{
            played: z.ZodNumber;
            won: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            played: number;
            won: number;
        }, {
            played: number;
            won: number;
        }>;
        vsHuman: z.ZodObject<{
            played: z.ZodNumber;
            won: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            played: number;
            won: number;
        }, {
            played: number;
            won: number;
        }>;
        team: z.ZodObject<{
            played: z.ZodNumber;
            won: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            played: number;
            won: number;
        }, {
            played: number;
            won: number;
        }>;
        tournament: z.ZodObject<{
            played: z.ZodNumber;
            won: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            played: number;
            won: number;
        }, {
            played: number;
            won: number;
        }>;
        averageGameDuration: z.ZodNumber;
        favoriteColor: z.ZodNullable<z.ZodEnum<["red", "green", "yellow", "blue"]>>;
        mostCapturesInGame: z.ZodNumber;
        perfectGames: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        team: {
            played: number;
            won: number;
        };
        tournament: {
            played: number;
            won: number;
        };
        totalMatches: number;
        wins: number;
        losses: number;
        winRate: number;
        draws: number;
        vsAI: {
            played: number;
            won: number;
        };
        vsHuman: {
            played: number;
            won: number;
        };
        averageGameDuration: number;
        favoriteColor: "red" | "green" | "yellow" | "blue" | null;
        mostCapturesInGame: number;
        perfectGames: number;
    }, {
        team: {
            played: number;
            won: number;
        };
        tournament: {
            played: number;
            won: number;
        };
        totalMatches: number;
        wins: number;
        losses: number;
        winRate: number;
        draws: number;
        vsAI: {
            played: number;
            won: number;
        };
        vsHuman: {
            played: number;
            won: number;
        };
        averageGameDuration: number;
        favoriteColor: "red" | "green" | "yellow" | "blue" | null;
        mostCapturesInGame: number;
        perfectGames: number;
    }>;
    Achievement: z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        icon: z.ZodString;
        category: z.ZodEnum<["gameplay", "social", "tournament", "streak", "special"]>;
        requirement: z.ZodObject<{
            type: z.ZodString;
            value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            value: number;
            type: string;
        }, {
            value: number;
            type: string;
        }>;
        reward: z.ZodObject<{
            type: z.ZodEnum<["demo_coins", "badge", "title", "avatar_frame"]>;
            value: z.ZodOptional<z.ZodNumber>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: "demo_coins" | "badge" | "title" | "avatar_frame";
            value?: number | undefined;
            metadata?: Record<string, unknown> | undefined;
        }, {
            type: "demo_coins" | "badge" | "title" | "avatar_frame";
            value?: number | undefined;
            metadata?: Record<string, unknown> | undefined;
        }>;
        isSecret: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        id: string;
        createdAt: string;
        name: string;
        description: string;
        icon: string;
        category: "tournament" | "gameplay" | "social" | "streak" | "special";
        requirement: {
            value: number;
            type: string;
        };
        reward: {
            type: "demo_coins" | "badge" | "title" | "avatar_frame";
            value?: number | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        isSecret: boolean;
    }, {
        code: string;
        id: string;
        createdAt: string;
        name: string;
        description: string;
        icon: string;
        category: "tournament" | "gameplay" | "social" | "streak" | "special";
        requirement: {
            value: number;
            type: string;
        };
        reward: {
            type: "demo_coins" | "badge" | "title" | "avatar_frame";
            value?: number | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        isSecret?: boolean | undefined;
    }>;
    UserAchievement: z.ZodObject<{
        userId: z.ZodString;
        achievementId: z.ZodString;
        unlockedAt: z.ZodString;
        progress: z.ZodDefault<z.ZodNumber>;
        isCompleted: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        achievementId: string;
        unlockedAt: string;
        progress: number;
        isCompleted: boolean;
    }, {
        userId: string;
        achievementId: string;
        unlockedAt: string;
        progress?: number | undefined;
        isCompleted?: boolean | undefined;
    }>;
    KYCDocument: z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        type: z.ZodEnum<["identity", "address", "age"]>;
        documentType: z.ZodEnum<["passport", "drivers_license", "national_id", "utility_bill", "bank_statement"]>;
        fileUrl: z.ZodString;
        status: z.ZodEnum<["pending", "approved", "rejected"]>;
        reviewedAt: z.ZodNullable<z.ZodString>;
        reviewedBy: z.ZodNullable<z.ZodString>;
        rejectionReason: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "identity" | "address" | "age";
        status: "rejected" | "pending" | "approved";
        id: string;
        userId: string;
        createdAt: string;
        documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
        fileUrl: string;
        reviewedAt: string | null;
        reviewedBy: string | null;
        rejectionReason: string | null;
    }, {
        type: "identity" | "address" | "age";
        status: "rejected" | "pending" | "approved";
        id: string;
        userId: string;
        createdAt: string;
        documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
        fileUrl: string;
        reviewedAt: string | null;
        reviewedBy: string | null;
        rejectionReason: string | null;
    }>;
    KYCSubmission: z.ZodObject<{
        userId: z.ZodString;
        fullName: z.ZodString;
        dateOfBirth: z.ZodString;
        nationality: z.ZodString;
        address: z.ZodObject<{
            street: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            postalCode: z.ZodString;
            country: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            country: string;
            street: string;
            city: string;
            state: string;
            postalCode: string;
        }, {
            country: string;
            street: string;
            city: string;
            state: string;
            postalCode: string;
        }>;
        documents: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["identity", "address", "age"]>;
            documentType: z.ZodEnum<["passport", "drivers_license", "national_id", "utility_bill", "bank_statement"]>;
            fileUrl: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "identity" | "address" | "age";
            documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
            fileUrl: string;
        }, {
            type: "identity" | "address" | "age";
            documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
            fileUrl: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        fullName: string;
        dateOfBirth: string;
        address: {
            country: string;
            street: string;
            city: string;
            state: string;
            postalCode: string;
        };
        nationality: string;
        documents: {
            type: "identity" | "address" | "age";
            documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
            fileUrl: string;
        }[];
    }, {
        userId: string;
        fullName: string;
        dateOfBirth: string;
        address: {
            country: string;
            street: string;
            city: string;
            state: string;
            postalCode: string;
        };
        nationality: string;
        documents: {
            type: "identity" | "address" | "age";
            documentType: "passport" | "drivers_license" | "national_id" | "utility_bill" | "bank_statement";
            fileUrl: string;
        }[];
    }>;
};
//# sourceMappingURL=types.d.ts.map
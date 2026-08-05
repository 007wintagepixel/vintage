import { z } from 'zod';
export declare const FriendStatusSchema: z.ZodEnum<["offline", "online", "in_game", "in_lobby", "away"]>;
export type FriendStatus = z.infer<typeof FriendStatusSchema>;
export declare const FriendSchema: z.ZodObject<{
    userId: z.ZodString;
    friendId: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "blocked"]>;
    requestedAt: z.ZodString;
    acceptedAt: z.ZodNullable<z.ZodString>;
    blockedAt: z.ZodNullable<z.ZodString>;
    blockedBy: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "accepted" | "blocked";
    userId: string;
    friendId: string;
    requestedAt: string;
    acceptedAt: string | null;
    blockedAt: string | null;
    blockedBy: string | null;
}, {
    status: "pending" | "accepted" | "blocked";
    userId: string;
    friendId: string;
    requestedAt: string;
    acceptedAt: string | null;
    blockedAt: string | null;
    blockedBy: string | null;
}>;
export type Friend = z.infer<typeof FriendSchema>;
export declare const FriendRequestSchema: z.ZodObject<{
    id: z.ZodString;
    fromUserId: z.ZodString;
    toUserId: z.ZodString;
    status: z.ZodEnum<["pending", "accepted", "declined", "cancelled"]>;
    message: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    respondedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "pending" | "accepted" | "declined";
    id: string;
    createdAt: string;
    fromUserId: string;
    toUserId: string;
    respondedAt: string | null;
    message?: string | undefined;
}, {
    status: "cancelled" | "pending" | "accepted" | "declined";
    id: string;
    createdAt: string;
    fromUserId: string;
    toUserId: string;
    respondedAt: string | null;
    message?: string | undefined;
}>;
export type FriendRequest = z.infer<typeof FriendRequestSchema>;
export declare const SendFriendRequestSchema: z.ZodEffects<z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message?: string | undefined;
    userId?: string | undefined;
    username?: string | undefined;
}, {
    message?: string | undefined;
    userId?: string | undefined;
    username?: string | undefined;
}>, {
    message?: string | undefined;
    userId?: string | undefined;
    username?: string | undefined;
}, {
    message?: string | undefined;
    userId?: string | undefined;
    username?: string | undefined;
}>;
export type SendFriendRequest = z.infer<typeof SendFriendRequestSchema>;
export declare const FriendActionSchema: z.ZodEffects<z.ZodObject<{
    requestId: z.ZodOptional<z.ZodString>;
    friendId: z.ZodOptional<z.ZodString>;
    action: z.ZodEnum<["accept", "decline", "cancel", "remove", "block", "unblock"]>;
}, "strip", z.ZodTypeAny, {
    action: "cancel" | "accept" | "decline" | "remove" | "block" | "unblock";
    requestId?: string | undefined;
    friendId?: string | undefined;
}, {
    action: "cancel" | "accept" | "decline" | "remove" | "block" | "unblock";
    requestId?: string | undefined;
    friendId?: string | undefined;
}>, {
    action: "cancel" | "accept" | "decline" | "remove" | "block" | "unblock";
    requestId?: string | undefined;
    friendId?: string | undefined;
}, {
    action: "cancel" | "accept" | "decline" | "remove" | "block" | "unblock";
    requestId?: string | undefined;
    friendId?: string | undefined;
}>;
export type FriendAction = z.infer<typeof FriendActionSchema>;
export declare const UserSearchResultSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    fullName: z.ZodString;
    avatarUrl: z.ZodNullable<z.ZodString>;
    level: z.ZodNumber;
    isOnline: z.ZodBoolean;
    status: z.ZodEnum<["offline", "online", "in_game", "in_lobby", "away"]>;
    isFriend: z.ZodBoolean;
    hasPendingRequest: z.ZodBoolean;
    requestDirection: z.ZodDefault<z.ZodEnum<["none", "incoming", "outgoing"]>>;
    mutualFriendsCount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "offline" | "online" | "in_game" | "in_lobby" | "away";
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string | null;
    level: number;
    isOnline: boolean;
    isFriend: boolean;
    hasPendingRequest: boolean;
    requestDirection: "none" | "incoming" | "outgoing";
    mutualFriendsCount: number;
}, {
    status: "offline" | "online" | "in_game" | "in_lobby" | "away";
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string | null;
    level: number;
    isOnline: boolean;
    isFriend: boolean;
    hasPendingRequest: boolean;
    requestDirection?: "none" | "incoming" | "outgoing" | undefined;
    mutualFriendsCount?: number | undefined;
}>;
export type UserSearchResult = z.infer<typeof UserSearchResultSchema>;
export declare const FriendSchemas: {
    Friend: z.ZodObject<{
        userId: z.ZodString;
        friendId: z.ZodString;
        status: z.ZodEnum<["pending", "accepted", "blocked"]>;
        requestedAt: z.ZodString;
        acceptedAt: z.ZodNullable<z.ZodString>;
        blockedAt: z.ZodNullable<z.ZodString>;
        blockedBy: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "accepted" | "blocked";
        userId: string;
        friendId: string;
        requestedAt: string;
        acceptedAt: string | null;
        blockedAt: string | null;
        blockedBy: string | null;
    }, {
        status: "pending" | "accepted" | "blocked";
        userId: string;
        friendId: string;
        requestedAt: string;
        acceptedAt: string | null;
        blockedAt: string | null;
        blockedBy: string | null;
    }>;
    FriendRequest: z.ZodObject<{
        id: z.ZodString;
        fromUserId: z.ZodString;
        toUserId: z.ZodString;
        status: z.ZodEnum<["pending", "accepted", "declined", "cancelled"]>;
        message: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        respondedAt: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "cancelled" | "pending" | "accepted" | "declined";
        id: string;
        createdAt: string;
        fromUserId: string;
        toUserId: string;
        respondedAt: string | null;
        message?: string | undefined;
    }, {
        status: "cancelled" | "pending" | "accepted" | "declined";
        id: string;
        createdAt: string;
        fromUserId: string;
        toUserId: string;
        respondedAt: string | null;
        message?: string | undefined;
    }>;
    SendFriendRequest: z.ZodEffects<z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message?: string | undefined;
        userId?: string | undefined;
        username?: string | undefined;
    }, {
        message?: string | undefined;
        userId?: string | undefined;
        username?: string | undefined;
    }>, {
        message?: string | undefined;
        userId?: string | undefined;
        username?: string | undefined;
    }, {
        message?: string | undefined;
        userId?: string | undefined;
        username?: string | undefined;
    }>;
    FriendAction: z.ZodEffects<z.ZodObject<{
        requestId: z.ZodOptional<z.ZodString>;
        friendId: z.ZodOptional<z.ZodString>;
        action: z.ZodEnum<["accept", "decline", "cancel", "remove", "block", "unblock"]>;
    }, "strip", z.ZodTypeAny, {
        action: "cancel" | "accept" | "decline" | "remove" | "block" | "unblock";
        requestId?: string | undefined;
        friendId?: string | undefined;
    }, {
        action: "cancel" | "accept" | "decline" | "remove" | "block" | "unblock";
        requestId?: string | undefined;
        friendId?: string | undefined;
    }>, {
        action: "cancel" | "accept" | "decline" | "remove" | "block" | "unblock";
        requestId?: string | undefined;
        friendId?: string | undefined;
    }, {
        action: "cancel" | "accept" | "decline" | "remove" | "block" | "unblock";
        requestId?: string | undefined;
        friendId?: string | undefined;
    }>;
    UserSearchResult: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        avatarUrl: z.ZodNullable<z.ZodString>;
        level: z.ZodNumber;
        isOnline: z.ZodBoolean;
        status: z.ZodEnum<["offline", "online", "in_game", "in_lobby", "away"]>;
        isFriend: z.ZodBoolean;
        hasPendingRequest: z.ZodBoolean;
        requestDirection: z.ZodDefault<z.ZodEnum<["none", "incoming", "outgoing"]>>;
        mutualFriendsCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: "offline" | "online" | "in_game" | "in_lobby" | "away";
        id: string;
        username: string;
        fullName: string;
        avatarUrl: string | null;
        level: number;
        isOnline: boolean;
        isFriend: boolean;
        hasPendingRequest: boolean;
        requestDirection: "none" | "incoming" | "outgoing";
        mutualFriendsCount: number;
    }, {
        status: "offline" | "online" | "in_game" | "in_lobby" | "away";
        id: string;
        username: string;
        fullName: string;
        avatarUrl: string | null;
        level: number;
        isOnline: boolean;
        isFriend: boolean;
        hasPendingRequest: boolean;
        requestDirection?: "none" | "incoming" | "outgoing" | undefined;
        mutualFriendsCount?: number | undefined;
    }>;
};
//# sourceMappingURL=types.d.ts.map
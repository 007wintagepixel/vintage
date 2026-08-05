"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendSchemas = exports.UserSearchResultSchema = exports.FriendActionSchema = exports.SendFriendRequestSchema = exports.FriendRequestSchema = exports.FriendSchema = exports.FriendStatusSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../game/types");
// ============================================
// FRIEND TYPES
// ============================================
exports.FriendStatusSchema = zod_1.z.enum(['offline', 'online', 'in_game', 'in_lobby', 'away']);
exports.FriendSchema = zod_1.z.object({
    userId: types_1.UUIDSchema,
    friendId: types_1.UUIDSchema,
    status: zod_1.z.enum(['pending', 'accepted', 'blocked']),
    requestedAt: types_1.TimestampSchema,
    acceptedAt: types_1.TimestampSchema.nullable(),
    blockedAt: types_1.TimestampSchema.nullable(),
    blockedBy: types_1.UUIDSchema.nullable(),
});
exports.FriendRequestSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    fromUserId: types_1.UUIDSchema,
    toUserId: types_1.UUIDSchema,
    status: zod_1.z.enum(['pending', 'accepted', 'declined', 'cancelled']),
    message: zod_1.z.string().max(200).optional(),
    createdAt: types_1.TimestampSchema,
    respondedAt: types_1.TimestampSchema.nullable(),
});
exports.SendFriendRequestSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(20).optional(),
    userId: types_1.UUIDSchema.optional(),
    message: zod_1.z.string().max(200).optional(),
}).refine(data => data.username || data.userId, {
    message: 'Either username or userId must be provided',
});
exports.FriendActionSchema = zod_1.z.object({
    requestId: types_1.UUIDSchema.optional(),
    friendId: types_1.UUIDSchema.optional(),
    action: zod_1.z.enum(['accept', 'decline', 'cancel', 'remove', 'block', 'unblock']),
}).refine(data => data.requestId || data.friendId, {
    message: 'Either requestId or friendId must be provided',
});
exports.UserSearchResultSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    username: zod_1.z.string(),
    fullName: zod_1.z.string(),
    avatarUrl: zod_1.z.string().url().nullable(),
    level: zod_1.z.number().int().positive(),
    isOnline: zod_1.z.boolean(),
    status: exports.FriendStatusSchema,
    isFriend: zod_1.z.boolean(),
    hasPendingRequest: zod_1.z.boolean(),
    requestDirection: zod_1.z.enum(['none', 'incoming', 'outgoing']).default('none'),
    mutualFriendsCount: zod_1.z.number().int().nonnegative().default(0),
});
// ============================================
// EXPORTS
// ============================================
exports.FriendSchemas = {
    Friend: exports.FriendSchema,
    FriendRequest: exports.FriendRequestSchema,
    SendFriendRequest: exports.SendFriendRequestSchema,
    FriendAction: exports.FriendActionSchema,
    UserSearchResult: exports.UserSearchResultSchema,
};

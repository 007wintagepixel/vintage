import { z } from 'zod';
import { UUIDSchema, TimestampSchema, PaginationSchema } from '../game/types';

// ============================================
// FRIEND TYPES
// ============================================

export const FriendStatusSchema = z.enum(['offline', 'online', 'in_game', 'in_lobby', 'away']);
export type FriendStatus = z.infer<typeof FriendStatusSchema>;

export const FriendSchema = z.object({
  userId: UUIDSchema,
  friendId: UUIDSchema,
  status: z.enum(['pending', 'accepted', 'blocked']),
  requestedAt: TimestampSchema,
  acceptedAt: TimestampSchema.nullable(),
  blockedAt: TimestampSchema.nullable(),
  blockedBy: UUIDSchema.nullable(),
});
export type Friend = z.infer<typeof FriendSchema>;

export const FriendRequestSchema = z.object({
  id: UUIDSchema,
  fromUserId: UUIDSchema,
  toUserId: UUIDSchema,
  status: z.enum(['pending', 'accepted', 'declined', 'cancelled']),
  message: z.string().max(200).optional(),
  createdAt: TimestampSchema,
  respondedAt: TimestampSchema.nullable(),
});
export type FriendRequest = z.infer<typeof FriendRequestSchema>;

export const SendFriendRequestSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  userId: UUIDSchema.optional(),
  message: z.string().max(200).optional(),
}).refine(data => data.username || data.userId, {
  message: 'Either username or userId must be provided',
});
export type SendFriendRequest = z.infer<typeof SendFriendRequestSchema>;

export const FriendActionSchema = z.object({
  requestId: UUIDSchema.optional(),
  friendId: UUIDSchema.optional(),
  action: z.enum(['accept', 'decline', 'cancel', 'remove', 'block', 'unblock']),
}).refine(data => data.requestId || data.friendId, {
  message: 'Either requestId or friendId must be provided',
});
export type FriendAction = z.infer<typeof FriendActionSchema>;

export const UserSearchResultSchema = z.object({
  id: UUIDSchema,
  username: z.string(),
  fullName: z.string(),
  avatarUrl: z.string().url().nullable(),
  level: z.number().int().positive(),
  isOnline: z.boolean(),
  status: FriendStatusSchema,
  isFriend: z.boolean(),
  hasPendingRequest: z.boolean(),
  requestDirection: z.enum(['none', 'incoming', 'outgoing']).default('none'),
  mutualFriendsCount: z.number().int().nonnegative().default(0),
});
export type UserSearchResult = z.infer<typeof UserSearchResultSchema>;

// ============================================
// EXPORTS
// ============================================

export const FriendSchemas = {
  Friend: FriendSchema,
  FriendRequest: FriendRequestSchema,
  SendFriendRequest: SendFriendRequestSchema,
  FriendAction: FriendActionSchema,
  UserSearchResult: UserSearchResultSchema,
};
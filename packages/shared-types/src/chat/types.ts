import { z } from 'zod';
import { UUIDSchema, TimestampSchema, PaginationSchema } from '../game/types';

// ============================================
// CHAT TYPES
// ============================================

export const ChatConversationTypeSchema = z.enum(['global', 'match', 'private', 'team', 'support']);
export type ChatConversationType = z.infer<typeof ChatConversationTypeSchema>;

export const ChatConversationSchema = z.object({
  id: UUIDSchema,
  type: ChatConversationTypeSchema,
  name: z.string().max(100).nullable(),
  matchId: UUIDSchema.nullable(),
  teamId: z.number().int().nullable(),
  participants: z.array(z.object({
    userId: UUIDSchema,
    joinedAt: TimestampSchema,
    leftAt: TimestampSchema.nullable(),
    isMuted: z.boolean().default(false),
    unreadCount: z.number().int().nonnegative().default(0),
  })),
  lastMessage: z.object({
    id: UUIDSchema,
    content: z.string(),
    senderId: UUIDSchema,
    sentAt: TimestampSchema,
  }).nullable(),
  isArchived: z.boolean().default(false),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type ChatConversation = z.infer<typeof ChatConversationSchema>;

export const ChatMessageSchema = z.object({
  id: UUIDSchema,
  conversationId: UUIDSchema,
  senderId: UUIDSchema,
  content: z.string().max(2000),
  type: z.enum(['text', 'emoji', 'system', 'game_action', 'image']).default('text'),
  replyTo: UUIDSchema.nullable(),
  isEdited: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  deletedAt: TimestampSchema.nullable(),
  metadata: z.record(z.unknown()).optional(),
  sentAt: TimestampSchema,
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const SendMessageSchema = z.object({
  conversationId: UUIDSchema,
  content: z.string().min(1).max(2000),
  type: z.enum(['text', 'emoji', 'game_action']).default('text'),
  replyTo: UUIDSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
});
export type SendMessage = z.infer<typeof SendMessageSchema>;

export const CreateConversationSchema = z.object({
  type: z.enum(['private', 'team', 'support']),
  participantIds: z.array(UUIDSchema).min(1).max(50),
  teamId: z.number().int().optional(),
  initialMessage: z.string().max(2000).optional(),
});
export type CreateConversation = z.infer<typeof CreateConversationSchema>;

// ============================================
// EXPORTS
// ============================================

export const ChatSchemas = {
  ChatConversation: ChatConversationSchema,
  ChatMessage: ChatMessageSchema,
  SendMessage: SendMessageSchema,
  CreateConversation: CreateConversationSchema,
};
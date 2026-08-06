"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchemas = exports.MessageQuerySchema = exports.CreateConversationSchema = exports.SendMessageSchema = exports.ChatMessageSchema = exports.ChatConversationSchema = exports.ChatConversationTypeSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../game/types");
// ============================================
// CHAT TYPES
// ============================================
exports.ChatConversationTypeSchema = zod_1.z.enum(['global', 'match', 'private', 'team', 'support']);
exports.ChatConversationSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    type: exports.ChatConversationTypeSchema,
    name: zod_1.z.string().max(100).nullable(),
    matchId: types_1.UUIDSchema.nullable(),
    teamId: zod_1.z.number().int().nullable(),
    participants: zod_1.z.array(zod_1.z.object({
        userId: types_1.UUIDSchema,
        joinedAt: types_1.TimestampSchema,
        leftAt: types_1.TimestampSchema.nullable(),
        isMuted: zod_1.z.boolean().default(false),
        unreadCount: zod_1.z.number().int().nonnegative().default(0),
    })),
    lastMessage: zod_1.z.object({
        id: types_1.UUIDSchema,
        content: zod_1.z.string(),
        senderId: types_1.UUIDSchema,
        sentAt: types_1.TimestampSchema,
    }).nullable(),
    isArchived: zod_1.z.boolean().default(false),
    createdAt: types_1.TimestampSchema,
    updatedAt: types_1.TimestampSchema,
});
exports.ChatMessageSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    conversationId: types_1.UUIDSchema,
    senderId: types_1.UUIDSchema,
    content: zod_1.z.string().max(2000),
    type: zod_1.z.enum(['text', 'emoji', 'system', 'game_action', 'image']).default('text'),
    replyTo: types_1.UUIDSchema.nullable(),
    isEdited: zod_1.z.boolean().default(false),
    isDeleted: zod_1.z.boolean().default(false),
    deletedAt: types_1.TimestampSchema.nullable(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
    sentAt: types_1.TimestampSchema,
});
exports.SendMessageSchema = zod_1.z.object({
    conversationId: types_1.UUIDSchema,
    content: zod_1.z.string().min(1).max(2000),
    type: zod_1.z.enum(['text', 'emoji', 'game_action']).default('text'),
    replyTo: types_1.UUIDSchema.optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.CreateConversationSchema = zod_1.z.object({
    type: zod_1.z.enum(['private', 'team', 'support']),
    participantIds: zod_1.z.array(types_1.UUIDSchema).min(1).max(50),
    teamId: zod_1.z.number().int().optional(),
    initialMessage: zod_1.z.string().max(2000).optional(),
});
exports.MessageQuerySchema = zod_1.z.object({
    before: zod_1.z.string().datetime().optional(),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(50),
});
// ============================================
// EXPORTS
// ============================================
exports.ChatSchemas = {
    ChatConversation: exports.ChatConversationSchema,
    ChatMessage: exports.ChatMessageSchema,
    SendMessage: exports.SendMessageSchema,
    CreateConversation: exports.CreateConversationSchema,
};

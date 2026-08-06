import { z } from 'zod';
export declare const ChatConversationTypeSchema: z.ZodEnum<["global", "match", "private", "team", "support"]>;
export type ChatConversationType = z.infer<typeof ChatConversationTypeSchema>;
export declare const ChatConversationSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["global", "match", "private", "team", "support"]>;
    name: z.ZodNullable<z.ZodString>;
    matchId: z.ZodNullable<z.ZodString>;
    teamId: z.ZodNullable<z.ZodNumber>;
    participants: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        joinedAt: z.ZodString;
        leftAt: z.ZodNullable<z.ZodString>;
        isMuted: z.ZodDefault<z.ZodBoolean>;
        unreadCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        joinedAt: string;
        leftAt: string | null;
        isMuted: boolean;
        unreadCount: number;
    }, {
        userId: string;
        joinedAt: string;
        leftAt: string | null;
        isMuted?: boolean | undefined;
        unreadCount?: number | undefined;
    }>, "many">;
    lastMessage: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        senderId: z.ZodString;
        sentAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        content: string;
        senderId: string;
        sentAt: string;
    }, {
        id: string;
        content: string;
        senderId: string;
        sentAt: string;
    }>>;
    isArchived: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "private" | "team" | "match" | "global" | "support";
    id: string;
    teamId: number | null;
    matchId: string | null;
    createdAt: string;
    name: string | null;
    updatedAt: string;
    participants: {
        userId: string;
        joinedAt: string;
        leftAt: string | null;
        isMuted: boolean;
        unreadCount: number;
    }[];
    lastMessage: {
        id: string;
        content: string;
        senderId: string;
        sentAt: string;
    } | null;
    isArchived: boolean;
}, {
    type: "private" | "team" | "match" | "global" | "support";
    id: string;
    teamId: number | null;
    matchId: string | null;
    createdAt: string;
    name: string | null;
    updatedAt: string;
    participants: {
        userId: string;
        joinedAt: string;
        leftAt: string | null;
        isMuted?: boolean | undefined;
        unreadCount?: number | undefined;
    }[];
    lastMessage: {
        id: string;
        content: string;
        senderId: string;
        sentAt: string;
    } | null;
    isArchived?: boolean | undefined;
}>;
export type ChatConversation = z.infer<typeof ChatConversationSchema>;
export declare const ChatMessageSchema: z.ZodObject<{
    id: z.ZodString;
    conversationId: z.ZodString;
    senderId: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["text", "emoji", "system", "game_action", "image"]>>;
    replyTo: z.ZodNullable<z.ZodString>;
    isEdited: z.ZodDefault<z.ZodBoolean>;
    isDeleted: z.ZodDefault<z.ZodBoolean>;
    deletedAt: z.ZodNullable<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    sentAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "text" | "emoji" | "system" | "game_action" | "image";
    id: string;
    content: string;
    senderId: string;
    sentAt: string;
    conversationId: string;
    replyTo: string | null;
    isEdited: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    metadata?: Record<string, unknown> | undefined;
}, {
    id: string;
    content: string;
    senderId: string;
    sentAt: string;
    conversationId: string;
    replyTo: string | null;
    deletedAt: string | null;
    type?: "text" | "emoji" | "system" | "game_action" | "image" | undefined;
    metadata?: Record<string, unknown> | undefined;
    isEdited?: boolean | undefined;
    isDeleted?: boolean | undefined;
}>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export declare const SendMessageSchema: z.ZodObject<{
    conversationId: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["text", "emoji", "game_action"]>>;
    replyTo: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "text" | "emoji" | "game_action";
    content: string;
    conversationId: string;
    metadata?: Record<string, unknown> | undefined;
    replyTo?: string | undefined;
}, {
    content: string;
    conversationId: string;
    type?: "text" | "emoji" | "game_action" | undefined;
    metadata?: Record<string, unknown> | undefined;
    replyTo?: string | undefined;
}>;
export type SendMessage = z.infer<typeof SendMessageSchema>;
export declare const CreateConversationSchema: z.ZodObject<{
    type: z.ZodEnum<["private", "team", "support"]>;
    participantIds: z.ZodArray<z.ZodString, "many">;
    teamId: z.ZodOptional<z.ZodNumber>;
    initialMessage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "private" | "team" | "support";
    participantIds: string[];
    teamId?: number | undefined;
    initialMessage?: string | undefined;
}, {
    type: "private" | "team" | "support";
    participantIds: string[];
    teamId?: number | undefined;
    initialMessage?: string | undefined;
}>;
export type CreateConversation = z.infer<typeof CreateConversationSchema>;
export declare const MessageQuerySchema: z.ZodObject<{
    before: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    before?: string | undefined;
}, {
    limit?: number | undefined;
    before?: string | undefined;
}>;
export type MessageQuery = z.infer<typeof MessageQuerySchema>;
export declare const ChatSchemas: {
    ChatConversation: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["global", "match", "private", "team", "support"]>;
        name: z.ZodNullable<z.ZodString>;
        matchId: z.ZodNullable<z.ZodString>;
        teamId: z.ZodNullable<z.ZodNumber>;
        participants: z.ZodArray<z.ZodObject<{
            userId: z.ZodString;
            joinedAt: z.ZodString;
            leftAt: z.ZodNullable<z.ZodString>;
            isMuted: z.ZodDefault<z.ZodBoolean>;
            unreadCount: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            userId: string;
            joinedAt: string;
            leftAt: string | null;
            isMuted: boolean;
            unreadCount: number;
        }, {
            userId: string;
            joinedAt: string;
            leftAt: string | null;
            isMuted?: boolean | undefined;
            unreadCount?: number | undefined;
        }>, "many">;
        lastMessage: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            content: z.ZodString;
            senderId: z.ZodString;
            sentAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            content: string;
            senderId: string;
            sentAt: string;
        }, {
            id: string;
            content: string;
            senderId: string;
            sentAt: string;
        }>>;
        isArchived: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "private" | "team" | "match" | "global" | "support";
        id: string;
        teamId: number | null;
        matchId: string | null;
        createdAt: string;
        name: string | null;
        updatedAt: string;
        participants: {
            userId: string;
            joinedAt: string;
            leftAt: string | null;
            isMuted: boolean;
            unreadCount: number;
        }[];
        lastMessage: {
            id: string;
            content: string;
            senderId: string;
            sentAt: string;
        } | null;
        isArchived: boolean;
    }, {
        type: "private" | "team" | "match" | "global" | "support";
        id: string;
        teamId: number | null;
        matchId: string | null;
        createdAt: string;
        name: string | null;
        updatedAt: string;
        participants: {
            userId: string;
            joinedAt: string;
            leftAt: string | null;
            isMuted?: boolean | undefined;
            unreadCount?: number | undefined;
        }[];
        lastMessage: {
            id: string;
            content: string;
            senderId: string;
            sentAt: string;
        } | null;
        isArchived?: boolean | undefined;
    }>;
    ChatMessage: z.ZodObject<{
        id: z.ZodString;
        conversationId: z.ZodString;
        senderId: z.ZodString;
        content: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["text", "emoji", "system", "game_action", "image"]>>;
        replyTo: z.ZodNullable<z.ZodString>;
        isEdited: z.ZodDefault<z.ZodBoolean>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        deletedAt: z.ZodNullable<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        sentAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "text" | "emoji" | "system" | "game_action" | "image";
        id: string;
        content: string;
        senderId: string;
        sentAt: string;
        conversationId: string;
        replyTo: string | null;
        isEdited: boolean;
        isDeleted: boolean;
        deletedAt: string | null;
        metadata?: Record<string, unknown> | undefined;
    }, {
        id: string;
        content: string;
        senderId: string;
        sentAt: string;
        conversationId: string;
        replyTo: string | null;
        deletedAt: string | null;
        type?: "text" | "emoji" | "system" | "game_action" | "image" | undefined;
        metadata?: Record<string, unknown> | undefined;
        isEdited?: boolean | undefined;
        isDeleted?: boolean | undefined;
    }>;
    SendMessage: z.ZodObject<{
        conversationId: z.ZodString;
        content: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["text", "emoji", "game_action"]>>;
        replyTo: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "text" | "emoji" | "game_action";
        content: string;
        conversationId: string;
        metadata?: Record<string, unknown> | undefined;
        replyTo?: string | undefined;
    }, {
        content: string;
        conversationId: string;
        type?: "text" | "emoji" | "game_action" | undefined;
        metadata?: Record<string, unknown> | undefined;
        replyTo?: string | undefined;
    }>;
    CreateConversation: z.ZodObject<{
        type: z.ZodEnum<["private", "team", "support"]>;
        participantIds: z.ZodArray<z.ZodString, "many">;
        teamId: z.ZodOptional<z.ZodNumber>;
        initialMessage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "private" | "team" | "support";
        participantIds: string[];
        teamId?: number | undefined;
        initialMessage?: string | undefined;
    }, {
        type: "private" | "team" | "support";
        participantIds: string[];
        teamId?: number | undefined;
        initialMessage?: string | undefined;
    }>;
};
//# sourceMappingURL=types.d.ts.map
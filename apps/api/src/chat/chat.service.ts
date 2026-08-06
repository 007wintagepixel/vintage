// ============================================
// Chat Service
// ============================================

import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { SendMessage, CreateConversation, MessageQuery } from '@ludo-nexus/validation';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // CONVERSATIONS
  // ============================================

  async getConversations(userId: string, page = 1, limit = 20) {
    const participations = await this.prisma.chatParticipant.findMany({
      where: { userId, leftAt: null },
      include: {
        conversation: {
          include: {
            participants: {
              where: { leftAt: null },
              include: { user: { select: { id: true, username: true, avatarUrl: true, level: true } } },
            },
            messages: {
              where: { isDeleted: false },
              orderBy: { sentAt: 'desc' },
              take: 1,
              include: { sender: { select: { id: true, username: true } } },
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.prisma.chatParticipant.count({
      where: { userId, leftAt: null },
    });

    return {
      data: participations.map((p: any) => ({
        ...p.conversation,
        unreadCount: p.unreadCount,
        lastMessage: p.conversation.messages[0] ?? null,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getConversation(conversationId: string, userId: string) {
    const participation = await this.prisma.chatParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participation) throw new ForbiddenException('Not a participant');

    return this.prisma.chatConversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: { user: { select: { id: true, username: true, avatarUrl: true, level: true } } },
        },
      },
    });
  }

  async createConversation(userId: string, data: CreateConversation) {
    // Validate participants
    const participantIds = [...new Set([userId, ...data.participantIds])];
    
    const users = await this.prisma.user.findMany({
      where: { id: { in: participantIds } },
    });
    if (users.length !== participantIds.length) {
      throw new NotFoundException('Some users not found');
    }

    // For private chats, check if already exists
    if (data.type === 'private' && data.participantIds.length === 1) {
      const existing = await this.findPrivateConversation(userId, data.participantIds[0]);
      if (existing) return existing;
    }

    // Create conversation
    const conversation = await this.prisma.chatConversation.create({
      data: {
        type: data.type,
        name: null,
        teamId: data.teamId,
        matchId: null,
        participants: {
          create: participantIds.map(id => ({
            userId: id,
            joinedAt: new Date(),
          })),
        },
      },
      include: {
        participants: {
          include: { user: { select: { id: true, username: true, avatarUrl: true, level: true } } },
        },
      },
    });

    // Send initial message if provided
    if (data.initialMessage) {
      await this.sendMessage(conversation.id, userId, {
        conversationId: conversation.id,
        content: data.initialMessage,
        type: 'text',
      });
    }

    return conversation;
  }

  private async findPrivateConversation(userId1: string, userId2: string) {
    const conversations = await this.prisma.chatConversation.findMany({
      where: {
        type: 'private',
        participants: {
          every: {
            userId: { in: [userId1, userId2] },
            leftAt: null,
          },
        },
      },
      include: { participants: true },
    });

    return conversations.find((c: any) => 
      c.participants.length === 2 &&
      c.participants.every((p: any) => [userId1, userId2].includes(p.userId))
    ) ?? null;
  }

  async leaveConversation(userId: string, conversationId: string) {
    await this.prisma.chatParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { leftAt: new Date() },
    });

    return { success: true };
  }

  // ============================================
  // MESSAGES
  // ============================================

  async getMessages(conversationId: string, userId: string, before?: string, limit = 50) {
    // Verify participation
    const participation = await this.prisma.chatParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participation) throw new ForbiddenException('Not a participant');

    const where: any = {
      conversationId,
      isDeleted: false,
    };

    if (before) {
      where.sentAt = { lt: new Date(before) };
    }

    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where,
        include: {
          sender: { select: { id: true, username: true, avatarUrl: true } },
          replyTo: { include: { sender: { select: { id: true, username: true } } } },
        },
        orderBy: { sentAt: 'desc' },
        take: limit,
      }),
      this.prisma.chatMessage.count({ where }),
    ]);

    // Mark as read
    await this.prisma.chatParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { unreadCount: 0 },
    });

    return {
      data: messages.reverse(),
      meta: { total, hasMore: total > limit },
    };
  }

  async sendMessage(conversationId: string, userId: string, data: SendMessage) {
    // Verify participation
    const participation = await this.prisma.chatParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participation) throw new ForbiddenException('Not a participant');

    // Check if muted
    if (participation.isMuted) {
      throw new ForbiddenException('You are muted in this conversation');
    }

    // Verify reply-to message exists
    if (data.replyTo) {
      const replyMsg = await this.prisma.chatMessage.findUnique({
        where: { id: data.replyTo },
      });
      if (!replyMsg || replyMsg.conversationId !== data.conversationId) {
        throw new BadRequestException('Invalid reply-to message');
      }
    }

    // Create message
    const message = await this.prisma.chatMessage.create({
      data: {
        conversationId: data.conversationId,
        senderId: userId,
        content: data.content,
        type: data.type,
        replyToId: data.replyTo,
        metadata: data.metadata,
      },
      include: {
        sender: { select: { id: true, username: true, avatarUrl: true } },
        replyTo: { include: { sender: { select: { id: true, username: true } } } },
      },
    });

    // Update conversation updatedAt and increment unread for others
    await this.prisma.$transaction(async (tx: any) => {
      await tx.chatConversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      });

      await tx.chatParticipant.updateMany({
        where: {
          conversationId: data.conversationId,
          userId: { not: userId },
          leftAt: null,
        },
        data: { unreadCount: { increment: 1 } },
      });
    });

    return message;
  }

  async editMessage(userId: string, messageId: string, content: string) {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
    });
    if (!message) throw new NotFoundException('Message not found');
    if (message.senderId !== userId) throw new ForbiddenException('Not your message');
    if (message.isDeleted) throw new BadRequestException('Cannot edit deleted message');

    return this.prisma.chatMessage.update({
      where: { id: messageId },
      data: { content, isEdited: true },
    });
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
    });
    if (!message) throw new NotFoundException('Message not found');
    if (message.senderId !== userId) throw new ForbiddenException('Not your message');

    return this.prisma.chatMessage.update({
      where: { id: messageId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  // ============================================
  // GLOBAL CHAT
  // ============================================

  async getGlobalChatMessages(page = 1, limit = 50) {
    const globalConversation = await this.prisma.chatConversation.findFirst({
      where: { type: 'global' },
    });

    if (!globalConversation) {
      // Create global chat if doesn't exist
      const created = await this.prisma.chatConversation.create({
        data: { type: 'global', name: 'Global Chat' },
      });
      return { data: [], meta: { page, limit, total: 0, totalPages: 0 } };
    }

    const [messages, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where: { conversationId: globalConversation.id, isDeleted: false },
        include: { sender: { select: { id: true, username: true, avatarUrl: true } } },
        orderBy: { sentAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.chatMessage.count({
        where: { conversationId: globalConversation.id, isDeleted: false },
      }),
    ]);

    return {
      data: messages.reverse(),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async sendGlobalMessage(userId: string, content: string) {
    const globalConversation = await this.prisma.chatConversation.findFirst({
      where: { type: 'global' },
    });

    if (!globalConversation) throw new Error('Global chat not found');

    return this.sendMessage(globalConversation.id, userId, {
      conversationId: globalConversation.id,
      content,
      type: 'text',
    });
  }
}
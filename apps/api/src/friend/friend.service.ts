// ============================================
// Friend Service
// ============================================

import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { SendFriendRequest, FriendAction, UserSearch } from '@ludo-nexus/validation';

@Injectable()
export class FriendService {
  private readonly logger = new Logger(FriendService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // FRIEND REQUESTS
  // ============================================

  async sendFriendRequest(userId: string, data: SendFriendRequest) {
    // Find target user
    let targetUser: any;
    if (data.userId) {
      targetUser = await this.prisma.user.findUnique({ where: { id: data.userId } });
    } else if (data.username) {
      targetUser = await this.prisma.user.findUnique({ where: { username: data.username } });
    }

    if (!targetUser) throw new NotFoundException('User not found');
    if (targetUser.id === userId) throw new BadRequestException('Cannot add yourself');

    // Check if already friends
    const existingFriend = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { userId, friendId: targetUser.id },
          { userId: targetUser.id, friendId: userId },
        ],
      },
    });
    if (existingFriend) {
      if (existingFriend.status === 'accepted') throw new BadRequestException('Already friends');
      if (existingFriend.status === 'blocked') throw new ForbiddenException('User blocked');
      if (existingFriend.status === 'pending') throw new BadRequestException('Request already pending');
    }

    // Check for existing pending request
    const existingRequest = await this.prisma.friendRequest.findUnique({
      where: { fromUserId_toUserId: { fromUserId: userId, toUserId: targetUser.id } },
    });
    if (existingRequest) {
      if (existingRequest.status === 'pending') throw new BadRequestException('Request already sent');
    }

    // Check if target has sent request to user
    const reverseRequest = await this.prisma.friendRequest.findUnique({
      where: { fromUserId_toUserId: { fromUserId: targetUser.id, toUserId: userId } },
    });
    if (reverseRequest && reverseRequest.status === 'pending') {
      // Auto-accept and create friendship
      return this.acceptFriendRequest(userId, { action: 'accept' as const, requestId: reverseRequest.id });
    }

    // Check if blocked
    const blocked = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          { userId, blockedId: targetUser.id },
          { userId: targetUser.id, blockedId: userId },
        ],
      },
    });
    if (blocked) throw new ForbiddenException('Cannot send request');

    // Create friend request
    const request = await this.prisma.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: targetUser.id,
        message: data.message,
        status: 'pending',
      },
      include: {
        fromUser: { select: { id: true, username: true, avatarUrl: true, level: true } },
        toUser: { select: { id: true, username: true, avatarUrl: true, level: true } },
      },
    });

    // Friend gateway handles the WebSocket emit to the target user's socket
    this.logger.log(`Friend request notification sent: ${userId} -> ${targetUser.id}`);
    return request;
  }

  async getFriendRequests(userId: string, type: 'received' | 'sent' = 'received') {
    const where = type === 'received' 
      ? { toUserId: userId, status: 'pending' as const }
      : { fromUserId: userId, status: 'pending' as const };

    return this.prisma.friendRequest.findMany({
      where,
      include: {
        fromUser: { select: { id: true, username: true, avatarUrl: true, level: true } },
        toUser: { select: { id: true, username: true, avatarUrl: true, level: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async performFriendAction(userId: string, data: FriendAction) {
    switch (data.action) {
      case 'accept':
        return this.acceptFriendRequest(userId, data);
      case 'decline':
        return this.declineFriendRequest(userId, data);
      case 'cancel':
        return this.cancelFriendRequest(userId, data);
      case 'remove':
        return this.removeFriend(userId, data);
      case 'block':
        return this.blockUser(userId, data);
      case 'unblock':
        return this.unblockUser(userId, data);
      default:
        throw new BadRequestException('Invalid action');
    }
  }

  private async acceptFriendRequest(userId: string, data: FriendAction) {
    let request: any;
    if (data.requestId) {
      request = await this.prisma.friendRequest.findUnique({
        where: { id: data.requestId },
      });
    } else if (data.friendId) {
      request = await this.prisma.friendRequest.findUnique({
        where: { fromUserId_toUserId: { fromUserId: data.friendId, toUserId: userId } },
      });
    }

    if (!request) throw new NotFoundException('Request not found');
    if (request.toUserId !== userId) throw new ForbiddenException('Not your request');
    if (request.status !== 'pending') throw new BadRequestException('Request not pending');

    // Create friendship (bidirectional)
    await this.prisma.$transaction(async (tx: any) => {
      await tx.friendRequest.update({
        where: { id: request.id },
        data: { status: 'accepted', respondedAt: new Date() },
      });

      await tx.friend.create({
        data: {
          userId: request.fromUserId,
          friendId: request.toUserId,
          status: 'accepted',
          requestedAt: request.createdAt,
          acceptedAt: new Date(),
        },
      });

      await tx.friend.create({
        data: {
          userId: request.toUserId,
          friendId: request.fromUserId,
          status: 'accepted',
          requestedAt: request.createdAt,
          acceptedAt: new Date(),
        },
      });
    });

    return { success: true, message: 'Friend request accepted' };
  }

  private async declineFriendRequest(userId: string, data: FriendAction) {
    let request: any;
    if (data.requestId) {
      request = await this.prisma.friendRequest.findUnique({
        where: { id: data.requestId },
      });
    } else if (data.friendId) {
      request = await this.prisma.friendRequest.findUnique({
        where: { fromUserId_toUserId: { fromUserId: data.friendId, toUserId: userId } },
      });
    }

    if (!request) throw new NotFoundException('Request not found');
    if (request.toUserId !== userId) throw new ForbiddenException('Not your request');
    if (request.status !== 'pending') throw new BadRequestException('Request not pending');

    await this.prisma.friendRequest.update({
      where: { id: request.id },
      data: { status: 'declined', respondedAt: new Date() },
    });

    return { success: true, message: 'Friend request declined' };
  }

  private async cancelFriendRequest(userId: string, data: FriendAction) {
    let request: any;
    if (data.requestId) {
      request = await this.prisma.friendRequest.findUnique({
        where: { id: data.requestId },
      });
    } else if (data.friendId) {
      request = await this.prisma.friendRequest.findUnique({
        where: { fromUserId_toUserId: { fromUserId: userId, toUserId: data.friendId } },
      });
    }

    if (!request) throw new NotFoundException('Request not found');
    if (request.fromUserId !== userId) throw new ForbiddenException('Not your request');
    if (request.status !== 'pending') throw new BadRequestException('Request not pending');

    await this.prisma.friendRequest.update({
      where: { id: request.id },
      data: { status: 'cancelled', respondedAt: new Date() },
    });

    return { success: true, message: 'Friend request cancelled' };
  }

  private async removeFriend(userId: string, data: FriendAction) {
    if (!data.friendId) throw new BadRequestException('Friend ID required');

    const friendship = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { userId, friendId: data.friendId },
          { userId: data.friendId, friendId: userId },
        ],
        status: 'accepted',
      },
    });

    if (!friendship) throw new NotFoundException('Friendship not found');

    await this.prisma.$transaction(async (tx: any) => {
      await tx.friend.deleteMany({
        where: {
          OR: [
            { userId, friendId: data.friendId },
            { userId: data.friendId, friendId: userId },
          ],
        },
      });
    });

    return { success: true, message: 'Friend removed' };
  }

  private async blockUser(userId: string, data: FriendAction) {
    if (!data.friendId) throw new BadRequestException('User ID required');
    if (data.friendId === userId) throw new BadRequestException('Cannot block yourself');

    // Remove friendship if exists
    await this.prisma.friend.deleteMany({
      where: {
        OR: [
          { userId, friendId: data.friendId },
          { userId: data.friendId, friendId: userId },
        ],
      },
    });

    // Remove any pending requests
    await this.prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { fromUserId: userId, toUserId: data.friendId },
          { fromUserId: data.friendId, toUserId: userId },
        ],
      },
    });

    // Create block
    await this.prisma.blockedUser.create({
      data: {
        userId,
        blockedId: data.friendId,
      },
    });

    return { success: true, message: 'User blocked' };
  }

  private async unblockUser(userId: string, data: FriendAction) {
    if (!data.friendId) throw new BadRequestException('User ID required');

    const block = await this.prisma.blockedUser.findUnique({
      where: { userId_blockedId: { userId, blockedId: data.friendId } },
    });

    if (!block) throw new NotFoundException('Block not found');

    await this.prisma.blockedUser.delete({
      where: { id: block.id },
    });

    return { success: true, message: 'User unblocked' };
  }

  // ============================================
  // FRIEND LIST
  // ============================================

  async getFriends(userId: string, page = 1, limit = 50) {
    const [friends, total] = await Promise.all([
      this.prisma.friend.findMany({
        where: { userId, status: 'accepted' },
        include: {
          friend: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              level: true,
              // Online status would come from a separate service
            },
          },
        },
        orderBy: { acceptedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.friend.count({ where: { userId, status: 'accepted' } }),
    ]);

    return {
      data: friends.map((f: any) => ({
        ...f.friend,
        friendshipId: f.id,
        friendsSince: f.acceptedAt,
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getBlockedUsers(userId: string) {
    const blocks = await this.prisma.blockedUser.findMany({
      where: { userId },
      include: {
        blocked: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return blocks.map((b: any) => ({ ...b.blocked, blockedAt: b.createdAt }));
  }

  // ============================================
  // USER SEARCH
  // ============================================

  async searchUsers(userId: string, data: UserSearch) {
    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          { deletedAt: null },
          {
            OR: [
              { username: { contains: data.query, mode: 'insensitive' } },
              { fullName: { contains: data.query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        level: true,
      },
      take: data.limit,
    });

    // Check friendship status for each
    const friendIds = await this.prisma.friend.findMany({
      where: { userId, status: 'accepted' },
      select: { friendId: true },
    });
    const friendIdSet = new Set(friendIds.map((f: any) => f.friendId));

    const sentRequests = await this.prisma.friendRequest.findMany({
      where: { fromUserId: userId, status: 'pending' },
      select: { toUserId: true },
    });
    const sentRequestSet = new Set(sentRequests.map((r: any) => r.toUserId));

    const receivedRequests = await this.prisma.friendRequest.findMany({
      where: { toUserId: userId, status: 'pending' },
      select: { fromUserId: true },
    });
    const receivedRequestSet = new Set(receivedRequests.map((r: any) => r.fromUserId));

    const blocked = await this.prisma.blockedUser.findMany({
      where: { userId },
      select: { blockedId: true },
    });
    const blockedSet = new Set(blocked.map((b: any) => b.blockedId));

    return users.map((u: any) => ({
      ...u,
      isFriend: friendIdSet.has(u.id),
      hasPendingRequest: sentRequestSet.has(u.id) || receivedRequestSet.has(u.id),
      requestDirection: sentRequestSet.has(u.id) ? 'outgoing' : receivedRequestSet.has(u.id) ? 'incoming' : 'none',
      isBlocked: blockedSet.has(u.id),
      mutualFriendsCount: 0, // Placeholder — will calculate from mutual friend graph
      isOnline: false, // Placeholder — will get from presence service
      status: 'offline' as const,
    }));
  }
}
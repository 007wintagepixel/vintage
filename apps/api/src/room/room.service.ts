// ============================================
// Room Service
// ============================================

import { Injectable, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { GameService } from '../game/game.service';

import type { CreateRoom, JoinRoom, RoomAction } from '@ludo-nexus/validation';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gameService: GameService,
  ) {}

  // ============================================
  // ROOM CRUD
  // ============================================

  async createRoom(userId: string, data: CreateRoom) {
    // Generate unique room code
    const code = await this.generateUniqueRoomCode();

    // Hash password if provided
    let passwordHash: string | null = null;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    // Default rules
    const rules = data.rules ?? {
      tokensPerPlayer: 4,
      entryRoll: 6,
      allowThreeSixes: true,
      extraTurnOnSix: true,
      extraTurnOnCapture: true,
      extraTurnOnHome: true,
      turnTimeSeconds: 30,
      reconnectionGraceSeconds: 30,
      inactivityLimit: 3,
      allowBlockades: false,
      safeCells: [0, 8, 13, 21, 26, 34, 39, 47],
      teamMode: false,
      botDifficulty: 'medium',
    };

    // Create room
    const room = await this.prisma.room.create({
      data: {
        code,
        hostId: userId,
        name: data.name,
        isPublic: data.isPublic,
        passwordHash,
        maxPlayers: data.maxPlayers,
        entryFee: data.entryFee,
        rules: rules as any,
        status: 'lobby',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        players: {
          create: {
            userId,
            color: 'red',
            isHost: true,
            isReady: false,
          },
        },
      },
      include: { players: { include: { user: { select: { id: true, username: true, avatarUrl: true, level: true } } } } },
    });

    // Lock entry fee via game service wallet helpers
    if (data.entryFee > 0) {
      try {
        await this.gameService['lockFunds'](userId, data.entryFee, 'room_entry', room.id);
      } catch (err) {
        this.logger.warn(`Failed to lock entry fee for user ${userId}: ${err.message}`);
      }
    }

    return room;
  }

  async getRoom(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        players: {
          include: {
            user: {
              select: { id: true, username: true, avatarUrl: true, level: true },
            },
          },
        },
        host: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    return room;
  }

  async getRoomByCode(code: string) {
    const room = await this.prisma.room.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        players: {
          include: {
            user: {
              select: { id: true, username: true, avatarUrl: true, level: true },
            },
          },
        },
      },
    });

    if (!room) throw new NotFoundException('Room not found');

    return room;
  }

  async joinRoom(userId: string, data: JoinRoom) {
    const room = await this.getRoomByCode(data.roomCode);

    // Check if room is joinable
    if (room.status !== 'lobby') {
      throw new BadRequestException('Room is not accepting players');
    }

    // Check if public or has password
    if (!room.isPublic) {
      throw new ForbiddenException('Room is private');
    }

    // Verify password
    if (room.passwordHash) {
      if (!data.password) {
        throw new BadRequestException('Room requires password');
      }
      const valid = await bcrypt.compare(data.password, room.passwordHash);
      if (!valid) {
        throw new BadRequestException('Incorrect password');
      }
    }

    // Check if already in room
    const existingPlayer = room.players.find((p: any) => p.userId === userId);
    if (existingPlayer) {
      return room; // Already in room
    }

    // Check capacity
    if (room.players.length >= room.maxPlayers) {
      throw new BadRequestException('Room is full');
    }

    // Assign color
    const usedColors = room.players.map((p: any) => p.color).filter(Boolean) as string[];
    const availableColors = ['red', 'green', 'yellow', 'blue'].filter(c => !usedColors.includes(c));
    const color = availableColors[0] ?? 'red';

    // Add player
    await this.prisma.roomPlayer.create({
      data: {
        roomId: room.id,
        userId,
        color: color as any,
        isHost: false,
        isReady: false,
      },
    });

    return this.getRoom(room.id);
  }

  async leaveRoom(userId: string, roomId: string) {
    const room = await this.getRoom(roomId);
    const player = room.players.find((p: any) => p.userId === userId);

    if (!player) throw new NotFoundException('Not in this room');

    // If host leaves, transfer host or delete room
    if (player.isHost) {
      const remainingPlayers = room.players.filter((p: any) => p.userId !== userId);
      if (remainingPlayers.length > 0) {
        // Transfer host to first remaining player
        await this.prisma.roomPlayer.update({
          where: { id: remainingPlayers[0].id },
          data: { isHost: true },
        });
        await this.prisma.room.update({
          where: { id: roomId },
          data: { hostId: remainingPlayers[0].userId },
        });
      } else {
        // Delete room
        await this.prisma.room.delete({ where: { id: roomId } });
        return { deleted: true };
      }
    } else {
      // Just remove player
      await this.prisma.roomPlayer.delete({ where: { id: player.id } });
    }

    // Release entry fee if locked
    if (room.entryFee > 0) {
      try {
        await this.gameService['releaseFunds'](userId, Number(room.entryFee), 'room_leave', room.id);
      } catch (err) {
        this.logger.warn(`Failed to release entry fee for user ${userId}: ${err.message}`);
      }
    }

    return { success: true };
  }

  async deleteRoom(userId: string, roomId: string) {
    const room = await this.getRoom(roomId);
    
    if (room.hostId !== userId) {
      throw new ForbiddenException('Only host can delete room');
    }

    await this.prisma.room.delete({ where: { id: roomId } });
    return { success: true };
  }

  // ============================================
  // ROOM ACTIONS
  // ============================================

  async performAction(userId: string, data: RoomAction) {
    const room = await this.getRoom(data.roomId);
    const player = room.players.find((p: any) => p.userId === userId);

    if (!player) throw new NotFoundException('Not in this room');

    switch (data.action) {
      case 'ready':
      case 'unready':
        return this.toggleReady(room.id, player.id, data.action === 'ready');
      
      case 'kick':
        if (!player.isHost) throw new ForbiddenException('Only host can kick');
        if (!data.targetUserId) throw new BadRequestException('Target user required');
        return this.kickPlayer(room.id, data.targetUserId);
      
      case 'transfer_host':
        if (!player.isHost) throw new ForbiddenException('Only host can transfer');
        if (!data.targetUserId) throw new BadRequestException('Target user required');
        return this.transferHost(room.id, data.targetUserId);
      
      case 'invite':
        if (!data.inviteUserId) throw new BadRequestException('User to invite required');
        return this.invitePlayer(room.id, userId, data.inviteUserId);
      
      case 'start':
        if (!player.isHost) throw new ForbiddenException('Only host can start');
        return this.startGame(room.id);
      
      default:
        throw new BadRequestException('Invalid action');
    }
  }

  private async toggleReady(roomId: string, playerId: string, ready: boolean) {
    await this.prisma.roomPlayer.update({
      where: { id: playerId },
      data: { isReady: ready },
    });
    return this.getRoom(roomId);
  }

  private async kickPlayer(roomId: string, targetUserId: string) {
    const targetPlayer = await this.prisma.roomPlayer.findFirst({
      where: { roomId, userId: targetUserId },
    });
    if (!targetPlayer) throw new NotFoundException('Player not in room');
    if (targetPlayer.isHost) throw new BadRequestException('Cannot kick host');

    await this.prisma.roomPlayer.delete({ where: { id: targetPlayer.id } });
    return this.getRoom(roomId);
  }

  private async transferHost(roomId: string, targetUserId: string) {
    const room = await this.getRoom(roomId);
    const targetPlayer = room.players.find((p: any) => p.userId === targetUserId);
    if (!targetPlayer) throw new NotFoundException('Player not in room');

    const currentHost = room.players.find((p: any) => p.isHost);
    if (currentHost) {
      await this.prisma.roomPlayer.update({
        where: { id: currentHost.id },
        data: { isHost: false },
      });
    }

    await this.prisma.roomPlayer.update({
      where: { id: targetPlayer.id },
      data: { isHost: true },
    });

    await this.prisma.room.update({
      where: { id: roomId },
      data: { hostId: targetUserId },
    });

    return this.getRoom(roomId);
  }

  private async invitePlayer(roomId: string, invitedById: string, inviteUserId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: inviteUserId } });
    if (!user) throw new NotFoundException('User not found');

    // Check if already in room or invited
    const existing = await this.prisma.roomPlayer.findFirst({
      where: { roomId, userId: inviteUserId },
    });
    if (existing) throw new BadRequestException('User already in room');

    const existingInvite = await this.prisma.roomInvite.findFirst({
      where: { roomId, invitedUserId: inviteUserId, status: 'pending' },
    });
    if (existingInvite) throw new BadRequestException('Already invited');

    // Create invite
    const invite = await this.prisma.roomInvite.create({
      data: {
        roomId,
        invitedById,
        invitedUserId: inviteUserId,
        status: 'pending',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    // Send notification — room invites are picked up via WebSocket room namespace
    // The room gateway will emit 'room_invite' to the invited user
    this.logger.log(`Room invite sent: room ${roomId}, from ${invitedById} to ${inviteUserId}`);

    return invite;
  }

  private async startGame(roomId: string) {
    const room = await this.getRoom(roomId);
    
    // Validate all players ready
    const notReady = room.players.filter((p: any) => !p.isReady && !p.isBot);
    if (notReady.length > 0) {
      throw new BadRequestException('Not all players are ready');
    }

    // Validate minimum players
    if (room.players.length < 2) {
      throw new BadRequestException('Need at least 2 players');
    }

    // Assign colors to players without colors
    const usedColors = room.players.map((p: any) => p.color).filter(Boolean) as string[];
    const availableColors = (['red', 'green', 'yellow', 'blue'] as const).filter(c => !usedColors.includes(c));

    let colorIndex = 0;
    for (const player of room.players) {
      if (!player.color && colorIndex < availableColors.length) {
        await this.prisma.roomPlayer.update({
          where: { id: player.id },
          data: { color: availableColors[colorIndex] },
        });
        colorIndex++;
      }
    }

    // Create match from room
    const players = room.players.map((p: any) => ({
      userId: p.userId,
      color: p.color ?? 'red',
      isBot: p.isBot,
      botDifficulty: p.botDifficulty,
      teamId: p.teamId,
    }));

    const match = await this.gameService.createMatch(players[0].userId, 'group', {
      entryFee: Number(room.entryFee),
      rules: room.rules as any,
    });

    // Update room with match
    await this.prisma.room.update({
      where: { id: roomId },
      data: { status: 'in_progress', matchId: match.matchId },
    });

    return { matchId: match.matchId, gameState: match.gameState };
  }

  // ============================================
  // PUBLIC ROOMS
  // ============================================

  async getPublicRooms(page = 1, limit = 20) {
    const [rooms, total] = await Promise.all([
      this.prisma.room.findMany({
        where: {
          isPublic: true,
          status: 'lobby',
          expiresAt: { gt: new Date() },
        },
        include: {
          players: {
            include: {
              user: { select: { id: true, username: true, avatarUrl: true, level: true } },
            },
          },
          host: { select: { id: true, username: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.room.count({
        where: {
          isPublic: true,
          status: 'lobby',
          expiresAt: { gt: new Date() },
        },
      }),
    ]);

    return {
      data: rooms,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ============================================
  // HELPERS
  // ============================================

  private async generateUniqueRoomCode(): Promise<string> {
    let code: string;
    let exists = true;
    
    while (exists) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await this.prisma.room.findUnique({ where: { code } });
      exists = !!existing;
    }
    
    return code!;
  }
}
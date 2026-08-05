// ============================================
// User Service
// ============================================

import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { UpdateProfile, ChangePassword } from '@ludo-nexus/validation';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // PROFILE
  // ============================================

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        wallet: true,
        kyc: true,
        _count: {
          select: {
            matches: true,
            friends: true,
            tournaments: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { passwordHash, sessions, otps, devices, fraudAlerts, ...safeUser } = user;
    return safeUser;
  }

  async getPublicProfile(userId: string, viewerId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: {
            matches: true,
            friends: true,
            tournaments: true,
            achievements: true,
          },
        },
      },
    });

    if (!user || user.deletedAt) throw new NotFoundException('User not found');

    const profile = user.profile;
    const isFriend = viewerId ? await this.areFriends(viewerId, userId) : false;

    // Check privacy settings
    const privacy = profile?.privacySettings as any ?? {};
    const showStats = privacy.showMatchHistory !== false || isFriend;

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      level: user.level,
      experience: user.experience,
      isVerified: user.isVerified,
      kycStatus: user.kycStatus,
      country: user.country,
      createdAt: user.createdAt,
      profile: profile ? {
        displayName: profile.displayName,
        bio: profile.bio,
        language: profile.language,
      } : null,
      stats: showStats ? {
        totalMatches: user.totalMatches,
        wins: user.wins,
        losses: user.losses,
        winRate: user.totalMatches > 0 ? Math.round((user.wins / user.totalMatches) * 100) : 0,
        tournamentsWon: user.tournamentsWon,
        currentStreak: 0, // TODO: Calculate
        bestStreak: 0, // TODO: Calculate
      } : null,
      isFriend,
    };
  }

  async updateProfile(userId: string, data: UpdateProfile) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Update user fields
    if (data.displayName !== undefined || data.bio !== undefined || data.country !== undefined || data.language !== undefined || data.avatarUrl !== undefined || data.privacySettings !== undefined) {
      await this.prisma.profile.upsert({
        where: { userId },
        create: {
          userId,
          displayName: data.displayName,
          bio: data.bio,
          country: data.country,
          language: data.language,
          avatarUrl: data.avatarUrl,
          privacySettings: data.privacySettings ?? {},
        },
        update: {
          displayName: data.displayName,
          bio: data.bio,
          country: data.country,
          language: data.language,
          avatarUrl: data.avatarUrl,
          privacySettings: data.privacySettings,
        },
      });
    }

    return this.getProfile(userId);
  }

  async changePassword(userId: string, data: ChangePassword) {
    // This would use PasswordService
    // For now, just validate
    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // TODO: Verify current password and hash new one
    return { success: true, message: 'Password changed' };
  }

  async uploadAvatar(userId: string, fileUrl: string) {
    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, avatarUrl: fileUrl },
      update: { avatarUrl: fileUrl },
    });

    return { avatarUrl: fileUrl };
  }

  // ============================================
  // STATISTICS
  // ============================================

  async getStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        matches: {
          where: { finalRank: { not: null } },
          select: { finalRank: true, coinsWon: true, coinsLost: true, match: { select: { mode: true, createdAt: true } } },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const matches = user.matches;
    const totalMatches = matches.length;
    const wins = matches.filter(m => m.finalRank === 1).length;
    const losses = matches.filter(m => m.finalRank && m.finalRank > 1).length;
    const draws = totalMatches - wins - losses;

    const vsAI = matches.filter(m => m.match.mode === 'vs_ai');
    const vsHuman = matches.filter(m => m.match.mode === 'vs_human');
    const team = matches.filter(m => m.match.mode === 'team');
    const tournament = matches.filter(m => m.match.mode === 'tournament');

    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    return {
      totalMatches,
      wins,
      losses,
      draws,
      winRate,
      vsAI: { played: vsAI.length, won: vsAI.filter(m => m.finalRank === 1).length },
      vsHuman: { played: vsHuman.length, won: vsHuman.filter(m => m.finalRank === 1).length },
      team: { played: team.length, won: team.filter(m => m.finalRank === 1).length },
      tournament: { played: tournament.length, won: tournament.filter(m => m.finalRank === 1).length },
      averageGameDuration: 0, // TODO: Calculate
      favoriteColor: null, // TODO: Calculate
      mostCapturesInGame: 0, // TODO: Calculate
      perfectGames: 0, // TODO: Calculate
    };
  }

  async getMatchHistory(userId: string, page = 1, limit = 20) {
    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where: {
          players: { some: { userId } },
        },
        include: {
          players: {
            select: { userId: true, color: true, isBot: true, finalRank: true, coinsWon: true, coinsLost: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.match.count({ where: { players: { some: { userId } } } }),
    ]);

    return { data: matches, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  // ============================================
  // HELPERS
  // ============================================

  private async areFriends(userId1: string, userId2: string): Promise<boolean> {
    const friendship = await this.prisma.friend.findFirst({
      where: {
        OR: [
          { userId: userId1, friendId: userId2 },
          { userId: userId2, friendId: userId1 },
        ],
        status: 'accepted',
      },
    });
    return !!friendship;
  }
}
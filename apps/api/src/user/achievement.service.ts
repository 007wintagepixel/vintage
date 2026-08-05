// ============================================
// Achievement Service
// ============================================

import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Achievement definitions
  private readonly ACHIEVEMENTS = [
    {
      code: 'first_win',
      name: 'First Win',
      description: 'Win your first match',
      icon: '🏆',
      category: 'gameplay',
      requirement: { type: 'wins', value: 1 },
      reward: { type: 'demo_coins', value: 100 },
    },
    {
      code: 'hat_trick',
      name: 'Hat Trick',
      description: 'Win 3 matches in a row',
      icon: '🎩',
      category: 'streak',
      requirement: { type: 'win_streak', value: 3 },
      reward: { type: 'demo_coins', value: 500 },
    },
    {
      code: 'tournament_champion',
      name: 'Tournament Champion',
      description: 'Win a tournament',
      icon: '👑',
      category: 'tournament',
      requirement: { type: 'tournament_wins', value: 1 },
      reward: { type: 'demo_coins', value: 1000 },
    },
    {
      code: 'ludo_legend',
      name: 'Ludo Legend',
      description: 'Win 100 matches',
      icon: '⭐',
      category: 'gameplay',
      requirement: { type: 'wins', value: 100 },
      reward: { type: 'demo_coins', value: 5000 },
    },
    {
      code: 'perfect_roll',
      name: 'Perfect Roll',
      description: 'Roll three sixes in a row',
      icon: '🎲',
      category: 'special',
      requirement: { type: 'three_sixes', value: 1 },
      reward: { type: 'badge', value: 0 },
    },
    {
      code: 'capture_master',
      name: 'Capture Master',
      description: 'Capture 50 opponent tokens',
      icon: '🎯',
      category: 'gameplay',
      requirement: { type: 'captures', value: 50 },
      reward: { type: 'demo_coins', value: 1000 },
    },
    {
      code: 'safe_zone_expert',
      name: 'Safe Zone Expert',
      description: 'Land on safe cells 100 times',
      icon: '🛡️',
      category: 'gameplay',
      requirement: { type: 'safe_cell_landings', value: 100 },
      reward: { type: 'demo_coins', value: 500 },
    },
    {
      code: 'ten_win_streak',
      name: 'Ten Win Streak',
      description: 'Win 10 matches in a row',
      icon: '🔥',
      category: 'streak',
      requirement: { type: 'win_streak', value: 10 },
      reward: { type: 'demo_coins', value: 2000 },
    },
    {
      code: 'team_champion',
      name: 'Team Champion',
      description: 'Win 10 team matches',
      icon: '🤝',
      category: 'team',
      requirement: { type: 'team_wins', value: 10 },
      reward: { type: 'demo_coins', value: 1000 },
    },
    {
      code: 'hundred_matches',
      name: 'Centurion',
      description: 'Play 100 matches',
      icon: '💯',
      category: 'gameplay',
      requirement: { type: 'matches', value: 100 },
      reward: { type: 'demo_coins', value: 1000 },
    },
  ];

  async initializeAchievements() {
    for (const ach of this.ACHIEVEMENTS) {
      await this.prisma.achievement.upsert({
        where: { code: ach.code },
        create: ach,
        update: ach,
      });
    }
    this.logger.log('Achievements initialized');
  }

  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async getUserAchievements(userId: string) {
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const allAchievements = await this.getAllAchievements();
    const earnedCodes = new Set(userAchievements.map(ua => ua.achievement.code));

    return allAchievements.map(ach => ({
      ...ach,
      earned: earnedCodes.has(ach.code),
      unlockedAt: userAchievements.find(ua => ua.achievement.code === ach.code)?.unlockedAt,
      progress: userAchievements.find(ua => ua.achievement.code === ach.code)?.progress ?? 0,
    }));
  }

  async checkAndUnlockAchievements(userId: string, stats: any) {
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId, isCompleted: true },
      select: { achievementId: true },
    });
    const earnedIds = new Set(userAchievements.map(ua => ua.achievementId));

    const newAchievements = [];

    for (const ach of this.ACHIEVEMENTS) {
      const achievement = await this.prisma.achievement.findUnique({
        where: { code: ach.code },
      });
      if (!achievement || earnedIds.has(achievement.id)) continue;

      let progress = 0;
      let shouldUnlock = false;

      switch (ach.requirement.type) {
        case 'wins':
          progress = stats.wins ?? 0;
          shouldUnlock = progress >= ach.requirement.value;
          break;
        case 'win_streak':
          progress = stats.currentStreak ?? 0;
          shouldUnlock = progress >= ach.requirement.value;
          break;
        case 'tournament_wins':
          progress = stats.tournamentWins ?? 0;
          shouldUnlock = progress >= ach.requirement.value;
          break;
        case 'matches':
          progress = stats.totalMatches ?? 0;
          shouldUnlock = progress >= ach.requirement.value;
          break;
        case 'team_wins':
          progress = stats.teamWins ?? 0;
          shouldUnlock = progress >= ach.requirement.value;
          break;
        case 'captures':
          progress = stats.totalCaptures ?? 0;
          shouldUnlock = progress >= ach.requirement.value;
          break;
        case 'safe_cell_landings':
          progress = stats.safeCellLandings ?? 0;
          shouldUnlock = progress >= ach.requirement.value;
          break;
        case 'three_sixes':
          progress = stats.threeSixesCount ?? 0;
          shouldUnlock = progress >= ach.requirement.value;
          break;
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
        newAchievements.push(achievement);
      } else if (progress > 0) {
        // Update progress
        await this.prisma.userAchievement.upsert({
          where: { userId_achievementId: { userId, achievementId: achievement.id } },
          create: { userId, achievementId: achievement.id, progress, isCompleted: false },
          update: { progress },
        });
      }
    }

    return newAchievements;
  }

  async unlockAchievement(userId: string, achievementId: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id: achievementId },
    });
    if (!achievement) return;

    const userAchievement = await this.prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId, achievementId } },
      create: { userId, achievementId, unlockedAt: new Date(), progress: achievement.requirement.value as number, isCompleted: true },
      update: { unlockedAt: new Date(), progress: achievement.requirement.value as number, isCompleted: true },
    });

    // Grant reward
    if (achievement.reward.type === 'demo_coins' && achievement.reward.value > 0) {
      // TODO: Use WalletService to add demo coins
      this.logger.log(`Would grant ${achievement.reward.value} demo coins for ${achievement.code}`);
    }

    // TODO: Send notification via WebSocket

    return userAchievement;
  }
}
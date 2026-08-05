// ============================================
// Matchmaking Service
// ============================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { GameService } from '../game/game.service';

interface QueuedPlayer {
  userId: string;
  skillRating: number;
  region: string;
  preferredMode: string;
  joinedAt: number;
  socketId?: string;
}

@Injectable()
export class MatchmakingService {
  private readonly logger = new Logger(MatchmakingService.name);
  private readonly queues = new Map<string, QueuedPlayer[]>(); // mode -> queue
  private readonly playerQueueMap = new Map<string, string>(); // userId -> mode

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly gameService: GameService,
  ) {}

  // ============================================
  // QUEUE MANAGEMENT
  // ============================================

  async joinQueue(
    userId: string,
    mode: string,
    options: { skillRating?: number; region?: string } = {}
  ) {
    // Check if already in queue
    if (this.playerQueueMap.has(userId)) {
      throw new Error('Already in queue');
    }

    // Get user skill rating
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new Error('User not found');

    const skillRating = options.skillRating ?? 1000; // Default ELO
    const region = options.region ?? 'global';

    const player: QueuedPlayer = {
      userId,
      skillRating,
      region,
      preferredMode: mode,
      joinedAt: Date.now(),
    };

    // Add to queue
    if (!this.queues.has(mode)) {
      this.queues.set(mode, []);
    }
    this.queues.get(mode)!.push(player);
    this.playerQueueMap.set(userId, mode);

    this.logger.log(`User ${userId} joined ${mode} queue`);

    // Try to match immediately
    await this.tryMatch(mode);

    return { success: true, queuePosition: this.getQueuePosition(mode, userId) };
  }

  async leaveQueue(userId: string) {
    const mode = this.playerQueueMap.get(userId);
    if (!mode) return { success: false, message: 'Not in queue' };

    const queue = this.queues.get(mode);
    if (queue) {
      const index = queue.findIndex(p => p.userId === userId);
      if (index !== -1) {
        queue.splice(index, 1);
      }
    }
    this.playerQueueMap.delete(userId);

    this.logger.log(`User ${userId} left ${mode} queue`);
    return { success: true };
  }

  getQueueStatus(userId: string) {
    const mode = this.playerQueueMap.get(userId);
    if (!mode) return { inQueue: false };

    const queue = this.queues.get(mode) ?? [];
    const position = queue.findIndex(p => p.userId === userId) + 1;
    
    return {
      inQueue: true,
      mode,
      position,
      queueLength: queue.length,
      estimatedWait: this.estimateWaitTime(mode, position),
    };
  }

  // ============================================
  // MATCHING LOGIC
  // ============================================

  private async tryMatch(mode: string) {
    const queue = this.queues.get(mode);
    if (!queue || queue.length < 2) return;

    // Sort by skill rating for better matching
    queue.sort((a, b) => a.skillRating - b.skillRating);

    // Try to form groups of 4 (or 2 for 1v1)
    const playersPerMatch = mode === 'vs_human' ? 4 : 2;
    
    while (queue.length >= playersPerMatch) {
      // Take first N players with similar skill
      const candidates = queue.slice(0, playersPerMatch);
      const skillSpread = candidates[candidates.length - 1].skillRating - candidates[0].skillRating;
      
      // Allow max 500 skill difference
      if (skillSpread > 500 && queue.length > playersPerMatch) {
        // Not good match, wait for more players
        break;
      }

      // Remove from queue
      candidates.forEach(p => {
        this.playerQueueMap.delete(p.userId);
      });
      queue.splice(0, candidates.length);

      // Create match
      try {
        await this.createMatchFromQueue(candidates, mode);
      } catch (error) {
        this.logger.error(`Failed to create match: ${error.message}`);
        // Re-queue players
        candidates.forEach(p => {
          queue.unshift(p);
          this.playerQueueMap.set(p.userId, mode);
        });
        break;
      }
    }
  }

  private async createMatchFromQueue(players: QueuedPlayer[], mode: string) {
    const userIds = players.map(p => p.userId);
    
    // Check all users still exist and are available
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    if (users.length !== userIds.length) {
      throw new Error('Some users no longer exist');
    }

    // Create match via GameService
    const result = await this.gameService.createMatch(userIds[0], mode as any, {
      entryFee: 0, // Free matchmaking for now
    });

    this.logger.log(`Created match ${result.matchId} for ${userIds.join(', ')}`);

    // Notify players via WebSocket
    // TODO: Emit match_found event to each player's socket

    return result;
  }

  // ============================================
  // HELPERS
  // ============================================

  private getQueuePosition(mode: string, userId: string): number {
    const queue = this.queues.get(mode) ?? [];
    return queue.findIndex(p => p.userId === userId) + 1;
  }

  private estimateWaitTime(mode: string, position: number): number {
    // Rough estimate: 30 seconds per position
    return position * 30;
  }

  // ============================================
  // CRON JOBS
  // ============================================

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processQueues() {
    for (const mode of this.queues.keys()) {
      await this.tryMatch(mode);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  cleanupStaleQueueEntries() {
    const now = Date.now();
    const maxWait = 5 * 60 * 1000; // 5 minutes

    for (const [mode, queue] of this.queues.entries()) {
      const initialLength = queue.length;
      const filtered = queue.filter(p => now - p.joinedAt < maxWait);
      
      // Remove stale entries
      const removed = queue.filter(p => now - p.joinedAt >= maxWait);
      removed.forEach(p => this.playerQueueMap.delete(p.userId));
      
      this.queues.set(mode, filtered);
      
      if (filtered.length !== initialLength) {
        this.logger.log(`Cleaned ${initialLength - filtered.length} stale entries from ${mode} queue`);
      }
    }
  }
}
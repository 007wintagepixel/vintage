// ============================================
// Match Service
// ============================================

import { Injectable, Logger } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMatchHistory(userId: string, page = 1, limit = 20) {
    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where: {
          players: {
            some: { userId },
          },
        },
        include: {
          players: {
            select: {
              userId: true,
              color: true,
              isBot: true,
              finalRank: true,
              coinsWon: true,
              coinsLost: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.match.count({
        where: {
          players: {
            some: { userId },
          },
        },
      }),
    ]);

    return {
      data: matches,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMatchReplay(matchId: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        players: true,
        events: {
          orderBy: { sequence: "asc" },
        },
      },
    });

    if (!match) throw new Error("Match not found");

    // Check if user is participant or admin
    const isParticipant = match.players.some((p: any) => p.userId === userId);
    if (!isParticipant) throw new Error("Not authorized");

    return match;
  }

  async getLiveMatches() {
    return this.prisma.match.findMany({
      where: {
        status: "in_progress",
      },
      include: {
        players: {
          select: {
            userId: true,
            color: true,
            isBot: true,
          },
        },
      },
      orderBy: { startedAt: "desc" },
      take: 50,
    });
  }
}

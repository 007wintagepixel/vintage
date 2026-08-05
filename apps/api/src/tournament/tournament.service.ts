// ============================================
// Tournament Service
// ============================================

import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { GameService } from '../game/game.service';

import type { CreateTournament, TournamentAction } from '@ludo-nexus/validation';

@Injectable()
export class TournamentService {
  private readonly logger = new Logger(TournamentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gameService: GameService,
  ) {}

  // ============================================
  // TOURNAMENT CRUD
  // ============================================

  async createTournament(userId: string, data: CreateTournament) {
    // Validate user is admin or has permission
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Validate prize breakdown sums to 100%
    const totalPercentage = data.prizeBreakdown.reduce((sum, p) => sum + p.percentage, 0);
    if (totalPercentage !== 100) {
      throw new BadRequestException('Prize breakdown must sum to 100%');
    }

    const tournament = await this.prisma.tournament.create({
      data: {
        name: data.name,
        description: data.description,
        mode: data.mode,
        maxParticipants: data.maxParticipants,
        entryFee: data.entryFee,
        prizeBreakdown: data.prizeBreakdown as any,
        rules: data.rules as any,
        status: 'draft',
        registrationOpensAt: new Date(data.registrationOpensAt),
        registrationClosesAt: new Date(data.registrationClosesAt),
        checkInStartsAt: data.checkInStartsAt ? new Date(data.checkInStartsAt) : null,
        checkInEndsAt: data.checkInEndsAt ? new Date(data.checkInEndsAt) : null,
        createdById: userId,
      },
    });

    return tournament;
  }

  async getTournament(tournamentId: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        createdBy: { select: { id: true, username: true, avatarUrl: true } },
        registrations: {
          include: { user: { select: { id: true, username: true, avatarUrl: true, level: true } } },
          orderBy: { registeredAt: 'asc' },
        },
        matches: {
          include: {
            players: { select: { userId: true, color: true, isBot: true, finalRank: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!tournament) throw new NotFoundException('Tournament not found');
    return tournament;
  }

  async getTournaments(status?: string, page = 1, limit = 20) {
    const where: any = {};
    if (status) where.status = status;

    const [tournaments, total] = await Promise.all([
      this.prisma.tournament.findMany({
        where,
        include: {
          createdBy: { select: { id: true, username: true } },
          _count: { select: { registrations: true, matches: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tournament.count({ where }),
    ]);

    return { data: tournaments, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateTournament(userId: string, tournamentId: string, data: Partial<CreateTournament>) {
    const tournament = await this.getTournament(tournamentId);
    if (tournament.createdById !== userId) {
      throw new ForbiddenException('Not the tournament creator');
    }
    if (tournament.status !== 'draft') {
      throw new BadRequestException('Can only update draft tournaments');
    }

    return this.prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        ...data,
        registrationOpensAt: data.registrationOpensAt ? new Date(data.registrationOpensAt) : undefined,
        registrationClosesAt: data.registrationClosesAt ? new Date(data.registrationClosesAt) : undefined,
        checkInStartsAt: data.checkInStartsAt ? new Date(data.checkInStartsAt) : undefined,
        checkInEndsAt: data.checkInEndsAt ? new Date(data.checkInEndsAt) : undefined,
        rules: data.rules as any,
        prizeBreakdown: data.prizeBreakdown as any,
      },
    });
  }

  async deleteTournament(userId: string, tournamentId: string) {
    const tournament = await this.getTournament(tournamentId);
    if (tournament.createdById !== userId) {
      throw new ForbiddenException('Not the tournament creator');
    }
    if (tournament.status !== 'draft' && tournament.status !== 'cancelled') {
      throw new BadRequestException('Can only delete draft or cancelled tournaments');
    }

    await this.prisma.tournament.delete({ where: { id: tournamentId } });
    return { success: true };
  }

  // ============================================
  // TOURNAMENT ACTIONS
  // ============================================

  async performAction(userId: string, data: TournamentAction) {
    const tournament = await this.getTournament(data.tournamentId);

    switch (data.action) {
      case 'register':
        return this.register(userId, tournament);
      case 'unregister':
        return this.unregister(userId, tournament);
      case 'check_in':
        return this.checkIn(userId, tournament);
      case 'publish':
        return this.publish(tournament, userId);
      case 'cancel':
        return this.cancel(tournament, userId);
      default:
        throw new BadRequestException('Invalid action');
    }
  }

  private async register(userId: string, tournament: any) {
    // Check status
    if (tournament.status !== 'registration_open' && tournament.status !== 'published') {
      throw new BadRequestException('Registration not open');
    }

    // Check if already registered
    const existing = await this.prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId } },
    });
    if (existing) throw new BadRequestException('Already registered');

    // Check capacity
    const count = await this.prisma.tournamentRegistration.count({
      where: { tournamentId: tournament.id },
    });
    if (count >= tournament.maxParticipants) {
      throw new BadRequestException('Tournament is full');
    }

    // Check entry fee
    if (tournament.entryFee > 0) {
      // TODO: Lock funds
    }

    const registration = await this.prisma.tournamentRegistration.create({
      data: {
        tournamentId: tournament.id,
        userId,
        registeredAt: new Date(),
      },
    });

    return registration;
  }

  private async unregister(userId: string, tournament: any) {
    if (tournament.status !== 'registration_open' && tournament.status !== 'registration_closed') {
      throw new BadRequestException('Cannot unregister at this stage');
    }

    const registration = await this.prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId } },
    });
    if (!registration) throw new NotFoundException('Not registered');

    if (registration.checkedIn) {
      throw new BadRequestException('Cannot unregister after check-in');
    }

    await this.prisma.tournamentRegistration.delete({
      where: { id: registration.id },
    });

    // TODO: Release locked funds

    return { success: true };
  }

  private async checkIn(userId: string, tournament: any) {
    if (tournament.status !== 'check_in') {
      throw new BadRequestException('Check-in not open');
    }

    const registration = await this.prisma.tournamentRegistration.findUnique({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId } },
    });
    if (!registration) throw new NotFoundException('Not registered');
    if (registration.checkedIn) throw new BadRequestException('Already checked in');

    await this.prisma.tournamentRegistration.update({
      where: { id: registration.id },
      data: { checkedIn: true, checkedInAt: new Date() },
    });

    return { success: true };
  }

  private async publish(tournament: any, userId: string) {
    if (tournament.createdById !== userId) {
      throw new ForbiddenException('Not the tournament creator');
    }
    if (tournament.status !== 'draft') {
      throw new BadRequestException('Can only publish draft tournaments');
    }

    const now = new Date();
    const newStatus = now >= tournament.registrationOpensAt ? 'registration_open' : 'published';

    await this.prisma.tournament.update({
      where: { id: tournament.id },
      data: { status: newStatus },
    });

    return { success: true, status: newStatus };
  }

  private async cancel(tournament: any, userId: string) {
    if (tournament.createdById !== userId) {
      throw new ForbiddenException('Not the tournament creator');
    }
    if (tournament.status === 'completed' || tournament.status === 'cancelled') {
      throw new BadRequestException('Cannot cancel');
    }

    // Refund entry fees
    const registrations = await this.prisma.tournamentRegistration.findMany({
      where: { tournamentId: tournament.id },
    });

    for (const reg of registrations) {
      if (tournament.entryFee > 0) {
        // TODO: Refund locked funds
      }
    }

    await this.prisma.tournament.update({
      where: { id: tournament.id },
      data: { status: 'cancelled', completedAt: new Date() },
    });

    return { success: true };
  }

  // ============================================
  // TOURNAMENT BRACKET & MATCHES
  // ============================================

  async generateBracket(tournamentId: string) {
    const tournament = await this.getTournament(tournamentId);
    
    if (tournament.status !== 'registration_closed' && tournament.status !== 'check_in') {
      throw new BadRequestException('Registration must be closed before generating bracket');
    }

    // Get checked-in participants
    const participants = await this.prisma.tournamentRegistration.findMany({
      where: { 
        tournamentId, 
        checkedIn: true,
        eliminatedAt: null,
      },
      orderBy: { registeredAt: 'asc' },
    });

    if (participants.length < 2) {
      throw new BadRequestException('Need at least 2 participants');
    }

    // Generate knockout bracket
    const bracket = this.createKnockoutBracket(participants);
    
    // Create first round matches
    await this.createBracketMatches(tournamentId, bracket.rounds[0]);

    // Update tournament status
    await this.prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: 'in_progress', startedAt: new Date() },
    });

    return bracket;
  }

  private createKnockoutBracket(participants: any[]) {
    // Shuffle for random seeding
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    
    const rounds: any[] = [];
    let currentRound = shuffled.map((p, i) => ({
      seed: i + 1,
      registrationId: p.id,
      userId: p.userId,
    }));

    let roundNumber = 1;
    while (currentRound.length > 1) {
      const matches: any[] = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        if (i + 1 < currentRound.length) {
          matches.push({
            player1: currentRound[i],
            player2: currentRound[i + 1],
          });
        } else {
          // Bye - player advances automatically
          matches.push({
            player1: currentRound[i],
            player2: null,
            walkover: true,
          });
        }
      }
      rounds.push({ roundNumber, matches });
      // Next round will have half the players (winners)
      currentRound = matches.map((_, i) => ({ seed: i + 1 })); // Placeholders for winners
      roundNumber++;
    }

    return { rounds };
  }

  private async createBracketMatches(tournamentId: string, roundMatches: any[]) {
    for (const matchData of roundMatches) {
      if (matchData.walkover) {
        // Auto-advance
        await this.prisma.tournamentRegistration.update({
          where: { id: matchData.player1.registrationId },
          data: { /* advance to next round */ },
        });
        continue;
      }

      // Create match
      await this.gameService.createMatch(matchData.player1.userId, 'tournament', {
        entryFee: 0, // Already paid entry fee
      });
    }
  }

  // ============================================
  // CRON JOBS
  // ============================================

  @Cron(CronExpression.EVERY_MINUTE)
  async updateTournamentStatuses() {
    const now = new Date();

    // Published -> Registration Open
    await this.prisma.tournament.updateMany({
      where: {
        status: 'published',
        registrationOpensAt: { lte: now },
      },
      data: { status: 'registration_open' },
    });

    // Registration Open -> Registration Closed
    await this.prisma.tournament.updateMany({
      where: {
        status: 'registration_open',
        registrationClosesAt: { lte: now },
      },
      data: { status: 'registration_closed' },
    });

    // Registration Closed -> Check-in (if configured)
    await this.prisma.tournament.updateMany({
      where: {
        status: 'registration_closed',
        checkInStartsAt: { lte: now },
        checkInEndsAt: { gte: now },
      },
      data: { status: 'check_in' },
    });

    // Check-in -> In Progress (auto-generate bracket)
    const tournamentsToStart = await this.prisma.tournament.findMany({
      where: {
        status: 'check_in',
        checkInEndsAt: { lte: now },
      },
    });

    for (const t of tournamentsToStart) {
      try {
        await this.generateBracket(t.id);
      } catch (error) {
        this.logger.error(`Failed to start tournament ${t.id}: ${error.message}`);
      }
    }
  }
}
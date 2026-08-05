// ============================================
// Game Service
// ============================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { GameEngineService } from './game-engine.service';

import type { GameState, GameRules, PlayerColor, GameMode, MatchStatus } from '@ludo-nexus/shared-types';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly gameEngine: GameEngineService,
  ) {}

  // ============================================
  // MATCH MANAGEMENT
  // ============================================

  async createMatch(
    userId: string,
    mode: GameMode,
    options: {
      entryFee?: number;
      rules?: Partial<GameRules>;
      opponentCount?: number;
      botDifficulty?: 'easy' | 'medium' | 'hard';
    } = {}
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) throw new Error('User not found');

    // Check wallet balance for entry fee
    const entryFee = options.entryFee ?? 0;
    if (entryFee > 0 && user.wallet && user.wallet.available < entryFee) {
      throw new Error('Insufficient balance');
    }

    // Lock entry fee
    if (entryFee > 0) {
      await this.lockFunds(userId, entryFee, 'match_entry');
    }

    // Create match players
    const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
    const players = [
      { userId, color: colors[0], isBot: false },
    ];

    // Add bots for vs_ai mode
    if (mode === 'vs_ai') {
      const count = options.opponentCount ?? 1;
      for (let i = 1; i <= count; i++) {
        players.push({
          userId: `bot-${uuidv4()}`,
          color: colors[i],
          isBot: true,
          botDifficulty: options.botDifficulty ?? 'medium',
        });
      }
    }

    // Create match in database
    const match = await this.prisma.match.create({
      data: {
        mode,
        entryFee,
        prizePool: entryFee * players.length,
        platformFee: Math.floor(entryFee * players.length * 0.1),
        status: 'waiting',
        players: {
          create: players.map(p => ({
            userId: p.userId,
            color: p.color,
            isBot: p.isBot,
            botDifficulty: p.botDifficulty,
          })),
        },
      },
      include: { players: true },
    });

    // Initialize game state
    const gameState = this.gameEngine.createInitialGameState(
      match.id,
      match.players.map(p => ({
        userId: p.userId,
        color: p.color,
        isBot: p.isBot,
        botDifficulty: p.botDifficulty,
      })),
      options.rules,
      mode,
    );

    // Update match with game state
    await this.prisma.match.update({
      where: { id: match.id },
      data: {
        status: 'in_progress',
        gameState: gameState as any,
        startedAt: new Date(),
      },
    });

    return { matchId: match.id, gameState };
  }

  async getMatch(matchId: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { players: true },
    });

    if (!match) throw new Error('Match not found');

    // Check if user is part of match
    const isParticipant = match.players.some(p => p.userId === userId);
    if (!isParticipant) throw new Error('Not a participant');

    return match;
  }

  async getMatchState(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) throw new Error('Match not found');

    return match.gameState as GameState;
  }

  // ============================================
  // GAME ACTIONS
  // ============================================

  async rollDice(matchId: string, userId: string, idempotencyKey: string) {
    const match = await this.getMatch(matchId, userId);
    const gameState = match.gameState as GameState;

    // Validate it's user's turn
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.userId !== userId) {
      throw new Error('Not your turn');
    }

    if (currentPlayer.hasRolled) {
      throw new Error('Already rolled');
    }

    // Check idempotency
    const existing = await this.prisma.ledgerEntry.findUnique({
      where: { idempotencyKey },
    });
    if (existing) throw new Error('Duplicate request');

    // Roll dice (server-authoritative)
    const diceRoll = this.gameEngine.rollDice();
    currentPlayer.hasRolled = true;

    // Calculate legal moves
    const legalMoves = this.gameEngine.getLegalMoves({
      ...gameState,
      diceRoll: { ...diceRoll, rolledBy: userId },
    });

    // Update game state
    const newGameState = {
      ...gameState,
      diceRoll: { ...diceRoll, rolledBy: userId },
      legalMoves,
      stateVersion: gameState.stateVersion + 1,
    };

    // Save
    await this.prisma.match.update({
      where: { id: matchId },
      data: { gameState: newGameState as any },
    });

    // Emit event
    // TODO: Emit via WebSocket gateway

    return { diceRoll, legalMoves, gameState: newGameState };
  }

  async moveToken(
    matchId: string,
    userId: string,
    tokenId: number,
    toPosition: number,
    gameStateVersion: number,
    idempotencyKey: string
  ) {
    const match = await this.getMatch(matchId, userId);
    const gameState = match.gameState as GameState;

    // Validate turn
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.userId !== userId) {
      throw new Error('Not your turn');
    }

    // Validate version
    if (gameState.stateVersion !== gameStateVersion) {
      throw new Error('Game state version mismatch');
    }

    // Check idempotency
    const existing = await this.prisma.ledgerEntry.findUnique({
      where: { idempotencyKey },
    });
    if (existing) throw new Error('Duplicate request');

    // Validate and execute move
    const validation = this.gameEngine.validateMove(
      gameState,
      userId,
      tokenId,
      toPosition,
      gameStateVersion
    );

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const { gameState: newGameState, move, capturedTokens } = this.gameEngine.moveToken(
      gameState,
      tokenId,
      toPosition
    );

    // Apply captures
    const finalGameState = capturedTokens.length > 0
      ? this.gameEngine.applyCaptures(newGameState, capturedTokens)
      : newGameState;

    // Check for match completion
    if (finalGameState.status === 'completed') {
      await this.completeMatch(matchId, finalGameState);
    }

    // Save
    await this.prisma.match.update({
      where: { id: matchId },
      data: { gameState: finalGameState as any },
    });

    // Record move event
    await this.prisma.matchEvent.create({
      data: {
        matchId,
        sequence: finalGameState.moveHistory.length,
        type: 'move',
        playerId: userId,
        data: move as any,
      },
    });

    // Emit event
    // TODO: Emit via WebSocket gateway

    return { gameState: finalGameState, move, capturedTokens };
  }

  // ============================================
  // MATCH COMPLETION
  // ============================================

  private async completeMatch(matchId: string, gameState: GameState) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { players: true },
    });

    if (!match) return;

    const winnerId = gameState.winner;
    const rankings = gameState.rankings;

    // Calculate rewards
    const entryFee = Number(match.entryFee);
    const totalPool = entryFee * match.players.length;
    const platformFee = Math.floor(totalPool * 0.1);
    const winnerReward = totalPool - platformFee;

    // Update match
    await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'completed',
        winnerId,
        completedAt: new Date(),
      },
    });

    // Update players and wallets
    for (let i = 0; i < rankings.length; i++) {
      const playerId = rankings[i];
      const player = match.players.find(p => p.userId === playerId);
      if (!player || player.isBot) continue;

      const rank = i + 1;
      let coinsWon = 0;
      let coinsLost = 0;

      if (rank === 1) {
        coinsWon = winnerReward;
        await this.releaseFunds(playerId, winnerReward, 'match_win', matchId);
      } else {
        coinsLost = entryFee;
        await this.releaseFunds(playerId, 0, 'match_loss', matchId);
      }

      await this.prisma.matchPlayer.update({
        where: { id: player.id },
        data: { finalRank: rank, coinsWon, coinsLost },
      });

      // Update user stats
      await this.prisma.user.update({
        where: { id: playerId },
        data: {
          totalMatches: { increment: 1 },
          wins: rank === 1 ? { increment: 1 } : undefined,
          losses: rank > 1 ? { increment: 1 } : undefined,
        },
      });
    }

    // Release platform fee
    // TODO: Track platform revenue
  }

  // ============================================
  // WALLET HELPERS
  // ============================================

  private async lockFunds(userId: string, amount: number, referenceType: string, referenceId?: string) {
    await this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.available < amount) {
        throw new Error('Insufficient funds');
      }

      const newAvailable = wallet.available - BigInt(amount);
      const newLocked = wallet.locked + BigInt(amount);

      await tx.wallet.update({
        where: { userId },
        data: { available: newAvailable, locked: newLocked },
      });

      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          userId,
          type: 'debit',
          amount: -BigInt(amount),
          balanceType: 'available',
          referenceType: referenceType as any,
          referenceId: referenceId ?? null,
          description: `Locked for ${referenceType}`,
          runningBalance: newAvailable,
          idempotencyKey: `lock-${referenceId}-${Date.now()}`,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          userId,
          type: 'credit',
          amount: BigInt(amount),
          balanceType: 'locked',
          referenceType: referenceType as any,
          referenceId: referenceId ?? null,
          description: `Locked for ${referenceType}`,
          runningBalance: newLocked,
          idempotencyKey: `lock-${referenceId}-${Date.now()}-locked`,
        },
      });
    });
  }

  private async releaseFunds(userId: string, amount: number, referenceType: string, referenceId?: string) {
    await this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) throw new Error('Wallet not found');

      const newLocked = wallet.locked - BigInt(amount);
      const newAvailable = wallet.available + BigInt(amount);

      await tx.wallet.update({
        where: { userId },
        data: { locked: newLocked, available: newAvailable },
      });

      if (amount > 0) {
        await tx.ledgerEntry.create({
          data: {
            walletId: wallet.id,
            userId,
            type: 'credit',
            amount: BigInt(amount),
            balanceType: 'available',
            referenceType: referenceType as any,
            referenceId: referenceId ?? null,
            description: `Released from ${referenceType}`,
            runningBalance: newAvailable,
            idempotencyKey: `release-${referenceId}-${Date.now()}`,
          },
        });
      }

      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          userId,
          type: 'debit',
          amount: -BigInt(amount),
          balanceType: 'locked',
          referenceType: referenceType as any,
          referenceId: referenceId ?? null,
          description: `Released from ${referenceType}`,
          runningBalance: newLocked,
          idempotencyKey: `release-${referenceId}-${Date.now()}-locked`,
        },
      });
    });
  }
}

// Need uuidv4 import
import { v4 as uuidv4 } from 'uuid';
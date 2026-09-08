// ============================================
// @ludo-nexus/game-engine - Bot AI Implementations
// ============================================

import type { GameState, PlayerState, TokenState, PlayerColor } from '@ludo-nexus/shared-types';
import type { BotDecision } from '../index';
import {
  getLegalMoves,
  isInHome,
  isInHomeLane,
  isFinished,
  isSafeCell,
  getRelativePosition,
  START_POSITIONS,
  DEFAULT_SAFE_CELLS,
} from '../constants';
import { getBotConfig, getConfigForDifficulty, type BotConfig } from './botConfig';

// ============================================
// EASY BOT - Mostly random legal moves
// ============================================

export class EasyBot {
  private config: BotConfig;
  private rng: () => number;

  constructor(config?: BotConfig) {
    this.config = config ?? getConfigForDifficulty('easy');
    // Use seeded random if configured
    if (this.config.randomSeed !== undefined) {
      let seed = this.config.randomSeed;
      this.rng = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
    } else {
      this.rng = Math.random;
    }
  }

  decide(gameState: GameState, playerIndex: number): BotDecision {
    const player = gameState.players[playerIndex];
    const legalMoves = getLegalMoves(gameState);

    // If no legal moves, must roll (or skip if already rolled)
    if (legalMoves.length === 0) {
      return { action: player.hasRolled ? 'roll' : 'roll' };
    }

    // If hasn't rolled yet, roll
    if (!player.hasRolled && !gameState.diceRoll) {
      return { action: 'roll' };
    }

    // Pick a random legal move
    const randomIndex = Math.floor(this.rng() * legalMoves.length);
    const randomMove = legalMoves[randomIndex];
    return { action: 'move', tokenId: randomMove.tokenId };
  }
}

// ============================================
// MEDIUM BOT - Prioritizes captures, avoids danger, balanced
// ============================================

export class MediumBot {
  private config: BotConfig;
  private rng: () => number;

  constructor(config?: BotConfig) {
    this.config = config ?? getConfigForDifficulty('medium');
    // Use seeded random if configured
    if (this.config.randomSeed !== undefined) {
      let seed = this.config.randomSeed;
      this.rng = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
    } else {
      this.rng = Math.random;
    }
  }

  decide(gameState: GameState, playerIndex: number): BotDecision {
    const player = gameState.players[playerIndex];
    const legalMoves = getLegalMoves(gameState);

    if (legalMoves.length === 0) {
      return { action: 'roll' };
    }

    if (!player.hasRolled && !gameState.diceRoll) {
      return { action: 'roll' };
    }

    const weights = this.config.weights.medium;

    // Score each legal move
    const scoredMoves = legalMoves.map((move) => {
      const token = player.tokens[move.tokenId];
      let score = 0;

      // High priority: Move token out of home
      if (isInHome(token.position)) {
        score += weights.exitHome;
      }

      // High priority: Enter home lane / finish
      if (isInHomeLane(move.toPosition)) {
        score += weights.enterHomeLane;
      }
      if (isFinished(move.toPosition)) {
        score += weights.finishToken;
      }

      // Priority: Capture opponent
      const captures = this.countCapturesAtPosition(gameState, player.userId, move.toPosition);
      if (captures > 0) {
        score += weights.capture * captures;
      }

      // Priority: Land on safe cell
      if (isSafeCell(move.toPosition, gameState.rules.safeCells)) {
        score += weights.safeCell;
      }

      // Avoid: Move to position where we can be captured next turn
      const dangerScore = this.calculateDanger(gameState, player, move.toPosition);
      score -= dangerScore * weights.avoidDanger;

      // Priority: Advance tokens that are farthest behind
      const relativePos = isInHome(token.position) ? -1 : getRelativePosition(player.color, token.position);
      if (relativePos >= 0 && relativePos < 20) {
        score += weights.helpLagging; // Help lagging tokens
      }

      // Small random factor to avoid predictability
      if (this.config.enableRandomness) {
        score += this.rng() * weights.randomFactor;
      }

      return { ...move, score };
    });

    // Pick highest scored move
    scoredMoves.sort((a, b) => b.score - a.score);
    return { action: 'move', tokenId: scoredMoves[0].tokenId };
  }

  private countCapturesAtPosition(
    gameState: GameState,
    movingPlayerId: string,
    position: number
  ): number {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    let count = 0;
    gameState.players.forEach((p) => {
      if (p.userId === movingPlayerId || !p.isActive) return;
      p.tokens.forEach((t) => {
        if (t.position === position && !t.isFinished && !isInHome(t.position)) {
          count++;
        }
      });
    });
    return count;
  }

  private calculateDanger(
    gameState: GameState,
    player: PlayerState,
    position: number
  ): number {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    let danger = 0;
    gameState.players.forEach((p) => {
      if (p.userId === player.userId || !p.isActive) return;

      // Check if opponent can capture this position on their next turn
      p.tokens.forEach((token) => {
        if (isInHome(token.position) || isFinished(token.position)) return;

        const relativePos = getRelativePosition(p.color, token.position);
        const distance = this.getDistanceToTarget(p.color, relativePos, position);

        // Opponent can capture if they can roll the exact distance (1-6)
        if (distance >= 1 && distance <= 6) {
          danger += 1;
        }
      });
    });
    return danger;
  }

  private getDistanceToTarget(color: PlayerColor, fromRelative: number, targetAbsolute: number): number {
    const targetRelative = this.getRelativePositionForColor(color, targetAbsolute);
    if (targetRelative < fromRelative) return 100; // Behind
    return targetRelative - fromRelative;
  }

  private getRelativePositionForColor(color: PlayerColor, absolute: number): number {
    const start = START_POSITIONS[color];
    let rel = absolute - start;
    if (rel < 0) rel += 52;
    return rel;
  }
}

// ============================================
// HARD BOT - Weighted evaluation, risk calculation, blocking
// ============================================

export class HardBot {
  private config: BotConfig;
  private rng: () => number;

  constructor(config?: BotConfig) {
    this.config = config ?? getConfigForDifficulty('hard');
    // Use seeded random if configured
    if (this.config.randomSeed !== undefined) {
      let seed = this.config.randomSeed;
      this.rng = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
    } else {
      this.rng = Math.random;
    }
  }

  decide(gameState: GameState, playerIndex: number): BotDecision {
    const player = gameState.players[playerIndex];
    const legalMoves = getLegalMoves(gameState);

    if (legalMoves.length === 0) {
      return { action: 'roll' };
    }

    if (!player.hasRolled && !gameState.diceRoll) {
      return { action: 'roll' };
    }

    const weights = this.config.weights.hard;

    // Evaluate each move with full game state analysis
    const evaluatedMoves = legalMoves.map((move) => {
      const token = player.tokens[move.tokenId];
      const evaluation = this.evaluateMove(gameState, player, token, move, weights);
      return { ...move, evaluation };
    });

    // Pick best move
    evaluatedMoves.sort((a, b) => b.evaluation - a.evaluation);
    return { action: 'move', tokenId: evaluatedMoves[0].tokenId };
  }

  private evaluateMove(
    gameState: GameState,
    player: PlayerState,
    token: TokenState,
    move: { tokenId: number; fromPosition: number; toPosition: number },
    weights: BotConfig['weights']['hard']
  ): number {
    let score = 0;
    const { toPosition } = move;

    // 1. Exit home - critical priority
    if (isInHome(token.position)) {
      score += weights.exitHome;
    }

    // 2. Enter home lane / finish
    if (isInHomeLane(toPosition)) {
      score += weights.enterHomeLane;
      // Closer to finish = better
      score += (toPosition - 52) * 20;
    }
    if (isFinished(toPosition)) {
      score += weights.finishToken;
    }

    // 3. Capture evaluation
    const captures = this.analyzeCaptures(gameState, player.userId, toPosition);
    score += captures.immediate * weights.capture;
    score += captures.strategic * (weights.capture * 0.5);

    // 4. Safe cell bonus
    if (isSafeCell(toPosition, gameState.rules.safeCells)) {
      score += weights.safeCell;
    }

    // 5. Danger assessment
    const danger = this.assessDanger(gameState, player, toPosition);
    score -= danger * weights.avoidDanger;

    // 6. Blocking opponents (positioning to threaten)
    const blockValue = this.calculateBlockingValue(gameState, player, toPosition);
    score += blockValue * weights.blockOpponent;

    // 7. Token progression strategy
    const progression = this.evaluateProgression(gameState, player, token, toPosition, weights);
    score += progression;

    // 8. Extra turn potential
    const diceValue = gameState.diceRoll?.value ?? 0;
    const extraTurnChance = this.calculateExtraTurnChance(gameState, player, toPosition, diceValue);
    score += extraTurnChance * weights.extraTurnValue;

    return score;
  }

  private analyzeCaptures(
    gameState: GameState,
    movingPlayerId: string,
    position: number
  ): { immediate: number; strategic: number } {
    if (isSafeCell(position, gameState.rules.safeCells)) return { immediate: 0, strategic: 0 };
    if (isInHomeLane(position) || isFinished(position)) return { immediate: 0, strategic: 0 };

    let immediate = 0;
    let strategic = 0;

    gameState.players.forEach((p) => {
      if (p.userId === movingPlayerId || !p.isActive) return;

      p.tokens.forEach((token) => {
        if (token.position === position && !token.isFinished && !isInHome(token.position)) {
          immediate++;

          // Strategic: Capturing a token that's far advanced hurts opponent more
          const relativePos = getRelativePosition(p.color, token.position);
          if (relativePos > 30) strategic += 2;
          else if (relativePos > 15) strategic += 1;
        }
      });
    });

    return { immediate, strategic };
  }

  private assessDanger(
    gameState: GameState,
    player: PlayerState,
    position: number
  ): number {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    let danger = 0;

    gameState.players.forEach((p) => {
      if (p.userId === player.userId || !p.isActive) return;

      p.tokens.forEach((token) => {
        if (isInHome(token.position) || isFinished(token.position)) return;

        const relativePos = getRelativePosition(p.color, token.position);
        const distance = this.getDistanceToTarget(p.color, relativePos, position);

        // Probability-weighted danger
        if (distance >= 1 && distance <= 6) {
          // Closer tokens = higher danger
          danger += (7 - distance) / 6;
        }

        // Extra danger if opponent has multiple tokens threatening
      });
    });

    return danger;
  }

  private calculateBlockingValue(
    gameState: GameState,
    player: PlayerState,
    position: number
  ): number {
    // Position ourselves to threaten opponent tokens on their next turn
    let blockValue = 0;

    gameState.players.forEach((p) => {
      if (p.userId === player.userId || !p.isActive) return;

      p.tokens.forEach((token) => {
        if (isInHome(token.position) || isFinished(token.position)) return;

        const tokenRelative = getRelativePosition(p.color, token.position);
        const ourRelative = this.getRelativePositionForColor(player.color, position);

        // We threaten if we're 1-6 behind them
        const distance = tokenRelative - ourRelative;
        if (distance >= 1 && distance <= 6) {
          blockValue += (7 - distance) / 6;
        }
      });
    });

    return blockValue;
  }

  private evaluateProgression(
    gameState: GameState,
    player: PlayerState,
    token: TokenState,
    toPosition: number,
    weights: BotConfig['weights']['hard']
  ): number {
    const finishedCount = player.tokens.filter((t) => t.isFinished).length;
    const homeLaneCount = player.tokens.filter((t) => isInHomeLane(t.position)).length;
    const onBoardCount = player.tokens.filter((t) => !isInHome(t.position) && !isFinished(t.position) && !isInHomeLane(t.position)).length;

    let score = 0;

    // Early game: Get tokens out of home
    if (finishedCount === 0 && homeLaneCount === 0 && onBoardCount < 2) {
      if (isInHome(token.position)) score += 50;
    }

    // Mid game: Balance advancing and safety
    if (finishedCount < 2) {
      const relativePos = isInHome(token.position) ? -1 : getRelativePosition(player.color, token.position);
      if (relativePos >= 0 && relativePos < 20) {
        score += weights.helpLagging;
      }
    }

    // Late game: Race to finish
    if (finishedCount >= 2) {
      if (isInHomeLane(toPosition) || isFinished(toPosition)) {
        score += weights.advanceLeading * 2;
      }
    }

    return score;
  }

  private calculateExtraTurnChance(
    gameState: GameState,
    player: PlayerState,
    toPosition: number,
    currentDice: number
  ): number {
    let chance = 0;

    // Extra turn on six (already rolled)
    if (currentDice === 6 && gameState.rules.extraTurnOnSix) {
      chance += 1;
    }

    // Extra turn on capture
    const captures = this.analyzeCaptures(gameState, player.userId, toPosition);
    if (captures.immediate > 0 && gameState.rules.extraTurnOnCapture) {
      chance += 0.8;
    }

    // Extra turn on home entry
    if (isFinished(toPosition) && gameState.rules.extraTurnOnHome) {
      chance += 1;
    }

    return chance;
  }

  private getDistanceToTarget(color: PlayerColor, fromRelative: number, targetAbsolute: number): number {
    const targetRelative = this.getRelativePositionForColor(color, targetAbsolute);
    if (targetRelative < fromRelative) return 100;
    return targetRelative - fromRelative;
  }

  private getRelativePositionForColor(color: PlayerColor, absolute: number): number {
    const start = START_POSITIONS[color];
    let rel = absolute - start;
    if (rel < 0) rel += 52;
    return rel;
  }
}

// ============================================
// BOT FACTORY
// ============================================

export type BotDifficulty = 'easy' | 'medium' | 'hard';

export function createBot(difficulty: BotDifficulty, config?: BotConfig): EasyBot | MediumBot | HardBot {
  switch (difficulty) {
    case 'easy':
      return new EasyBot(config);
    case 'medium':
      return new MediumBot(config);
    case 'hard':
      return new HardBot(config);
    default:
      return new MediumBot(config);
  }
}

// ============================================
// EXPORTS
// ============================================

export const BotAI = {
  EasyBot,
  MediumBot,
  HardBot,
  createBot,
};
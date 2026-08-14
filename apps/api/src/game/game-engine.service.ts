// ============================================
// Game Engine Service (Server-authoritative wrapper)
// ============================================

import { Injectable } from "@nestjs/common";

import {
  createInitialGameState,
  getLegalMoves,
  moveToken,
  applyCaptures,
  calculateNextTurn,
  checkPlayerCompletion,
  checkMatchCompletion,
  validateMove,
  serializePublicState,
  restoreGameState,
  calculateTeamResult,
  rollDice,
  createDiceRoll,
  DEFAULT_GAME_RULES,
} from "@ludo-nexus/game-engine";

import type {
  GameRules,
  GameState,
  PlayerState,
  TokenState,
  Move,
  DiceRoll,
  PlayerColor,
  GameMode,
  MatchStatus,
} from "@ludo-nexus/shared-types";

@Injectable()
export class GameEngineService {
  // Re-export all engine functions
  createInitialGameState = createInitialGameState;
  getLegalMoves = getLegalMoves;
  moveToken = moveToken;
  applyCaptures = applyCaptures;
  calculateNextTurn = calculateNextTurn;
  checkPlayerCompletion = checkPlayerCompletion;
  checkMatchCompletion = checkMatchCompletion;
  validateMove = validateMove;
  serializePublicState = serializePublicState;
  restoreGameState = restoreGameState;
  calculateTeamResult = calculateTeamResult;
  rollDice = rollDice;
  createDiceRoll = createDiceRoll;

  // Default rules
  readonly DEFAULT_GAME_RULES: GameRules = {
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
    botDifficulty: "medium",
  };
}

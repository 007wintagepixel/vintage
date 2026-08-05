// ============================================
// @ludo-nexus/game-engine - Core Game Engine
// Pure, deterministic functions for Ludo game logic
// ============================================

import type {
  GameRules,
  GameState,
  PlayerState,
  TokenState,
  Move,
  DiceRoll,
  PlayerColor,
  MatchStatus,
  GameMode,
} from '@ludo-nexus/shared-types';

import {
  BOARD_SIZE,
  HOME_POSITION,
  FINISHED_POSITION,
  TOKENS_PER_PLAYER,
  PLAYER_COLORS,
  START_POSITIONS,
  HOME_LANE_ENTRY,
  DEFAULT_SAFE_CELLS,
  DEFAULT_GAME_RULES,
  getNextPlayerIndex,
  getAbsolutePosition,
  getRelativePosition,
  getTrackDistance,
  isSafeCell,
  isInHome,
  isInHomeLane,
  isFinished,
  canEnterBoard,
  canEnterHomeLane,
  getHomeLanePosition,
  wouldLandOnSafeCell,
} from '../constants';

import { randomBytes } from 'crypto';

// ============================================
// DICE ROLL GENERATION (Server-authoritative)
// ============================================

/**
 * Generate a cryptographically secure dice roll (1-6)
 * This MUST be called on the server only
 */
export function rollDice(): number {
  // Use crypto.randomBytes for cryptographically secure random
  const buffer = randomBytes(1);
  const value = (buffer[0] % 6) + 1;
  return value;
}

/**
 * Create a dice roll object with audit trail
 */
export function createDiceRoll(rolledBy: string): DiceRoll {
  const value = rollDice();
  return {
    value,
    rolledAt: new Date().toISOString(),
    rolledBy,
    isServerGenerated: true,
    auditId: generateAuditId(),
  };
}

/**
 * Generate a unique audit ID for dice rolls
 */
function generateAuditId(): string {
  return randomBytes(16).toString('hex');
}

// ============================================
// INITIAL GAME STATE
// ============================================

/**
 * Create initial game state for a new match
 */
export function createInitialGameState(
  matchId: string,
  players: Array<{ userId: string; color: PlayerColor; isBot?: boolean; botDifficulty?: 'easy' | 'medium' | 'hard'; teamId?: number }>,
  rules: Partial<GameRules> = {},
  mode: GameMode = 'vs_human',
  roomId?: string,
  tournamentId?: string
): GameState {
  const mergedRules: GameRules = { ...DEFAULT_GAME_RULES, ...rules };
  
  const playerStates: PlayerState[] = players.map((p, index) => ({
    userId: p.userId,
    color: p.color,
    tokens: Array.from({ length: TOKENS_PER_PLAYER }, (_, i) => ({
      id: i,
      position: HOME_POSITION,
      isInHome: true,
      isFinished: false,
    })),
    isActive: true,
    isConnected: true,
    hasRolled: false,
    consecutiveSixes: 0,
    isBot: p.isBot ?? false,
    botDifficulty: p.botDifficulty,
    teamId: p.teamId,
  }));

  return {
    matchId,
    roomId,
    tournamentId,
    mode,
    rules: mergedRules,
    players: playerStates,
    currentPlayerIndex: 0,
    diceRoll: undefined,
    legalMoves: [],
    moveHistory: [],
    stateVersion: 1,
    status: 'waiting',
    winner: null,
    rankings: [],
    createdAt: new Date().toISOString(),
  };
}

// ============================================
// LEGAL MOVES CALCULATION
// ============================================

/**
 * Get all legal moves for the current player given the dice value
 */
export function getLegalMoves(gameState: GameState): Array<{
  tokenId: number;
  fromPosition: number;
  toPosition: number;
}> {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const diceValue = gameState.diceRoll?.value ?? 0;
  const legalMoves: Array<{ tokenId: number; fromPosition: number; toPosition: number }> = [];

  if (diceValue === 0) {
    return legalMoves;
  }

  currentPlayer.tokens.forEach((token, tokenId) => {
    const fromPosition = token.position;
    let toPosition = fromPosition;
    let isValid = false;

    if (isInHome(fromPosition)) {
      // Token in home - can only enter on entry roll
      if (canEnterBoard(diceValue, gameState.rules.entryRoll)) {
        toPosition = START_POSITIONS[currentPlayer.color];
        isValid = true;
      }
    } else if (isFinished(fromPosition)) {
      // Token already finished - cannot move
      isValid = false;
    } else if (isInHomeLane(fromPosition)) {
      // Token in home lane
      const stepsToFinish = FINISHED_POSITION - fromPosition;
      if (diceValue === stepsToFinish) {
        toPosition = FINISHED_POSITION;
        isValid = true;
      } else if (diceValue < stepsToFinish) {
        toPosition = fromPosition + diceValue;
        isValid = true;
      }
      // diceValue > stepsToFinish: invalid (exact roll required)
    } else {
      // Token on main track
      const relativePos = getRelativePosition(currentPlayer.color, fromPosition);
      
      if (canEnterHomeLane(currentPlayer.color, relativePos, diceValue)) {
        // Can enter home lane
        toPosition = getHomeLanePosition(currentPlayer.color, relativePos, diceValue);
        isValid = true;
      } else {
        // Move on main track
        const newRelativePos = relativePos + diceValue;
        if (newRelativePos < BOARD_SIZE) {
          toPosition = getAbsolutePosition(currentPlayer.color, newRelativePos);
          isValid = true;
        }
        // If newRelativePos >= BOARD_SIZE, would overshoot - invalid
      }
    }

    // Additional validation: check if destination is occupied by own token (blockade)
    if (isValid && gameState.rules.allowBlockades) {
      const ownTokenAtDest = currentPlayer.tokens.some(
        (t, i) => i !== tokenId && t.position === toPosition && !isFinished(t.position)
      );
      if (ownTokenAtDest) {
        isValid = false;
      }
    }

    // Check if destination is a safe cell (additional info for UI)
    // Note: Safe cells don't prevent movement, they prevent capture

    if (isValid) {
      legalMoves.push({
        tokenId,
        fromPosition,
        toPosition,
      });
    }
  });

  return legalMoves;
}

// ============================================
// MOVE EXECUTION
// ============================================

/**
 * Execute a move and return the updated game state
 */
export function moveToken(
  gameState: GameState,
  tokenId: number,
  toPosition: number
): { gameState: GameState; move: Move; capturedTokens: Array<{ playerId: string; tokenId: number; fromPosition: number }> } {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const token = currentPlayer.tokens[tokenId];
  const fromPosition = token.position;
  const diceValue = gameState.diceRoll?.value ?? 0;

  // Validate the move is legal
  const legalMoves = getLegalMoves(gameState);
  const moveIndex = legalMoves.findIndex(m => m.tokenId === tokenId && m.toPosition === toPosition);
  
  if (moveIndex === -1) {
    throw new Error('Illegal move');
  }

  // Check for captures
  const capturedTokens = checkCaptures(gameState, currentPlayer.userId, toPosition);

  // Apply captures to game state (return captured tokens to home)
  const stateAfterCaptures = applyCaptures(gameState, capturedTokens);

  // Update token position on the state after captures
  const currentPlayerAfterCaptures = stateAfterCaptures.players[gameState.currentPlayerIndex];
  const updatedTokens = currentPlayerAfterCaptures.tokens.map((t, i) => {
    if (i === tokenId) {
      return {
        ...t,
        position: toPosition,
        isInHome: isInHome(toPosition),
        isFinished: isFinished(toPosition),
      };
    }
    return t;
  });

  // Check if player has won (all tokens finished) - use updated tokens
  const playerCompleted = updatedTokens.every(t => t.isFinished);

  // Create updated players for match completion check
  const updatedPlayersForCheck = stateAfterCaptures.players.map((p, i) => {
    if (i === gameState.currentPlayerIndex) {
      return {
        ...p,
        tokens: updatedTokens,
      };
    }
    return p;
  });

  // Check if match is completed - use state with updated tokens
  const matchCompleted = checkMatchCompletion(
    { ...stateAfterCaptures, players: updatedPlayersForCheck },
    currentPlayer.userId
  );

  // Determine if extra turn
  const isSix = diceValue === 6;
  const isCapture = capturedTokens.length > 0;
  const isHomeEntry = isFinished(toPosition);
  
  const extraTurn = 
    (isSix && gameState.rules.extraTurnOnSix) ||
    (isCapture && gameState.rules.extraTurnOnCapture) ||
    (isHomeEntry && gameState.rules.extraTurnOnHome);

  // Handle three consecutive sixes
  let newConsecutiveSixes = currentPlayer.consecutiveSixes;
  if (isSix) {
    newConsecutiveSixes += 1;
  } else {
    newConsecutiveSixes = 0;
  }

  const threeSixes = newConsecutiveSixes >= 3 && gameState.rules.allowThreeSixes;

  // Create move record
  const move: Move = {
    tokenId,
    fromPosition,
    toPosition,
    capturedTokens: capturedTokens.map(c => ({
      playerId: c.playerId,
      tokenId: c.tokenId,
      fromPosition: c.fromPosition,
    })),
    isExtraTurn: extraTurn && !threeSixes && !matchCompleted,
    gameStateVersion: gameState.stateVersion,
  };

  // Update player state
  const updatedPlayers = stateAfterCaptures.players.map((p, i) => {
    if (i === gameState.currentPlayerIndex) {
      return {
        ...p,
        tokens: updatedTokens,
        hasRolled: false,
        consecutiveSixes: threeSixes ? 0 : newConsecutiveSixes,
      };
    }
    return p;
  });

  // Determine next player
  let nextPlayerIndex = gameState.currentPlayerIndex;
  let nextStatus = gameState.status;
  let winner = gameState.winner;
  let rankings = gameState.rankings;

  if (matchCompleted) {
    nextStatus = 'completed';
    winner = currentPlayer.userId;
    rankings = calculateRankings(gameState, currentPlayer.userId);
  } else if (!extraTurn || threeSixes) {
    // Move to next player
    do {
      nextPlayerIndex = getNextPlayerIndex(nextPlayerIndex, gameState.players.length);
    } while (!gameState.players[nextPlayerIndex].isActive && nextPlayerIndex !== gameState.currentPlayerIndex);
  }

  // Update state version
  const newStateVersion = gameState.stateVersion + 1;

  const newGameState: GameState = {
    ...gameState,
    players: updatedPlayers,
    currentPlayerIndex: nextPlayerIndex,
    diceRoll: undefined, // Clear dice roll after move
    legalMoves: [],
    moveHistory: [...gameState.moveHistory, move],
    stateVersion: newStateVersion,
    status: nextStatus,
    winner,
    rankings,
    completedAt: matchCompleted ? new Date().toISOString() : gameState.completedAt,
  };

  // Calculate legal moves for next player (will be populated after they roll)
  if (nextStatus === 'in_progress') {
    newGameState.legalMoves = []; // Will be populated after dice roll
  }

  return { gameState: newGameState, move, capturedTokens };
}

/**
 * Check for captures at the destination position
 */
function checkCaptures(
  gameState: GameState,
  movingPlayerId: string,
  destinationPosition: number
): Array<{ playerId: string; tokenId: number; fromPosition: number }> {
  const captured: Array<{ playerId: string; tokenId: number; fromPosition: number }> = [];

  // Don't capture on safe cells
  if (isSafeCell(destinationPosition, gameState.rules.safeCells)) {
    return captured;
  }

  // Don't capture in home lane or finished
  if (isInHomeLane(destinationPosition) || isFinished(destinationPosition)) {
    return captured;
  }

  // Check other players' tokens at this position
  gameState.players.forEach((player, playerIndex) => {
    if (player.userId === movingPlayerId) return;
    if (!player.isActive) return;

    player.tokens.forEach((token, tokenId) => {
      if (token.position === destinationPosition && !token.isFinished && !isInHome(token.position)) {
        captured.push({
          playerId: player.userId,
          tokenId,
          fromPosition: token.position,
        });
      }
    });
  });

  return captured;
}

/**
 * Apply captures to the game state (return tokens to home)
 */
export function applyCaptures(
  gameState: GameState,
  capturedTokens: Array<{ playerId: string; tokenId: number; fromPosition: number }>
): GameState {
  const updatedPlayers = gameState.players.map(player => {
    const playerCaptures = capturedTokens.filter(c => c.playerId === player.userId);
    if (playerCaptures.length === 0) return player;

    return {
      ...player,
      tokens: player.tokens.map((token, tokenId) => {
        const capture = playerCaptures.find(c => c.tokenId === tokenId);
        if (capture) {
          return {
            ...token,
            position: HOME_POSITION,
            isInHome: true,
            isFinished: false,
          };
        }
        return token;
      }),
    };
  });

  return {
    ...gameState,
    players: updatedPlayers,
  };
}

// ============================================
// TURN MANAGEMENT
// ============================================

/**
 * Calculate next turn after a move
 */
export function calculateNextTurn(gameState: GameState): number {
  let nextIndex = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.players.length);
  
  // Skip inactive players
  let attempts = 0;
  while (!gameState.players[nextIndex].isActive && attempts < gameState.players.length) {
    nextIndex = getNextPlayerIndex(nextIndex, gameState.players.length);
    attempts++;
  }
  
  return nextIndex;
}

/**
 * Check if a player has completed (all tokens finished)
 */
export function checkPlayerCompletion(gameState: GameState, playerId: string): boolean {
  const player = gameState.players.find(p => p.userId === playerId);
  if (!player) return false;
  return player.tokens.every(t => t.isFinished);
}

/**
 * Check if match is completed (winner determined)
 */
export function checkMatchCompletion(gameState: GameState, winnerId: string): boolean {
  // In team mode, check team completion
  if (gameState.rules.teamMode) {
    const winner = gameState.players.find(p => p.userId === winnerId);
    if (!winner || winner.teamId === undefined) return false;
    
    const teamPlayers = gameState.players.filter(p => p.teamId === winner.teamId && p.isActive);
    return teamPlayers.every(p => p.tokens.every(t => t.isFinished));
  }
  
  // Standard mode: single winner
  return checkPlayerCompletion(gameState, winnerId);
}

/**
 * Calculate final rankings for all players
 */
function calculateRankings(gameState: GameState, winnerId: string): string[] {
  const rankings: string[] = [winnerId];
  
  // Get remaining active players sorted by progress
  const otherPlayers = gameState.players
    .filter(p => p.userId !== winnerId && p.isActive)
    .sort((a, b) => {
      // Sort by: finished tokens count (desc), then total progress (desc)
      const aFinished = a.tokens.filter(t => t.isFinished).length;
      const bFinished = b.tokens.filter(t => t.isFinished).length;
      if (aFinished !== bFinished) return bFinished - aFinished;
      
      const aProgress = a.tokens.reduce((sum, t) => sum + getTokenProgress(t), 0);
      const bProgress = b.tokens.reduce((sum, t) => sum + getTokenProgress(t), 0);
      return bProgress - aProgress;
    });
  
  rankings.push(...otherPlayers.map(p => p.userId));
  
  // Add inactive/abandoned players at the end
  const inactivePlayers = gameState.players
    .filter(p => !p.isActive && !rankings.includes(p.userId))
    .map(p => p.userId);
  
  rankings.push(...inactivePlayers);
  
  return rankings;
}

/**
 * Get progress value for a token (for ranking)
 */
function getTokenProgress(token: TokenState): number {
  if (isFinished(token.position)) return 100;
  if (isInHomeLane(token.position)) return 80 + (token.position - 52) * 5; // 80-95
  if (isInHome(token.position)) return 0;
  return Math.min(70, (getRelativePositionForAny(token.position) / BOARD_SIZE) * 70);
}

function getRelativePositionForAny(position: number): number {
  // Approximate - would need color for exact calculation
  return position;
}

// ============================================
// MOVE VALIDATION
// ============================================

/**
 * Validate a move against the current game state
 */
export function validateMove(
  gameState: GameState,
  playerId: string,
  tokenId: number,
  toPosition: number,
  expectedVersion: number
): { valid: boolean; error?: string } {
  // Check version
  if (gameState.stateVersion !== expectedVersion) {
    return { valid: false, error: 'Game state version mismatch' };
  }

  // Check game status
  if (gameState.status !== 'in_progress') {
    return { valid: false, error: 'Game is not in progress' };
  }

  // Check player turn
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (currentPlayer.userId !== playerId) {
    return { valid: false, error: 'Not your turn' };
  }

  // Check player is active
  if (!currentPlayer.isActive) {
    return { valid: false, error: 'Player is not active' };
  }

  // Check dice has been rolled
  if (!gameState.diceRoll) {
    return { valid: false, error: 'Dice not rolled yet' };
  }

  // Check token exists
  if (tokenId < 0 || tokenId >= currentPlayer.tokens.length) {
    return { valid: false, error: 'Invalid token' };
  }

  // Check move is legal
  const legalMoves = getLegalMoves(gameState);
  const move = legalMoves.find(m => m.tokenId === tokenId && m.toPosition === toPosition);
  if (!move) {
    return { valid: false, error: 'Illegal move' };
  }

  return { valid: true };
}

// ============================================
// STATE SERIALIZATION
// ============================================

/**
 * Serialize public game state (for clients)
 * Hides sensitive information like other players' tokens in home
 */
export function serializePublicState(gameState: GameState, viewerId: string): GameState {
  // For now, return full state (can be enhanced to hide info)
  return { ...gameState };
}

/**
 * Restore game state from serialized form
 */
export function restoreGameState(serialized: GameState): GameState {
  return { ...serialized };
}

/**
 * Calculate team result for team mode
 */
export function calculateTeamResult(gameState: GameState): { winningTeam: number; teamRankings: number[] } {
  if (!gameState.rules.teamMode) {
    throw new Error('Not a team game');
  }

  const teams = new Map<number, { players: PlayerState[]; finishedCount: number }>();
  
  gameState.players.forEach(p => {
    if (p.teamId !== undefined) {
      const team = teams.get(p.teamId) ?? { players: [], finishedCount: 0 };
      team.players.push(p);
      if (p.tokens.every(t => t.isFinished)) {
        team.finishedCount++;
      }
      teams.set(p.teamId, team);
    }
  });

  // Find winning team (first with all players finished)
  let winningTeam = -1;
  teams.forEach((team, teamId) => {
    if (team.players.every(p => p.tokens.every(t => t.isFinished))) {
      winningTeam = teamId;
    }
  });

  // Rank teams by finished players count, then total progress
  const teamRankings = Array.from(teams.entries())
    .sort((a, b) => {
      if (a[1].finishedCount !== b[1].finishedCount) {
        return b[1].finishedCount - a[1].finishedCount;
      }
      const aProgress = a[1].players.reduce((sum, p) => 
        sum + p.tokens.reduce((s, t) => s + getTokenProgress(t), 0), 0);
      const bProgress = b[1].players.reduce((sum, p) => 
        sum + p.tokens.reduce((s, t) => s + getTokenProgress(t), 0), 0);
      return bProgress - aProgress;
    })
    .map(([teamId]) => teamId);

  return { winningTeam, teamRankings };
}

// ============================================
// BOT AI INTERFACE
// ============================================

export type BotDecision = {
  action: 'roll' | 'move';
  tokenId?: number;
};

export interface BotAI {
  decide(gameState: GameState, playerIndex: number): BotDecision;
}

// ============================================
// EXPORTS
// ============================================

export const GameEngineUtils = {
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
  // Constants
  BOARD_SIZE,
  HOME_POSITION,
  FINISHED_POSITION,
  TOKENS_PER_PLAYER,
  PLAYER_COLORS,
  START_POSITIONS,
  HOME_LANE_ENTRY,
  DEFAULT_SAFE_CELLS,
  DEFAULT_GAME_RULES,
};
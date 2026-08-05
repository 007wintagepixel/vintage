// ============================================
// @ludo-nexus/game-engine - Constants & Configuration
// ============================================

import type { GameRules, PlayerColor, GameState, PlayerState, TokenState, Move, DiceRoll } from '@ludo-nexus/shared-types';

// ============================================
// BOARD CONSTANTS
// ============================================

export const BOARD_SIZE = 52; // Main track positions 0-51
export const HOME_LANE_LENGTH = 4; // Positions 52-55
export const FINISHED_POSITION = 56;
export const HOME_POSITION = -1;
export const TOKENS_PER_PLAYER = 4;
export const PLAYERS_COUNT = 4;

// Player colors in order around the board
export const PLAYER_COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

// Starting positions for each color on the main track
export const START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Home lane entry positions (where players enter their home lane)
export const HOME_LANE_ENTRY: Record<PlayerColor, number> = {
  red: 51,    // After position 51, enter home lane at 52
  green: 12,  // After position 12, enter home lane at 52
  yellow: 25, // After position 25, enter home lane at 52
  blue: 38,   // After position 38, enter home lane at 52
};

// Safe cells (cannot be captured)
export const DEFAULT_SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];

// Home lane positions for each color (52-55)
// These are relative to the player's home lane entry
export const HOME_LANE_POSITIONS = [52, 53, 54, 55];

// ============================================
// GAME RULES DEFAULTS
// ============================================

export const DEFAULT_GAME_RULES: GameRules = {
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
  safeCells: DEFAULT_SAFE_CELLS,
  teamMode: false,
  botDifficulty: 'medium',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the next player index in turn order
 */
export function getNextPlayerIndex(currentIndex: number, playerCount: number = 4): number {
  return (currentIndex + 1) % playerCount;
}

/**
 * Get the previous player index in turn order
 */
export function getPreviousPlayerIndex(currentIndex: number, playerCount: number = 4): number {
  return (currentIndex - 1 + playerCount) % playerCount;
}

/**
 * Check if a position is a safe cell
 */
export function isSafeCell(position: number, safeCells: number[] = DEFAULT_SAFE_CELLS): boolean {
  return safeCells.indexOf(position) !== -1;
}

/**
 * Check if a position is in home lane
 */
export function isInHomeLane(position: number): boolean {
  return position >= 52 && position <= 55;
}

/**
 * Check if a position is the finished position
 */
export function isFinished(position: number): boolean {
  return position === FINISHED_POSITION;
}

/**
 * Check if a token is in home (not yet on board)
 */
export function isInHome(position: number): boolean {
  return position === HOME_POSITION;
}

/**
 * Get the color for a player index
 */
export function getColorForIndex(index: number): PlayerColor {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

/**
 * Get the index for a color
 */
export function getIndexForColor(color: PlayerColor): number {
  return PLAYER_COLORS.indexOf(color);
}

/**
 * Calculate distance between two positions on the main track (0-51)
 * Returns the number of steps from 'from' to 'to' moving forward
 */
export function getTrackDistance(from: number, to: number): number {
  if (from < 0 || from > 51 || to < 0 || to > 51) {
    return 0;
  }
  if (to >= from) {
    return to - from;
  }
  return (BOARD_SIZE - from) + to;
}

/**
 * Calculate the absolute position on the board for a player's token
 * given its relative position from start
 */
export function getAbsolutePosition(color: PlayerColor, relativePosition: number): number {
  const startPos = START_POSITIONS[color];
  const absolute = (startPos + relativePosition) % BOARD_SIZE;
  return absolute;
}

/**
 * Get the relative position from start for a token at absolute position
 */
export function getRelativePosition(color: PlayerColor, absolutePosition: number): number {
  const startPos = START_POSITIONS[color];
  let relative = absolutePosition - startPos;
  if (relative < 0) {
    relative += BOARD_SIZE;
  }
  return relative;
}

/**
 * Check if a token can enter the board (needs entry roll)
 */
export function canEnterBoard(diceValue: number, entryRoll: number = 6): boolean {
  return diceValue === entryRoll;
}

/**
 * Check if a token has completed the full circle and can enter home lane
 */
export function canEnterHomeLane(color: PlayerColor, relativePosition: number, diceValue: number): boolean {
  const homeLaneEntry = HOME_LANE_ENTRY[color];
  const distanceToEntry = getTrackDistance(relativePosition, homeLaneEntry);
  
  // If exactly at home lane entry, next step enters home lane
  if (distanceToEntry === 0) {
    return diceValue >= 1 && diceValue <= 4;
  }
  
  // If past home lane entry (shouldn't happen in normal play)
  if (distanceToEntry < 0) {
    return false;
  }
  
  // Need to reach home lane entry first, then enter with remaining steps
  return diceValue > distanceToEntry && (diceValue - distanceToEntry) <= 4;
}

/**
 * Get the home lane position after entering
 */
export function getHomeLanePosition(color: PlayerColor, relativePosition: number, diceValue: number): number {
  const homeLaneEntry = HOME_LANE_ENTRY[color];
  const distanceToEntry = getTrackDistance(relativePosition, homeLaneEntry);
  const stepsIntoHomeLane = diceValue - distanceToEntry;
  return 51 + stepsIntoHomeLane; // 52, 53, 54, or 55
}

/**
 * Check if a move would land on a safe cell
 */
export function wouldLandOnSafeCell(color: PlayerColor, currentRelativePos: number, diceValue: number, safeCells: number[] = DEFAULT_SAFE_CELLS): boolean {
  if (isInHome(currentRelativePos)) {
    // Entering board at start position
    return isSafeCell(START_POSITIONS[color], safeCells);
  }
  
  if (isInHomeLane(currentRelativePos)) {
    // Moving within home lane - no safe cells in home lane
    return false;
  }
  
  // Moving on main track
  const newRelativePos = currentRelativePos + diceValue;
  const absolutePos = getAbsolutePosition(color, newRelativePos);
  return isSafeCell(absolutePos, safeCells);
}

/**
 * Get legal moves for a player
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
"use strict";
// ============================================
// @ludo-nexus/game-engine - Constants & Configuration
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GAME_RULES = exports.HOME_LANE_POSITIONS = exports.DEFAULT_SAFE_CELLS = exports.HOME_LANE_ENTRY = exports.START_POSITIONS = exports.PLAYER_COLORS = exports.PLAYERS_COUNT = exports.TOKENS_PER_PLAYER = exports.HOME_POSITION = exports.FINISHED_POSITION = exports.HOME_LANE_LENGTH = exports.BOARD_SIZE = void 0;
exports.getNextPlayerIndex = getNextPlayerIndex;
exports.getPreviousPlayerIndex = getPreviousPlayerIndex;
exports.isSafeCell = isSafeCell;
exports.isInHomeLane = isInHomeLane;
exports.isFinished = isFinished;
exports.isInHome = isInHome;
exports.getColorForIndex = getColorForIndex;
exports.getIndexForColor = getIndexForColor;
exports.getTrackDistance = getTrackDistance;
exports.getAbsolutePosition = getAbsolutePosition;
exports.getRelativePosition = getRelativePosition;
exports.canEnterBoard = canEnterBoard;
exports.canEnterHomeLane = canEnterHomeLane;
exports.getHomeLanePosition = getHomeLanePosition;
exports.wouldLandOnSafeCell = wouldLandOnSafeCell;
// ============================================
// BOARD CONSTANTS
// ============================================
exports.BOARD_SIZE = 52; // Main track positions 0-51
exports.HOME_LANE_LENGTH = 4; // Positions 52-55
exports.FINISHED_POSITION = 56;
exports.HOME_POSITION = -1;
exports.TOKENS_PER_PLAYER = 4;
exports.PLAYERS_COUNT = 4;
// Player colors in order around the board
exports.PLAYER_COLORS = ['red', 'green', 'yellow', 'blue'];
// Starting positions for each color on the main track
exports.START_POSITIONS = {
    red: 0,
    green: 13,
    yellow: 26,
    blue: 39,
};
// Home lane entry positions (where players enter their home lane)
exports.HOME_LANE_ENTRY = {
    red: 51, // After position 51, enter home lane at 52
    green: 12, // After position 12, enter home lane at 52
    yellow: 25, // After position 25, enter home lane at 52
    blue: 38, // After position 38, enter home lane at 52
};
// Safe cells (cannot be captured)
exports.DEFAULT_SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];
// Home lane positions for each color (52-55)
// These are relative to the player's home lane entry
exports.HOME_LANE_POSITIONS = [52, 53, 54, 55];
// ============================================
// GAME RULES DEFAULTS
// ============================================
exports.DEFAULT_GAME_RULES = {
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
    safeCells: exports.DEFAULT_SAFE_CELLS,
    teamMode: false,
    botDifficulty: 'medium',
};
// ============================================
// HELPER FUNCTIONS
// ============================================
/**
 * Get the next player index in turn order
 */
function getNextPlayerIndex(currentIndex, playerCount = 4) {
    return (currentIndex + 1) % playerCount;
}
/**
 * Get the previous player index in turn order
 */
function getPreviousPlayerIndex(currentIndex, playerCount = 4) {
    return (currentIndex - 1 + playerCount) % playerCount;
}
/**
 * Check if a position is a safe cell
 */
function isSafeCell(position, safeCells = exports.DEFAULT_SAFE_CELLS) {
    return safeCells.includes(position);
}
/**
 * Check if a position is in home lane
 */
function isInHomeLane(position) {
    return position >= 52 && position <= 55;
}
/**
 * Check if a position is the finished position
 */
function isFinished(position) {
    return position === exports.FINISHED_POSITION;
}
/**
 * Check if a token is in home (not yet on board)
 */
function isInHome(position) {
    return position === exports.HOME_POSITION;
}
/**
 * Get the color for a player index
 */
function getColorForIndex(index) {
    return exports.PLAYER_COLORS[index % exports.PLAYER_COLORS.length];
}
/**
 * Get the index for a color
 */
function getIndexForColor(color) {
    return exports.PLAYER_COLORS.indexOf(color);
}
/**
 * Calculate distance between two positions on the main track (0-51)
 * Returns the number of steps from 'from' to 'to' moving forward
 */
function getTrackDistance(from, to) {
    if (from < 0 || from > 51 || to < 0 || to > 51) {
        return 0;
    }
    if (to >= from) {
        return to - from;
    }
    return (exports.BOARD_SIZE - from) + to;
}
/**
 * Calculate the absolute position on the board for a player's token
 * given its relative position from start
 */
function getAbsolutePosition(color, relativePosition) {
    const startPos = exports.START_POSITIONS[color];
    const absolute = (startPos + relativePosition) % exports.BOARD_SIZE;
    return absolute;
}
/**
 * Get the relative position from start for a token at absolute position
 */
function getRelativePosition(color, absolutePosition) {
    const startPos = exports.START_POSITIONS[color];
    let relative = absolutePosition - startPos;
    if (relative < 0) {
        relative += exports.BOARD_SIZE;
    }
    return relative;
}
/**
 * Check if a token can enter the board (needs entry roll)
 */
function canEnterBoard(diceValue, entryRoll = 6) {
    return diceValue === entryRoll;
}
/**
 * Check if a token has completed the full circle and can enter home lane
 */
function canEnterHomeLane(color, relativePosition, diceValue) {
    const homeLaneEntry = exports.HOME_LANE_ENTRY[color];
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
function getHomeLanePosition(color, relativePosition, diceValue) {
    const homeLaneEntry = exports.HOME_LANE_ENTRY[color];
    const distanceToEntry = getTrackDistance(relativePosition, homeLaneEntry);
    const stepsIntoHomeLane = diceValue - distanceToEntry;
    return 51 + stepsIntoHomeLane; // 52, 53, 54, or 55
}
/**
 * Check if a move would land on a safe cell
 */
function wouldLandOnSafeCell(color, currentRelativePos, diceValue, safeCells = exports.DEFAULT_SAFE_CELLS) {
    if (isInHome(currentRelativePos)) {
        // Entering board at start position
        return isSafeCell(exports.START_POSITIONS[color], safeCells);
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

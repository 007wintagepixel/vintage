import type { GameRules, PlayerColor, GameState } from '@ludo-nexus/shared-types';
export declare const BOARD_SIZE = 52;
export declare const HOME_LANE_LENGTH = 4;
export declare const FINISHED_POSITION = 56;
export declare const HOME_POSITION = -1;
export declare const TOKENS_PER_PLAYER = 4;
export declare const PLAYERS_COUNT = 4;
export declare const PLAYER_COLORS: PlayerColor[];
export declare const START_POSITIONS: Record<PlayerColor, number>;
export declare const HOME_LANE_ENTRY: Record<PlayerColor, number>;
export declare const DEFAULT_SAFE_CELLS: number[];
export declare const HOME_LANE_POSITIONS: number[];
export declare const DEFAULT_GAME_RULES: GameRules;
/**
 * Get the next player index in turn order
 */
export declare function getNextPlayerIndex(currentIndex: number, playerCount?: number): number;
/**
 * Get the previous player index in turn order
 */
export declare function getPreviousPlayerIndex(currentIndex: number, playerCount?: number): number;
/**
 * Check if a position is a safe cell
 */
export declare function isSafeCell(position: number, safeCells?: number[]): boolean;
/**
 * Check if a position is in home lane
 */
export declare function isInHomeLane(position: number): boolean;
/**
 * Check if a position is the finished position
 */
export declare function isFinished(position: number): boolean;
/**
 * Check if a token is in home (not yet on board)
 */
export declare function isInHome(position: number): boolean;
/**
 * Get the color for a player index
 */
export declare function getColorForIndex(index: number): PlayerColor;
/**
 * Get the index for a color
 */
export declare function getIndexForColor(color: PlayerColor): number;
/**
 * Calculate distance between two positions on the main track (0-51)
 * Returns the number of steps from 'from' to 'to' moving forward
 */
export declare function getTrackDistance(from: number, to: number): number;
/**
 * Calculate the absolute position on the board for a player's token
 * given its relative position from start
 */
export declare function getAbsolutePosition(color: PlayerColor, relativePosition: number): number;
/**
 * Get the relative position from start for a token at absolute position
 */
export declare function getRelativePosition(color: PlayerColor, absolutePosition: number): number;
/**
 * Check if a token can enter the board (needs entry roll)
 */
export declare function canEnterBoard(diceValue: number, entryRoll?: number): boolean;
/**
 * Check if a token has completed the full circle and can enter home lane
 */
export declare function canEnterHomeLane(color: PlayerColor, relativePosition: number, diceValue: number): boolean;
/**
 * Get the home lane position after entering
 */
export declare function getHomeLanePosition(color: PlayerColor, relativePosition: number, diceValue: number): number;
/**
 * Check if a move would land on a safe cell
 */
export declare function wouldLandOnSafeCell(color: PlayerColor, currentRelativePos: number, diceValue: number, safeCells?: number[]): boolean;
/**
 * Get legal moves for a player
 */
export declare function getLegalMoves(gameState: GameState): Array<{
    tokenId: number;
    fromPosition: number;
    toPosition: number;
}>;
//# sourceMappingURL=constants.d.ts.map
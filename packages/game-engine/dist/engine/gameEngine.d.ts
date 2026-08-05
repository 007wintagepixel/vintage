import type { GameRules, GameState, Move, DiceRoll, PlayerColor, GameMode } from '@ludo-nexus/shared-types';
/**
 * Generate a cryptographically secure dice roll (1-6)
 * This MUST be called on the server only
 */
export declare function rollDice(): number;
/**
 * Create a dice roll object with audit trail
 */
export declare function createDiceRoll(rolledBy: string): DiceRoll;
/**
 * Create initial game state for a new match
 */
export declare function createInitialGameState(matchId: string, players: Array<{
    userId: string;
    color: PlayerColor;
    isBot?: boolean;
    botDifficulty?: 'easy' | 'medium' | 'hard';
    teamId?: number;
}>, rules?: Partial<GameRules>, mode?: GameMode, roomId?: string, tournamentId?: string): GameState;
/**
 * Get all legal moves for the current player given the dice value
 */
export declare function getLegalMoves(gameState: GameState): Array<{
    tokenId: number;
    fromPosition: number;
    toPosition: number;
}>;
/**
 * Execute a move and return the updated game state
 */
export declare function moveToken(gameState: GameState, tokenId: number, toPosition: number): {
    gameState: GameState;
    move: Move;
    capturedTokens: Array<{
        playerId: string;
        tokenId: number;
        fromPosition: number;
    }>;
};
/**
 * Apply captures to the game state (return tokens to home)
 */
export declare function applyCaptures(gameState: GameState, capturedTokens: Array<{
    playerId: string;
    tokenId: number;
    fromPosition: number;
}>): GameState;
/**
 * Calculate next turn after a move
 */
export declare function calculateNextTurn(gameState: GameState): number;
/**
 * Check if a player has completed (all tokens finished)
 */
export declare function checkPlayerCompletion(gameState: GameState, playerId: string): boolean;
/**
 * Check if match is completed (winner determined)
 */
export declare function checkMatchCompletion(gameState: GameState, winnerId: string): boolean;
/**
 * Validate a move against the current game state
 */
export declare function validateMove(gameState: GameState, playerId: string, tokenId: number, toPosition: number, expectedVersion: number): {
    valid: boolean;
    error?: string;
};
/**
 * Serialize public game state (for clients)
 * Hides sensitive information like other players' tokens in home
 */
export declare function serializePublicState(gameState: GameState, viewerId: string): GameState;
/**
 * Restore game state from serialized form
 */
export declare function restoreGameState(serialized: GameState): GameState;
/**
 * Calculate team result for team mode
 */
export declare function calculateTeamResult(gameState: GameState): {
    winningTeam: number;
    teamRankings: number[];
};
export type BotDecision = {
    action: 'roll' | 'move';
    tokenId?: number;
};
export interface BotAI {
    decide(gameState: GameState, playerIndex: number): BotDecision;
}
export declare const GameEngine: {
    createInitialGameState: typeof createInitialGameState;
    getLegalMoves: typeof getLegalMoves;
    moveToken: typeof moveToken;
    applyCaptures: typeof applyCaptures;
    calculateNextTurn: typeof calculateNextTurn;
    checkPlayerCompletion: typeof checkPlayerCompletion;
    checkMatchCompletion: typeof checkMatchCompletion;
    validateMove: typeof validateMove;
    serializePublicState: typeof serializePublicState;
    restoreGameState: typeof restoreGameState;
    calculateTeamResult: typeof calculateTeamResult;
    rollDice: typeof rollDice;
    createDiceRoll: typeof createDiceRoll;
    BOARD_SIZE: any;
    HOME_POSITION: any;
    FINISHED_POSITION: any;
    TOKENS_PER_PLAYER: any;
    PLAYER_COLORS: any;
    START_POSITIONS: any;
    HOME_LANE_ENTRY: any;
    DEFAULT_SAFE_CELLS: any;
    DEFAULT_GAME_RULES: any;
};
//# sourceMappingURL=gameEngine.d.ts.map
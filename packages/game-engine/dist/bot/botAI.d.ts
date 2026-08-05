import type { GameState } from '@ludo-nexus/shared-types';
import type { BotDecision } from './gameEngine';
export declare class EasyBot {
    decide(gameState: GameState, playerIndex: number): BotDecision;
}
export declare class MediumBot {
    decide(gameState: GameState, playerIndex: number): BotDecision;
    private countCapturesAtPosition;
    private calculateDanger;
    private getDistanceToTarget;
    private getRelativePositionForColor;
}
export declare class HardBot {
    private weights;
    decide(gameState: GameState, playerIndex: number): BotDecision;
    private evaluateMove;
    private analyzeCaptures;
    private assessDanger;
    private calculateBlockingValue;
    private evaluateProgression;
    private calculateExtraTurnChance;
    private getDistanceToTarget;
    private getRelativePositionForColor;
}
export type BotDifficulty = 'easy' | 'medium' | 'hard';
export declare function createBot(difficulty: BotDifficulty): EasyBot | MediumBot | HardBot;
export declare const BotAI: {
    EasyBot: typeof EasyBot;
    MediumBot: typeof MediumBot;
    HardBot: typeof HardBot;
    createBot: typeof createBot;
};
//# sourceMappingURL=botAI.d.ts.map
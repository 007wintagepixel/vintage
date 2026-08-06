"use strict";
// ============================================
// @ludo-nexus/game-engine - Bot AI Implementations
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotAI = exports.HardBot = exports.MediumBot = exports.EasyBot = void 0;
exports.createBot = createBot;
const constants_1 = require("../constants");
// ============================================
// EASY BOT - Mostly random legal moves
// ============================================
class EasyBot {
    decide(gameState, playerIndex) {
        const player = gameState.players[playerIndex];
        const legalMoves = (0, constants_1.getLegalMoves)(gameState);
        // If no legal moves, must roll (or skip if already rolled)
        if (legalMoves.length === 0) {
            return { action: player.hasRolled ? 'roll' : 'roll' };
        }
        // If hasn't rolled yet, roll
        if (!player.hasRolled && !gameState.diceRoll) {
            return { action: 'roll' };
        }
        // Pick a random legal move
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        return { action: 'move', tokenId: randomMove.tokenId };
    }
}
exports.EasyBot = EasyBot;
// ============================================
// MEDIUM BOT - Prioritizes captures, avoids danger, balanced
// ============================================
class MediumBot {
    decide(gameState, playerIndex) {
        const player = gameState.players[playerIndex];
        const legalMoves = (0, constants_1.getLegalMoves)(gameState);
        if (legalMoves.length === 0) {
            return { action: 'roll' };
        }
        if (!player.hasRolled && !gameState.diceRoll) {
            return { action: 'roll' };
        }
        // Score each legal move
        const scoredMoves = legalMoves.map((move) => {
            const token = player.tokens[move.tokenId];
            let score = 0;
            // High priority: Move token out of home
            if ((0, constants_1.isInHome)(token.position)) {
                score += 100;
            }
            // High priority: Enter home lane / finish
            if ((0, constants_1.isInHomeLane)(move.toPosition)) {
                score += 80;
            }
            if ((0, constants_1.isFinished)(move.toPosition)) {
                score += 150;
            }
            // Priority: Capture opponent
            const captures = this.countCapturesAtPosition(gameState, player.userId, move.toPosition);
            if (captures > 0) {
                score += 90 * captures;
            }
            // Priority: Land on safe cell
            if ((0, constants_1.isSafeCell)(move.toPosition, gameState.rules.safeCells)) {
                score += 30;
            }
            // Avoid: Move to position where we can be captured next turn
            const dangerScore = this.calculateDanger(gameState, player, move.toPosition);
            score -= dangerScore * 20;
            // Priority: Advance tokens that are farthest behind
            const relativePos = (0, constants_1.isInHome)(token.position) ? -1 : (0, constants_1.getRelativePosition)(player.color, token.position);
            if (relativePos >= 0 && relativePos < 20) {
                score += 10; // Help lagging tokens
            }
            // Small random factor to avoid predictability
            score += Math.random() * 5;
            return { ...move, score };
        });
        // Pick highest scored move
        scoredMoves.sort((a, b) => b.score - a.score);
        return { action: 'move', tokenId: scoredMoves[0].tokenId };
    }
    countCapturesAtPosition(gameState, movingPlayerId, position) {
        if ((0, constants_1.isSafeCell)(position, gameState.rules.safeCells))
            return 0;
        if ((0, constants_1.isInHomeLane)(position) || (0, constants_1.isFinished)(position))
            return 0;
        let count = 0;
        gameState.players.forEach((p) => {
            if (p.userId === movingPlayerId || !p.isActive)
                return;
            p.tokens.forEach((t) => {
                if (t.position === position && !t.isFinished && !(0, constants_1.isInHome)(t.position)) {
                    count++;
                }
            });
        });
        return count;
    }
    calculateDanger(gameState, player, position) {
        if ((0, constants_1.isSafeCell)(position, gameState.rules.safeCells))
            return 0;
        if ((0, constants_1.isInHomeLane)(position) || (0, constants_1.isFinished)(position))
            return 0;
        let danger = 0;
        gameState.players.forEach((p) => {
            if (p.userId === player.userId || !p.isActive)
                return;
            // Check if opponent can capture this position on their next turn
            p.tokens.forEach((token) => {
                if ((0, constants_1.isInHome)(token.position) || (0, constants_1.isFinished)(token.position))
                    return;
                const relativePos = (0, constants_1.getRelativePosition)(p.color, token.position);
                const distance = this.getDistanceToTarget(p.color, relativePos, position);
                // Opponent can capture if they can roll the exact distance (1-6)
                if (distance >= 1 && distance <= 6) {
                    danger += 1;
                }
            });
        });
        return danger;
    }
    getDistanceToTarget(color, fromRelative, targetAbsolute) {
        const targetRelative = this.getRelativePositionForColor(color, targetAbsolute);
        if (targetRelative < fromRelative)
            return 100; // Behind
        return targetRelative - fromRelative;
    }
    getRelativePositionForColor(color, absolute) {
        const start = constants_1.START_POSITIONS[color];
        let rel = absolute - start;
        if (rel < 0)
            rel += 52;
        return rel;
    }
}
exports.MediumBot = MediumBot;
// ============================================
// HARD BOT - Weighted evaluation, risk calculation, blocking
// ============================================
class HardBot {
    weights = {
        exitHome: 200,
        enterHomeLane: 150,
        finishToken: 300,
        capture: 250,
        safeCell: 50,
        avoidDanger: 80,
        blockOpponent: 100,
        advanceLeading: 30,
        helpLagging: 40,
        extraTurnValue: 120,
    };
    decide(gameState, playerIndex) {
        const player = gameState.players[playerIndex];
        const legalMoves = (0, constants_1.getLegalMoves)(gameState);
        if (legalMoves.length === 0) {
            return { action: 'roll' };
        }
        if (!player.hasRolled && !gameState.diceRoll) {
            return { action: 'roll' };
        }
        // Evaluate each move with full game state analysis
        const evaluatedMoves = legalMoves.map((move) => {
            const token = player.tokens[move.tokenId];
            const evaluation = this.evaluateMove(gameState, player, token, move);
            return { ...move, evaluation };
        });
        // Pick best move
        evaluatedMoves.sort((a, b) => b.evaluation - a.evaluation);
        return { action: 'move', tokenId: evaluatedMoves[0].tokenId };
    }
    evaluateMove(gameState, player, token, move) {
        let score = 0;
        const { toPosition } = move;
        // 1. Exit home - critical priority
        if ((0, constants_1.isInHome)(token.position)) {
            score += this.weights.exitHome;
        }
        // 2. Enter home lane / finish
        if ((0, constants_1.isInHomeLane)(toPosition)) {
            score += this.weights.enterHomeLane;
            // Closer to finish = better
            score += (toPosition - 52) * 20;
        }
        if ((0, constants_1.isFinished)(toPosition)) {
            score += this.weights.finishToken;
        }
        // 3. Capture evaluation
        const captures = this.analyzeCaptures(gameState, player.userId, toPosition);
        score += captures.immediate * this.weights.capture;
        score += captures.strategic * (this.weights.capture * 0.5);
        // 4. Safe cell bonus
        if ((0, constants_1.isSafeCell)(toPosition, gameState.rules.safeCells)) {
            score += this.weights.safeCell;
        }
        // 5. Danger assessment
        const danger = this.assessDanger(gameState, player, toPosition);
        score -= danger * this.weights.avoidDanger;
        // 6. Blocking opponents (positioning to threaten)
        const blockValue = this.calculateBlockingValue(gameState, player, toPosition);
        score += blockValue * this.weights.blockOpponent;
        // 7. Token progression strategy
        const progression = this.evaluateProgression(gameState, player, token, toPosition);
        score += progression;
        // 8. Extra turn potential
        const diceValue = gameState.diceRoll?.value ?? 0;
        const extraTurnChance = this.calculateExtraTurnChance(gameState, player, toPosition, diceValue);
        score += extraTurnChance * this.weights.extraTurnValue;
        return score;
    }
    analyzeCaptures(gameState, movingPlayerId, position) {
        if ((0, constants_1.isSafeCell)(position, gameState.rules.safeCells))
            return { immediate: 0, strategic: 0 };
        if ((0, constants_1.isInHomeLane)(position) || (0, constants_1.isFinished)(position))
            return { immediate: 0, strategic: 0 };
        let immediate = 0;
        let strategic = 0;
        gameState.players.forEach((p) => {
            if (p.userId === movingPlayerId || !p.isActive)
                return;
            p.tokens.forEach((token) => {
                if (token.position === position && !token.isFinished && !(0, constants_1.isInHome)(token.position)) {
                    immediate++;
                    // Strategic: Capturing a token that's far advanced hurts opponent more
                    const relativePos = (0, constants_1.getRelativePosition)(p.color, token.position);
                    if (relativePos > 30)
                        strategic += 2;
                    else if (relativePos > 15)
                        strategic += 1;
                }
            });
        });
        return { immediate, strategic };
    }
    assessDanger(gameState, player, position) {
        if ((0, constants_1.isSafeCell)(position, gameState.rules.safeCells))
            return 0;
        if ((0, constants_1.isInHomeLane)(position) || (0, constants_1.isFinished)(position))
            return 0;
        let danger = 0;
        gameState.players.forEach((p) => {
            if (p.userId === player.userId || !p.isActive)
                return;
            p.tokens.forEach((token) => {
                if ((0, constants_1.isInHome)(token.position) || (0, constants_1.isFinished)(token.position))
                    return;
                const relativePos = (0, constants_1.getRelativePosition)(p.color, token.position);
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
    calculateBlockingValue(gameState, player, position) {
        // Position ourselves to threaten opponent tokens on their next turn
        let blockValue = 0;
        gameState.players.forEach((p) => {
            if (p.userId === player.userId || !p.isActive)
                return;
            p.tokens.forEach((token) => {
                if ((0, constants_1.isInHome)(token.position) || (0, constants_1.isFinished)(token.position))
                    return;
                const tokenRelative = (0, constants_1.getRelativePosition)(p.color, token.position);
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
    evaluateProgression(gameState, player, token, toPosition) {
        const finishedCount = player.tokens.filter((t) => t.isFinished).length;
        const homeLaneCount = player.tokens.filter((t) => (0, constants_1.isInHomeLane)(t.position)).length;
        const onBoardCount = player.tokens.filter((t) => !(0, constants_1.isInHome)(t.position) && !(0, constants_1.isFinished)(t.position) && !(0, constants_1.isInHomeLane)(t.position)).length;
        let score = 0;
        // Early game: Get tokens out of home
        if (finishedCount === 0 && homeLaneCount === 0 && onBoardCount < 2) {
            if ((0, constants_1.isInHome)(token.position))
                score += 50;
        }
        // Mid game: Balance advancing and safety
        if (finishedCount < 2) {
            const relativePos = (0, constants_1.isInHome)(token.position) ? -1 : (0, constants_1.getRelativePosition)(player.color, token.position);
            if (relativePos >= 0 && relativePos < 20) {
                score += this.weights.helpLagging;
            }
        }
        // Late game: Race to finish
        if (finishedCount >= 2) {
            if ((0, constants_1.isInHomeLane)(toPosition) || (0, constants_1.isFinished)(toPosition)) {
                score += this.weights.advanceLeading * 2;
            }
        }
        return score;
    }
    calculateExtraTurnChance(gameState, player, toPosition, currentDice) {
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
        if ((0, constants_1.isFinished)(toPosition) && gameState.rules.extraTurnOnHome) {
            chance += 1;
        }
        return chance;
    }
    getDistanceToTarget(color, fromRelative, targetAbsolute) {
        const targetRelative = this.getRelativePositionForColor(color, targetAbsolute);
        if (targetRelative < fromRelative)
            return 100;
        return targetRelative - fromRelative;
    }
    getRelativePositionForColor(color, absolute) {
        const start = constants_1.START_POSITIONS[color];
        let rel = absolute - start;
        if (rel < 0)
            rel += 52;
        return rel;
    }
}
exports.HardBot = HardBot;
function createBot(difficulty) {
    switch (difficulty) {
        case 'easy':
            return new EasyBot();
        case 'medium':
            return new MediumBot();
        case 'hard':
            return new HardBot();
        default:
            return new MediumBot();
    }
}
// ============================================
// EXPORTS
// ============================================
exports.BotAI = {
    EasyBot,
    MediumBot,
    HardBot,
    createBot,
};

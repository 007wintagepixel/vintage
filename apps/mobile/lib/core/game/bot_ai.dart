// ============================================
// Ludo Nexus - Bot AI Implementations (Dart Port)
// ============================================

import 'dart:math';

import 'game_engine.dart';
import '../models/game_models.dart';

/// Bot Decision result
class BotDecision {
  final BotAction action;
  final int? tokenId;

  BotDecision({required this.action, this.tokenId});

  factory BotDecision.roll() => BotDecision(action: BotAction.roll);
  factory BotDecision.move(int tokenId) => BotDecision(action: BotAction.move, tokenId: tokenId);
}

enum BotAction { roll, move }

/// Bot Difficulty levels
enum BotDifficulty { easy, medium, hard }

/// Factory to create bot by difficulty
Bot createBot(BotDifficulty difficulty) {
  switch (difficulty) {
    case BotDifficulty.easy:
      return EasyBot();
    case BotDifficulty.medium:
      return MediumBot();
    case BotDifficulty.hard:
      return HardBot();
  }
}

/// Abstract Bot interface
abstract class Bot {
  BotDecision decide(GameState gameState, int playerIndex);
}

/// ============================================
// EASY BOT - Mostly random legal moves
// ============================================

class EasyBot implements Bot {
  @override
  BotDecision decide(GameState gameState, int playerIndex) {
    final player = gameState.players[playerIndex];
    final legalMoves = getLegalMoves(gameState);

    // If no legal moves, must roll
    if (legalMoves.isEmpty) {
      return BotDecision.roll();
    }

    // If hasn't rolled yet, roll
    if (!player.hasRolled && gameState.diceRoll == null) {
      return BotDecision.roll();
    }

    // Pick a random legal move
    final random = Random.secure();
    final randomMove = legalMoves[random.nextInt(legalMoves.length)];
    return BotDecision.move(randomMove.tokenId);
  }
}

/// ============================================
// MEDIUM BOT - Prioritizes captures, avoids danger, balanced
// ============================================

class MediumBot implements Bot {
  @override
  BotDecision decide(GameState gameState, int playerIndex) {
    final player = gameState.players[playerIndex];
    final legalMoves = getLegalMoves(gameState);

    if (legalMoves.isEmpty) {
      return BotDecision.roll();
    }

    if (!player.hasRolled && gameState.diceRoll == null) {
      return BotDecision.roll();
    }

    // Score each legal move
    final scoredMoves = legalMoves.map((move) {
      final token = player.tokens[move.tokenId];
      var score = 0;

      // High priority: Move token out of home
      if (isInHome(token.position)) {
        score += 100;
      }

      // High priority: Enter home lane / finish
      if (isInHomeLane(move.toPosition)) {
        score += 80;
      }
      if (isFinished(move.toPosition)) {
        score += 150;
      }

      // Priority: Capture opponent
      final captures = _countCapturesAtPosition(gameState, player.userId, move.toPosition);
      if (captures > 0) {
        score += 90 * captures;
      }

      // Priority: Land on safe cell
      if (isSafeCell(move.toPosition, gameState.rules.safeCells)) {
        score += 30;
      }

      // Avoid: Move to position where we can be captured next turn
      final dangerScore = _calculateDanger(gameState, player, move.toPosition);
      score -= dangerScore * 20;

      // Priority: Advance tokens that are farthest behind
      final relativePos = isInHome(token.position) ? -1 : getRelativePosition(player.color, token.position);
      if (relativePos >= 0 && relativePos < 20) {
        score += 10; // Help lagging tokens
      }

      // Small random factor to avoid predictability
      final random = Random.secure();
      score += random.nextInt(6); // 0-5

      return _ScoredMove(move: move, score: score);
    }).toList();

    // Pick highest scored move
    scoredMoves.sort((a, b) => b.score.compareTo(a.score));
    return BotDecision.move(scoredMoves.first.move.tokenId);
  }

  int _countCapturesAtPosition(GameState gameState, String movingPlayerId, int position) {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    var count = 0;
    for (final p in gameState.players) {
      if (p.userId == movingPlayerId || !p.isActive) continue;
      for (final t in p.tokens) {
        if (t.position == position && !t.isFinished && !isInHome(t.position)) {
          count++;
        }
      }
    }
    return count;
  }

  int _calculateDanger(GameState gameState, PlayerState player, int position) {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    var danger = 0;
    for (final p in gameState.players) {
      if (p.userId == player.userId || !p.isActive) continue;

      for (final token in p.tokens) {
        if (isInHome(token.position) || isFinished(token.position)) continue;

        final relativePos = getRelativePosition(p.color, token.position);
        final distance = _getDistanceToTarget(p.color, relativePos, position);

        // Opponent can capture if they can roll the exact distance (1-6)
        if (distance >= 1 && distance <= 6) {
          danger += 1;
        }
      }
    }
    return danger;
  }

  int _getDistanceToTarget(PlayerColor color, int fromRelative, int targetAbsolute) {
    final targetRelative = _getRelativePositionForColor(color, targetAbsolute);
    if (targetRelative < fromRelative) return 100; // Behind
    return targetRelative - fromRelative;
  }

  int _getRelativePositionForColor(PlayerColor color, int absolute) {
    final start = START_POSITIONS[color]!;
    var rel = absolute - start;
    if (rel < 0) rel += BOARD_SIZE;
    return rel;
  }
}

/// Helper class for scored moves
class _ScoredMove {
  final LegalMove move;
  final int score;

  _ScoredMove({required this.move, required this.score});
}

/// ============================================
// HARD BOT - Weighted evaluation, risk calculation, blocking
// ============================================

class HardBot implements Bot {
  // Weights for move evaluation
  final _weights = _HardBotWeights();

  @override
  BotDecision decide(GameState gameState, int playerIndex) {
    final player = gameState.players[playerIndex];
    final legalMoves = getLegalMoves(gameState);

    if (legalMoves.isEmpty) {
      return BotDecision.roll();
    }

    if (!player.hasRolled && gameState.diceRoll == null) {
      return BotDecision.roll();
    }

    // Evaluate each move with full game state analysis
    final evaluatedMoves = legalMoves.map((move) {
      final token = player.tokens[move.tokenId];
      final evaluation = _evaluateMove(gameState, player, token, move);
      return _EvaluatedMove(move: move, evaluation: evaluation);
    }).toList();

    // Pick best move
    evaluatedMoves.sort((a, b) => b.evaluation.compareTo(a.evaluation));
    return BotDecision.move(evaluatedMoves.first.move.tokenId);
  }

  int _evaluateMove(
    GameState gameState,
    PlayerState player,
    TokenState token,
    LegalMove move,
  ) {
    var score = 0;
    final toPosition = move.toPosition;

    // 1. Exit home - critical priority
    if (isInHome(token.position)) {
      score += _weights.exitHome;
    }

    // 2. Enter home lane / finish
    if (isInHomeLane(toPosition)) {
      score += _weights.enterHomeLane;
      // Closer to finish = better
      score += (toPosition - 52) * 20;
    }
    if (isFinished(toPosition)) {
      score += _weights.finishToken;
    }

    // 3. Capture evaluation
    final captures = _analyzeCaptures(gameState, player.userId, toPosition);
    score += captures.immediate * _weights.capture;
    score += (captures.strategic * _weights.capture * 0.5).round();

    // 4. Safe cell bonus
    if (isSafeCell(toPosition, gameState.rules.safeCells)) {
      score += _weights.safeCell;
    }

    // 5. Danger assessment
    final danger = _assessDanger(gameState, player, toPosition);
    score -= (danger * _weights.avoidDanger).round();

    // 6. Blocking opponents (positioning to threaten)
    final blockValue = _calculateBlockingValue(gameState, player, toPosition);
    score += (blockValue * _weights.blockOpponent).round();

    // 7. Token progression strategy
    final progression = _evaluateProgression(gameState, player, token, toPosition);
    score += progression;

    // 8. Extra turn potential
    final diceValue = gameState.diceRoll?.value ?? 0;
    final extraTurnChance = _calculateExtraTurnChance(gameState, player, toPosition, diceValue);
    score += (extraTurnChance * _weights.extraTurnValue).round();

    return score;
  }

  _CaptureAnalysis _analyzeCaptures(
    GameState gameState,
    String movingPlayerId,
    int position,
  ) {
    if (isSafeCell(position, gameState.rules.safeCells)) {
      return _CaptureAnalysis(immediate: 0, strategic: 0);
    }
    if (isInHomeLane(position) || isFinished(position)) {
      return _CaptureAnalysis(immediate: 0, strategic: 0);
    }

    var immediate = 0;
    var strategic = 0;

    for (final p in gameState.players) {
      if (p.userId == movingPlayerId || !p.isActive) continue;

      for (final token in p.tokens) {
        if (token.position == position && !token.isFinished && !isInHome(token.position)) {
          immediate++;

          // Strategic: Capturing a token that's far advanced hurts opponent more
          final relativePos = getRelativePosition(p.color, token.position);
          if (relativePos > 30) strategic += 2;
          else if (relativePos > 15) strategic += 1;
        }
      }
    }

    return _CaptureAnalysis(immediate: immediate, strategic: strategic);
  }

  double _assessDanger(
    GameState gameState,
    PlayerState player,
    int position,
  ) {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    var danger = 0.0;

    for (final p in gameState.players) {
      if (p.userId == player.userId || !p.isActive) continue;

      for (final token in p.tokens) {
        if (isInHome(token.position) || isFinished(token.position)) continue;

        final relativePos = getRelativePosition(p.color, token.position);
        final distance = _getDistanceToTarget(p.color, relativePos, position);

        // Probability-weighted danger
        if (distance >= 1 && distance <= 6) {
          // Closer tokens = higher danger
          danger += (7 - distance) / 6;
        }
      }
    }

    return danger;
  }

  double _calculateBlockingValue(
    GameState gameState,
    PlayerState player,
    int position,
  ) {
    // Position ourselves to threaten opponent tokens on their next turn
    var blockValue = 0.0;

    for (final p in gameState.players) {
      if (p.userId == player.userId || !p.isActive) continue;

      for (final token in p.tokens) {
        if (isInHome(token.position) || isFinished(token.position)) continue;

        final tokenRelative = getRelativePosition(p.color, token.position);
        final ourRelative = _getRelativePositionForColor(player.color, position);

        // We threaten if we're 1-6 behind them
        final distance = tokenRelative - ourRelative;
        if (distance >= 1 && distance <= 6) {
          blockValue += (7 - distance) / 6;
        }
      }
    }

    return blockValue;
  }

  int _evaluateProgression(
    GameState gameState,
    PlayerState player,
    TokenState token,
    int toPosition,
  ) {
    final finishedCount = player.tokens.where((t) => t.isFinished).length;
    final homeLaneCount = player.tokens.where((t) => isInHomeLane(t.position)).length;
    final onBoardCount = player.tokens.where((t) => !isInHome(t.position) && !isFinished(t.position) && !isInHomeLane(t.position)).length;

    var score = 0;

    // Early game: Get tokens out of home
    if (finishedCount == 0 && homeLaneCount == 0 && onBoardCount < 2) {
      if (isInHome(token.position)) score += 50;
    }

    // Mid game: Balance advancing and safety
    if (finishedCount < 2) {
      final relativePos = isInHome(token.position) ? -1 : getRelativePosition(player.color, token.position);
      if (relativePos >= 0 && relativePos < 20) {
        score += _weights.helpLagging;
      }
    }

    // Late game: Race to finish
    if (finishedCount >= 2) {
      if (isInHomeLane(toPosition) || isFinished(toPosition)) {
        score += _weights.advanceLeading * 2;
      }
    }

    return score;
  }

  double _calculateExtraTurnChance(
    GameState gameState,
    PlayerState player,
    int toPosition,
    int currentDice,
  ) {
    var chance = 0.0;

    // Extra turn on six (already rolled)
    if (currentDice == 6 && gameState.rules.extraTurnOnSix) {
      chance += 1;
    }

    // Extra turn on capture
    final captures = _analyzeCaptures(gameState, player.userId, toPosition);
    if (captures.immediate > 0 && gameState.rules.extraTurnOnCapture) {
      chance += 0.8;
    }

    // Extra turn on home entry
    if (isFinished(toPosition) && gameState.rules.extraTurnOnHome) {
      chance += 1;
    }

    return chance;
  }

  int _getDistanceToTarget(PlayerColor color, int fromRelative, int targetAbsolute) {
    final targetRelative = _getRelativePositionForColor(color, targetAbsolute);
    if (targetRelative < fromRelative) return 100;
    return targetRelative - fromRelative;
  }

  int _getRelativePositionForColor(PlayerColor color, int absolute) {
    final start = START_POSITIONS[color]!;
    var rel = absolute - start;
    if (rel < 0) rel += BOARD_SIZE;
    return rel;
  }
}

/// Weights for HardBot evaluation
class _HardBotWeights {
  final int exitHome = 200;
  final int enterHomeLane = 150;
  final int finishToken = 300;
  final int capture = 250;
  final int safeCell = 50;
  final int avoidDanger = 80;
  final int blockOpponent = 100;
  final int advanceLeading = 30;
  final int helpLagging = 40;
  final int extraTurnValue = 120;
}

/// Helper class for capture analysis
class _CaptureAnalysis {
  final int immediate;
  final int strategic;

  _CaptureAnalysis({required this.immediate, required this.strategic});
}

/// Helper class for evaluated moves
class _EvaluatedMove {
  final LegalMove move;
  final int evaluation;

  _EvaluatedMove({required this.move, required this.evaluation});
}
// ============================================
// Ludo Nexus - Game Engine (Dart Port)
// Pure, deterministic functions for Ludo game logic
// ============================================

import 'dart:math';
import 'dart:convert';

import '../models/game_models.dart';

// ============================================
// BOARD CONSTANTS
// ============================================

const int BOARD_SIZE = 52;
const int HOME_LANE_LENGTH = 4;
const int FINISHED_POSITION = 56;
const int HOME_POSITION = -1;
const int TOKENS_PER_PLAYER = 4;
const int PLAYERS_COUNT = 4;

const List<PlayerColor> PLAYER_COLORS = [
  PlayerColor.red,
  PlayerColor.green,
  PlayerColor.yellow,
  PlayerColor.blue,
];

const Map<PlayerColor, int> START_POSITIONS = {
  PlayerColor.red: 0,
  PlayerColor.green: 13,
  PlayerColor.yellow: 26,
  PlayerColor.blue: 39,
};

const Map<PlayerColor, int> HOME_LANE_ENTRY = {
  PlayerColor.red: 51,
  PlayerColor.green: 12,
  PlayerColor.yellow: 25,
  PlayerColor.blue: 38,
};

const List<int> DEFAULT_SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];

final GameRules DEFAULT_GAME_RULES = GameRules();

// ============================================
// HELPER FUNCTIONS
// ============================================

int getNextPlayerIndex(int currentIndex, [int playerCount = 4]) {
  return (currentIndex + 1) % playerCount;
}

int getPreviousPlayerIndex(int currentIndex, [int playerCount = 4]) {
  return (currentIndex - 1 + playerCount) % playerCount;
}

bool isSafeCell(int position, [List<int> safeCells = DEFAULT_SAFE_CELLS]) {
  return safeCells.contains(position);
}

bool isInHomeLane(int position) {
  return position >= 52 && position <= 55;
}

bool isFinished(int position) {
  return position == FINISHED_POSITION;
}

bool isInHome(int position) {
  return position == HOME_POSITION;
}

PlayerColor getColorForIndex(int index) {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

int getIndexForColor(PlayerColor color) {
  return PLAYER_COLORS.indexOf(color);
}

int getTrackDistance(int from, int to) {
  if (from < 0 || from > 51 || to < 0 || to > 51) return 0;
  if (to >= from) return to - from;
  return (BOARD_SIZE - from) + to;
}

int getAbsolutePosition(PlayerColor color, int relativePosition) {
  final startPos = START_POSITIONS[color]!;
  return (startPos + relativePosition) % BOARD_SIZE;
}

int getRelativePosition(PlayerColor color, int absolutePosition) {
  final startPos = START_POSITIONS[color]!;
  int relative = absolutePosition - startPos;
  if (relative < 0) relative += BOARD_SIZE;
  return relative;
}

bool canEnterBoard(int diceValue, [int entryRoll = 6]) {
  return diceValue == entryRoll;
}

bool canEnterHomeLane(PlayerColor color, int relativePosition, int diceValue) {
  final homeLaneEntry = HOME_LANE_ENTRY[color]!;
  final distanceToEntry = getTrackDistance(relativePosition, homeLaneEntry);

  if (distanceToEntry == 0) {
    return diceValue >= 1 && diceValue <= 4;
  }
  if (distanceToEntry < 0) return false;
  return diceValue > distanceToEntry && (diceValue - distanceToEntry) <= 4;
}

int getHomeLanePosition(PlayerColor color, int relativePosition, int diceValue) {
  final homeLaneEntry = HOME_LANE_ENTRY[color]!;
  final distanceToEntry = getTrackDistance(relativePosition, homeLaneEntry);
  final stepsIntoHomeLane = diceValue - distanceToEntry;
  return 51 + stepsIntoHomeLane; // 52, 53, 54, or 55
}

bool wouldLandOnSafeCell(PlayerColor color, int currentRelativePos, int diceValue, [List<int> safeCells = DEFAULT_SAFE_CELLS]) {
  if (currentRelativePos == -1) { // In home
    return isSafeCell(START_POSITIONS[color]!, safeCells);
  }
  if (isInHomeLane(currentRelativePos)) return false;

  final newRelativePos = currentRelativePos + diceValue;
  final absolutePos = getAbsolutePosition(color, newRelativePos);
  return isSafeCell(absolutePos, safeCells);
}

// ============================================
// DICE ROLL GENERATION (Server-authoritative)
// ============================================

/// Generate a cryptographically secure dice roll (1-6)
/// This MUST be called on the server only
int rollDice() {
  final random = Random.secure();
  return random.nextInt(6) + 1;
}

DiceRoll createDiceRoll(String rolledBy) {
  final value = rollDice();
  return DiceRoll(
    value: value,
    rolledAt: DateTime.now(),
    rolledBy: rolledBy,
    isServerGenerated: true,
    auditId: _generateAuditId(),
  );
}

String _generateAuditId() {
  final bytes = List<int>.generate(16, (i) => Random.secure().nextInt(256));
  return base64Url.encode(bytes).replaceAll('=', '').substring(0, 32);
}

// ============================================
// INITIAL GAME STATE
// ============================================

GameState createInitialGameState({
  required String matchId,
  required List<PlayerState> players,
  GameRules? rules,
  GameMode mode = GameMode.vsHuman,
  String? roomId,
  String? tournamentId,
}) {
  final mergedRules = rules ?? DEFAULT_GAME_RULES;

  return GameState(
    matchId: matchId,
    roomId: roomId,
    tournamentId: tournamentId,
    mode: mode,
    rules: mergedRules,
    players: players,
    currentPlayerIndex: 0,
    diceRoll: null,
    legalMoves: [],
    moveHistory: [],
    stateVersion: 1,
    status: MatchStatus.waiting,
    winner: null,
    rankings: [],
    createdAt: DateTime.now(),
  );
}

// ============================================
// LEGAL MOVES CALCULATION
// ============================================

List<LegalMove> getLegalMoves(GameState gameState) {
  final currentPlayer = gameState.players[gameState.currentPlayerIndex];
  final diceValue = gameState.diceRoll?.value ?? 0;
  final legalMoves = <LegalMove>[];

  if (diceValue == 0) return legalMoves;

  for (int tokenId = 0; tokenId < currentPlayer.tokens.length; tokenId++) {
    final token = currentPlayer.tokens[tokenId];
    final fromPosition = token.position;
    int toPosition = fromPosition;
    bool isValid = false;

    if (isInHome(fromPosition)) {
      // Token in home - can only enter on entry roll
      if (canEnterBoard(diceValue, gameState.rules.entryRoll)) {
        toPosition = START_POSITIONS[currentPlayer.color]!;
        isValid = true;
      }
    } else if (isFinished(fromPosition)) {
      // Token already finished - cannot move
      isValid = false;
    } else if (isInHomeLane(fromPosition)) {
      // Token in home lane
      final stepsToFinish = FINISHED_POSITION - fromPosition;
      if (diceValue == stepsToFinish) {
        toPosition = FINISHED_POSITION;
        isValid = true;
      } else if (diceValue < stepsToFinish) {
        toPosition = fromPosition + diceValue;
        isValid = true;
      }
    } else {
      // Token on main track
      final relativePos = getRelativePosition(currentPlayer.color, fromPosition);

      if (canEnterHomeLane(currentPlayer.color, relativePos, diceValue)) {
        // Can enter home lane
        toPosition = getHomeLanePosition(currentPlayer.color, relativePos, diceValue);
        isValid = true;
      } else {
        // Move on main track
        final newRelativePos = relativePos + diceValue;
        if (newRelativePos < BOARD_SIZE) {
          toPosition = getAbsolutePosition(currentPlayer.color, newRelativePos);
          isValid = true;
        }
      }
    }

    // Check blockade rule
    if (isValid && gameState.rules.allowBlockades) {
      final ownTokenAtDest = currentPlayer.tokens.asMap().entries.any((entry) {
        final i = entry.key;
        final t = entry.value;
        return i != tokenId && t.position == toPosition && !isFinished(t.position);
      });
      if (ownTokenAtDest) isValid = false;
    }

    if (isValid) {
      legalMoves.add(LegalMove(
        tokenId: tokenId,
        fromPosition: fromPosition,
        toPosition: toPosition,
      ));
    }
  }

  return legalMoves;
}

// ============================================
// MOVE EXECUTION
// ============================================

class MoveResult {
  final GameState gameState;
  final Move move;
  final List<CapturedToken> capturedTokens;

  MoveResult({
    required this.gameState,
    required this.move,
    required this.capturedTokens,
  });
}

MoveResult moveToken({
  required GameState gameState,
  required int tokenId,
  required int toPosition,
}) {
  final currentPlayer = gameState.players[gameState.currentPlayerIndex];
  final token = currentPlayer.tokens[tokenId];
  final fromPosition = token.position;
  final diceValue = gameState.diceRoll?.value ?? 0;

  // Validate the move is legal
  final legalMoves = getLegalMoves(gameState);
  final moveIndex = legalMoves.indexWhere(
    (m) => m.tokenId == tokenId && m.toPosition == toPosition,
  );

  if (moveIndex == -1) {
    throw Exception('Illegal move');
  }

  // Check for captures
  final capturedTokens = _checkCaptures(gameState, currentPlayer.userId, toPosition);

  // Apply captures to game state
  var stateAfterCaptures = _applyCaptures(gameState, capturedTokens);

  // Update token position on the state after captures
  final currentPlayerAfterCaptures = stateAfterCaptures.players[gameState.currentPlayerIndex];
  final updatedTokens = currentPlayerAfterCaptures.tokens.asMap().entries.map<TokenState>((entry) {
    final i = entry.key;
    final t = entry.value;
    if (i == tokenId) {
      return TokenState(
        id: t.id,
        position: toPosition,
        isInHome: isInHome(toPosition),
        isFinished: isFinished(toPosition),
      );
    }
    return t;
  }).toList();

  // Check if player has won
  final playerCompleted = updatedTokens.every((t) => t.isFinished);

  // Create updated players for match completion check
  final updatedPlayersForCheck = stateAfterCaptures.players.asMap().entries.map<PlayerState>((entry) {
    final i = entry.key;
    final p = entry.value;
    if (i == gameState.currentPlayerIndex) {
      return PlayerState(
        userId: p.userId,
        color: p.color,
        tokens: updatedTokens,
        isActive: p.isActive,
        isConnected: p.isConnected,
        hasRolled: p.hasRolled,
        lastMoveAt: p.lastMoveAt,
        consecutiveSixes: p.consecutiveSixes,
        isBot: p.isBot,
        botDifficulty: p.botDifficulty,
        teamId: p.teamId,
      );
    }
    return p;
  }).toList();

  // Check if match is completed
  final matchCompleted = _checkMatchCompletion(
    GameState(
      matchId: stateAfterCaptures.matchId,
      roomId: stateAfterCaptures.roomId,
      tournamentId: stateAfterCaptures.tournamentId,
      mode: stateAfterCaptures.mode,
      rules: stateAfterCaptures.rules,
      players: updatedPlayersForCheck,
      currentPlayerIndex: stateAfterCaptures.currentPlayerIndex,
      diceRoll: stateAfterCaptures.diceRoll,
      legalMoves: stateAfterCaptures.legalMoves,
      moveHistory: stateAfterCaptures.moveHistory,
      stateVersion: stateAfterCaptures.stateVersion,
      status: stateAfterCaptures.status,
      winner: stateAfterCaptures.winner,
      rankings: stateAfterCaptures.rankings,
      startedAt: stateAfterCaptures.startedAt,
      completedAt: stateAfterCaptures.completedAt,
      createdAt: stateAfterCaptures.createdAt,
    ),
    currentPlayer.userId,
  );

  // Determine if extra turn
  final isSix = diceValue == 6;
  final isCapture = capturedTokens.isNotEmpty;
  final isHomeEntry = isFinished(toPosition);

  final extraTurn =
      (isSix && gameState.rules.extraTurnOnSix) ||
      (isCapture && gameState.rules.extraTurnOnCapture) ||
      (isHomeEntry && gameState.rules.extraTurnOnHome);

  // Handle three consecutive sixes
  int newConsecutiveSixes = currentPlayer.consecutiveSixes;
  if (isSix) {
    newConsecutiveSixes += 1;
  } else {
    newConsecutiveSixes = 0;
  }

  final threeSixes = newConsecutiveSixes >= 3 && gameState.rules.allowThreeSixes;

  // Create move record
  final move = Move(
    tokenId: tokenId,
    fromPosition: fromPosition,
    toPosition: toPosition,
    capturedTokens: capturedTokens,
    isExtraTurn: extraTurn && !threeSixes && !matchCompleted,
    gameStateVersion: gameState.stateVersion,
  );

  // Update player state
  final updatedPlayers = stateAfterCaptures.players.asMap().entries.map<PlayerState>((entry) {
    final i = entry.key;
    final p = entry.value;
    if (i == gameState.currentPlayerIndex) {
      return PlayerState(
        userId: p.userId,
        color: p.color,
        tokens: updatedTokens,
        isActive: p.isActive,
        isConnected: p.isConnected,
        hasRolled: false,
        lastMoveAt: DateTime.now(),
        consecutiveSixes: threeSixes ? 0 : newConsecutiveSixes,
        isBot: p.isBot,
        botDifficulty: p.botDifficulty,
        teamId: p.teamId,
      );
    }
    return p;
  }).toList();

  // Determine next player
  int nextPlayerIndex = gameState.currentPlayerIndex;
  MatchStatus nextStatus = gameState.status;
  String? winner = gameState.winner;
  List<String> rankings = gameState.rankings;

  if (matchCompleted) {
    nextStatus = MatchStatus.completed;
    winner = currentPlayer.userId;
    rankings = _calculateRankings(
      GameState(
        matchId: gameState.matchId,
        roomId: gameState.roomId,
        tournamentId: gameState.tournamentId,
        mode: gameState.mode,
        rules: gameState.rules,
        players: updatedPlayers,
        currentPlayerIndex: gameState.currentPlayerIndex,
        diceRoll: gameState.diceRoll,
        legalMoves: gameState.legalMoves,
        moveHistory: [...gameState.moveHistory, move],
        stateVersion: gameState.stateVersion,
        status: gameState.status,
        winner: gameState.winner,
        rankings: gameState.rankings,
        startedAt: gameState.startedAt,
        completedAt: gameState.completedAt,
        createdAt: gameState.createdAt,
      ),
      currentPlayer.userId,
    );
  } else if (!extraTurn || threeSixes) {
    // Move to next player
    do {
      nextPlayerIndex = getNextPlayerIndex(nextPlayerIndex, gameState.players.length);
    } while (!gameState.players[nextPlayerIndex].isActive &&
        nextPlayerIndex != gameState.currentPlayerIndex);
  }

  // Update state version
  final newStateVersion = gameState.stateVersion + 1;

  final newGameState = GameState(
    matchId: gameState.matchId,
    roomId: gameState.roomId,
    tournamentId: gameState.tournamentId,
    mode: gameState.mode,
    rules: gameState.rules,
    players: updatedPlayers,
    currentPlayerIndex: nextPlayerIndex,
    diceRoll: null, // Clear dice roll after move
    legalMoves: [], // Will be populated after dice roll
    moveHistory: [...gameState.moveHistory, move],
    stateVersion: newStateVersion,
    status: nextStatus,
    winner: winner,
    rankings: rankings,
    startedAt: gameState.startedAt,
    completedAt: matchCompleted ? DateTime.now() : gameState.completedAt,
    createdAt: gameState.createdAt,
  );

  // Calculate legal moves for next player
  if (nextStatus == MatchStatus.inProgress) {
    final nextPlayerMoves = getLegalMoves(newGameState);
    // We can't easily update the list in the immutable GameState
    // This would need to be handled by the caller
  }

  return MoveResult(
    gameState: newGameState,
    move: move,
    capturedTokens: capturedTokens,
  );
}

List<CapturedToken> _checkCaptures(
  GameState gameState,
  String movingPlayerId,
  int destinationPosition,
) {
  final captured = <CapturedToken>[];

  // Don't capture on safe cells
  if (isSafeCell(destinationPosition, gameState.rules.safeCells)) return captured;

  // Don't capture in home lane or finished
  if (isInHomeLane(destinationPosition) || isFinished(destinationPosition)) return captured;

  // Check other players' tokens at this position
  for (final player in gameState.players) {
    if (player.userId == movingPlayerId) continue;
    if (!player.isActive) continue;

    for (final token in player.tokens) {
      if (token.position == destinationPosition &&
          !token.isFinished &&
          !isInHome(token.position)) {
        captured.add(CapturedToken(
          playerId: player.userId,
          tokenId: token.id,
          fromPosition: token.position,
        ));
      }
    }
  }

  return captured;
}

GameState _applyCaptures(
  GameState gameState,
  List<CapturedToken> capturedTokens,
) {
  final updatedPlayers = gameState.players.asMap().entries.map<PlayerState>((entry) {
    final player = entry.value;
    final playerCaptures = capturedTokens.where((c) => c.playerId == player.userId).toList();
    if (playerCaptures.isEmpty) return player;

    return PlayerState(
      userId: player.userId,
      color: player.color,
      tokens: player.tokens.asMap().entries.map<TokenState>((tokenEntry) {
        final tokenId = tokenEntry.key;
        final token = tokenEntry.value;
        final capture = playerCaptures.firstWhere(
          (c) => c.tokenId == tokenId,
          orElse: () => CapturedToken(playerId: '', tokenId: -1, fromPosition: -1),
        );
        if (capture.playerId.isNotEmpty) {
          return TokenState(
            id: token.id,
            position: HOME_POSITION,
            isInHome: true,
            isFinished: false,
          );
        }
        return token;
      }).toList(),
      isActive: player.isActive,
      isConnected: player.isConnected,
      hasRolled: player.hasRolled,
      lastMoveAt: player.lastMoveAt,
      consecutiveSixes: player.consecutiveSixes,
      isBot: player.isBot,
      botDifficulty: player.botDifficulty,
      teamId: player.teamId,
    );
  }).toList();

  return GameState(
    matchId: gameState.matchId,
    roomId: gameState.roomId,
    tournamentId: gameState.tournamentId,
    mode: gameState.mode,
    rules: gameState.rules,
    players: updatedPlayers,
    currentPlayerIndex: gameState.currentPlayerIndex,
    diceRoll: gameState.diceRoll,
    legalMoves: gameState.legalMoves,
    moveHistory: gameState.moveHistory,
    stateVersion: gameState.stateVersion,
    status: gameState.status,
    winner: gameState.winner,
    rankings: gameState.rankings,
    startedAt: gameState.startedAt,
    completedAt: gameState.completedAt,
    createdAt: gameState.createdAt,
  );
}

// ============================================
// TURN MANAGEMENT
// ============================================

int calculateNextTurn(GameState gameState) {
  int nextIndex = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.players.length);

  // Skip inactive players
  int attempts = 0;
  while (!gameState.players[nextIndex].isActive && attempts < gameState.players.length) {
    nextIndex = getNextPlayerIndex(nextIndex, gameState.players.length);
    attempts++;
  }

  return nextIndex;
}

bool checkPlayerCompletion(GameState gameState, String playerId) {
  final player = gameState.players.firstWhere((p) => p.userId == playerId);
  return player.tokens.every((t) => t.isFinished);
}

bool _checkMatchCompletion(GameState gameState, String winnerId) {
  // In team mode, check team completion
  if (gameState.rules.teamMode) {
    final winner = gameState.players.firstWhere((p) => p.userId == winnerId);
    if (winner.teamId == null) return false;

    final teamPlayers = gameState.players.where(
      (p) => p.teamId == winner.teamId && p.isActive,
    ).toList();

    return teamPlayers.every((p) => p.tokens.every((t) => t.isFinished));
  }

  // Standard mode: single winner
  return checkPlayerCompletion(gameState, winnerId);
}

List<String> _calculateRankings(GameState gameState, String winnerId) {
  final rankings = <String>[winnerId];

  // Get remaining active players sorted by progress
  final otherPlayers = gameState.players
      .where((p) => p.userId != winnerId && p.isActive)
      .toList()
    ..sort((a, b) {
      // Sort by: finished tokens count (desc), then total progress (desc)
      final aFinished = a.tokens.where((t) => t.isFinished).length;
      final bFinished = b.tokens.where((t) => t.isFinished).length;
      if (aFinished != bFinished) return bFinished - aFinished;

      final aProgress = a.tokens.fold<int>(0, (sum, t) => sum + _getTokenProgress(t));
      final bProgress = b.tokens.fold<int>(0, (sum, t) => sum + _getTokenProgress(t));
      return bProgress - aProgress;
    });

  rankings.addAll(otherPlayers.map((p) => p.userId));

  // Add inactive/abandoned players at the end
  final inactivePlayers = gameState.players
      .where((p) => !p.isActive && !rankings.contains(p.userId))
      .map((p) => p.userId);

  rankings.addAll(inactivePlayers);

  return rankings;
}

int _getTokenProgress(TokenState token) {
  if (isFinished(token.position)) return 100;
  if (isInHomeLane(token.position)) return 80 + (token.position - 52) * 5; // 80-95
  if (isInHome(token.position)) return 0;
  // Approximate for main track
  return 50; // Simplified
}

// ============================================
// MOVE VALIDATION
// ============================================

class ValidationResult {
  final bool valid;
  final String? error;

  ValidationResult({required this.valid, this.error});
}

ValidationResult validateMove({
  required GameState gameState,
  required String playerId,
  required int tokenId,
  required int toPosition,
  required int expectedVersion,
}) {
  // Check version
  if (gameState.stateVersion != expectedVersion) {
    return ValidationResult(valid: false, error: 'Game state version mismatch');
  }

  // Check game status
  if (gameState.status != MatchStatus.inProgress) {
    return ValidationResult(valid: false, error: 'Game is not in progress');
  }

  // Check player turn
  final currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (currentPlayer.userId != playerId) {
    return ValidationResult(valid: false, error: 'Not your turn');
  }

  // Check player is active
  if (!currentPlayer.isActive) {
    return ValidationResult(valid: false, error: 'Player is not active');
  }

  // Check dice has been rolled
  if (gameState.diceRoll == null) {
    return ValidationResult(valid: false, error: 'Dice not rolled yet');
  }

  // Check token exists
  if (tokenId < 0 || tokenId >= currentPlayer.tokens.length) {
    return ValidationResult(valid: false, error: 'Invalid token');
  }

  // Check move is legal
  final legalMoves = getLegalMoves(gameState);
  final move = legalMoves.firstWhere(
    (m) => m.tokenId == tokenId && m.toPosition == toPosition,
    orElse: () => LegalMove(tokenId: -1, fromPosition: -1, toPosition: -1),
  );
  if (move.tokenId == -1) {
    return ValidationResult(valid: false, error: 'Illegal move');
  }

  return ValidationResult(valid: true);
}

// ============================================
// STATE SERIALIZATION
// ============================================

/// Serialize public game state (for clients)
/// Hides sensitive information like other players' tokens in home
GameState serializePublicState(GameState gameState, String viewerId) {
  // For now, return full state (can be enhanced to hide info)
  return gameState;
}

GameState restoreGameState(Map<String, dynamic> serialized) {
  // Deserialization would be implemented here
  // For now, return a basic structure
  throw UnimplementedError('Deserialization not implemented');
}

// ============================================
// TEAM RESULT
// ============================================

class _TeamData {
  final List<PlayerState> players;
  int finishedCount;

  _TeamData({required this.players, required this.finishedCount});
}

class TeamResult {
  final int winningTeam;
  final List<int> teamRankings;

  TeamResult({required this.winningTeam, required this.teamRankings});
}

TeamResult calculateTeamResult(GameState gameState) {
  if (!gameState.rules.teamMode) {
    throw Exception('Not a team game');
  }

  final teams = <int, _TeamData>{};

  for (final player in gameState.players) {
    if (player.teamId != null) {
      final team = teams.putIfAbsent(
        player.teamId!,
        () => _TeamData(players: <PlayerState>[], finishedCount: 0),
      );
      team.players.add(player);
      if (player.tokens.every((t) => t.isFinished)) {
        team.finishedCount++;
      }
    }
  }

  // Find winning team (first with all players finished)
  int winningTeam = -1;
  teams.forEach((teamId, team) {
    if (team.players.every((p) => p.tokens.every((t) => t.isFinished))) {
      winningTeam = teamId;
    }
  });

  // Rank teams by finished players count, then total progress
  final sortedTeams = teams.entries.toList()
    ..sort((a, b) {
      final aFinished = a.value.finishedCount;
      final bFinished = b.value.finishedCount;
      if (aFinished != bFinished) return bFinished - aFinished;

      final aProgress = a.value.players.fold<int>(
        0,
        (sum, p) => sum + p.tokens.fold<int>(0, (s, t) => s + _getTokenProgress(t)),
      );
      final bProgress = b.value.players.fold<int>(
        0,
        (sum, p) => sum + p.tokens.fold<int>(0, (s, t) => s + _getTokenProgress(t)),
      );
      return bProgress - aProgress;
    });

  final teamRankings = sortedTeams.map((e) => e.key).toList();

  return TeamResult(winningTeam: winningTeam, teamRankings: teamRankings);
}

// ============================================
// BOT AI INTERFACE
// ============================================

class BotDecision {
  final String action; // 'roll' or 'move'
  final int? tokenId;

  BotDecision({required this.action, this.tokenId});
}

abstract class BotAI {
  BotDecision decide(GameState gameState, int playerIndex);
}

// ============================================
// EASY BOT - Mostly random legal moves
// ============================================

class EasyBot implements BotAI {
  @override
  BotDecision decide(GameState gameState, int playerIndex) {
    final player = gameState.players[playerIndex];
    final legalMoves = getLegalMoves(gameState);

    if (legalMoves.isEmpty) {
      return BotDecision(action: 'roll');
    }

    if (!player.hasRolled && gameState.diceRoll == null) {
      return BotDecision(action: 'roll');
    }

    // Pick a random legal move
    final randomMove = legalMoves[Random().nextInt(legalMoves.length)];
    return BotDecision(action: 'move', tokenId: randomMove.tokenId);
  }
}

// ============================================
// MEDIUM BOT - Prioritizes captures, avoids danger, balanced
// ============================================

class MediumBot implements BotAI {
  @override
  BotDecision decide(GameState gameState, int playerIndex) {
    final player = gameState.players[playerIndex];
    final legalMoves = getLegalMoves(gameState);

    if (legalMoves.isEmpty) {
      return BotDecision(action: 'roll');
    }

    if (!player.hasRolled && gameState.diceRoll == null) {
      return BotDecision(action: 'roll');
    }

    // Score each legal move
    final scoredMoves = legalMoves.map((move) {
      final token = player.tokens[move.tokenId];
      int score = 0;

      // High priority: Move token out of home
      if (isInHome(token.position)) {
        score += 100;
      }

      // High priority: Enter home lane / finish
      if (isInHomeLane(move.toPosition)) score += 80;
      if (isFinished(move.toPosition)) score += 150;

      // Priority: Capture opponent
      final captures = _countCapturesAtPosition(gameState, player.userId, move.toPosition);
      if (captures > 0) score += 90 * captures;

      // Priority: Land on safe cell
      if (isSafeCell(move.toPosition, gameState.rules.safeCells)) score += 30;

      // Avoid: Move to position where we can be captured next turn
      final dangerScore = _calculateDanger(gameState, player, move.toPosition);
      score -= dangerScore * 20;

      // Priority: Advance tokens that are farthest behind
      final relativePos = isInHome(token.position)
          ? -1
          : getRelativePosition(player.color, token.position);
      if (relativePos >= 0 && relativePos < 20) {
        score += 10;
      }

      // Small random factor
      score += Random().nextInt(5);

      return {'move': move, 'score': score};
    }).toList();

    // Pick highest scored move
    scoredMoves.sort((a, b) => (b['score'] as int).compareTo(a['score'] as int));
    return BotDecision(action: 'move', tokenId: (scoredMoves.first['move'] as LegalMove).tokenId);
  }

  int _countCapturesAtPosition(
    GameState gameState,
    String movingPlayerId,
    int position,
  ) {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    int count = 0;
    for (final player in gameState.players) {
      if (player.userId == movingPlayerId || !player.isActive) continue;
      for (final token in player.tokens) {
        if (token.position == position && !token.isFinished && !isInHome(token.position)) {
          count++;
        }
      }
    }
    return count;
  }

  int _calculateDanger(GameState gameState, PlayerState player, int position) {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    int danger = 0;
    for (final opponent in gameState.players) {
      if (opponent.userId == player.userId || !opponent.isActive) continue;

      for (final token in opponent.tokens) {
        if (isInHome(token.position) || isFinished(token.position)) continue;

        final relativePos = getRelativePosition(opponent.color, token.position);
        final distance = _getDistanceToTarget(opponent.color, relativePos, position);

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
    int rel = absolute - start;
    if (rel < 0) rel += BOARD_SIZE;
    return rel;
  }
}

// ============================================
// HARD BOT - Weighted evaluation, risk calculation, blocking
// ============================================

class HardBot implements BotAI {
  final Map<String, int> weights = {
    'exitHome': 200,
    'enterHomeLane': 150,
    'finishToken': 300,
    'capture': 250,
    'safeCell': 50,
    'avoidDanger': 80,
    'blockOpponent': 100,
    'advanceLeading': 30,
    'helpLagging': 40,
    'extraTurnValue': 120,
  };

  @override
  BotDecision decide(GameState gameState, int playerIndex) {
    final player = gameState.players[playerIndex];
    final legalMoves = getLegalMoves(gameState);

    if (legalMoves.isEmpty) {
      return BotDecision(action: 'roll');
    }

    if (!player.hasRolled && gameState.diceRoll == null) {
      return BotDecision(action: 'roll');
    }

    // Evaluate each move with full game state analysis
    final evaluatedMoves = legalMoves.map((move) {
      final token = player.tokens[move.tokenId];
      final evaluation = _evaluateMove(gameState, player, token, move);
      return {'move': move, 'evaluation': evaluation};
    }).toList();

    // Pick best move
    evaluatedMoves.sort((a, b) => (b['evaluation'] as int).compareTo(a['evaluation'] as int));
    return BotDecision(action: 'move', tokenId: (evaluatedMoves.first['move'] as LegalMove).tokenId);
  }

  int _evaluateMove(
    GameState gameState,
    PlayerState player,
    TokenState token,
    LegalMove move,
  ) {
    int score = 0;
    final toPosition = move.toPosition;

    // 1. Exit home - critical priority
    if (isInHome(token.position)) score += weights['exitHome']!;

    // 2. Enter home lane / finish
    if (isInHomeLane(toPosition)) {
      score += weights['enterHomeLane']!;
      score += (toPosition - 52) * 20;
    }
    if (isFinished(toPosition)) score += weights['finishToken']!;

    // 3. Capture evaluation
    final captures = _analyzeCaptures(gameState, player.userId, toPosition);
    score += captures['immediate']! * weights['capture']!;
    score += captures['strategic']! * (weights['capture']! ~/ 2);

    // 4. Safe cell bonus
    if (isSafeCell(toPosition, gameState.rules.safeCells)) score += weights['safeCell']!;

    // 5. Danger assessment
    final danger = _assessDanger(gameState, player, toPosition);
    score -= danger * weights['avoidDanger']!;

    // 6. Blocking opponents
    final blockValue = _calculateBlockingValue(gameState, player, toPosition);
    score += blockValue * weights['blockOpponent']!;

    // 7. Token progression strategy
    final progression = _evaluateProgression(gameState, player, token, toPosition);
    score += progression;

    // 8. Extra turn potential
    final diceValue = gameState.diceRoll?.value ?? 0;
    final extraTurnChance = _calculateExtraTurnChance(gameState, player, toPosition, diceValue);
    score += extraTurnChance * weights['extraTurnValue']!;

    return score;
  }

  Map<String, int> _analyzeCaptures(
    GameState gameState,
    String movingPlayerId,
    int position,
  ) {
    if (isSafeCell(position, gameState.rules.safeCells)) return {'immediate': 0, 'strategic': 0};
    if (isInHomeLane(position) || isFinished(position)) return {'immediate': 0, 'strategic': 0};

    int immediate = 0;
    int strategic = 0;

    for (final player in gameState.players) {
      if (player.userId == movingPlayerId || !player.isActive) continue;

      for (final token in player.tokens) {
        if (token.position == position && !token.isFinished && !isInHome(token.position)) {
          immediate++;

          final relativePos = getRelativePosition(player.color, token.position);
          if (relativePos > 30) strategic += 2;
          else if (relativePos > 15) strategic += 1;
        }
      }
    }

    return {'immediate': immediate, 'strategic': strategic};
  }

  int _assessDanger(GameState gameState, PlayerState player, int position) {
    if (isSafeCell(position, gameState.rules.safeCells)) return 0;
    if (isInHomeLane(position) || isFinished(position)) return 0;

    int danger = 0;

    for (final opponent in gameState.players) {
      if (opponent.userId == player.userId || !opponent.isActive) continue;

      for (final token in opponent.tokens) {
        if (isInHome(token.position) || isFinished(token.position)) continue;

        final relativePos = getRelativePosition(opponent.color, token.position);
        final distance = _getDistanceToTarget(opponent.color, relativePos, position);

        if (distance >= 1 && distance <= 6) {
          danger += ((7 - distance) / 6).round();
        }
      }
    }

    return danger;
  }

  int _calculateBlockingValue(GameState gameState, PlayerState player, int position) {
    int blockValue = 0;

    for (final opponent in gameState.players) {
      if (opponent.userId == player.userId || !opponent.isActive) continue;

      for (final token in opponent.tokens) {
        if (isInHome(token.position) || isFinished(token.position)) continue;

        final tokenRelative = getRelativePosition(opponent.color, token.position);
        final ourRelative = _getRelativePositionForColor(player.color, position);

        final distance = tokenRelative - ourRelative;
        if (distance >= 1 && distance <= 6) {
          blockValue += ((7 - distance) / 6).round();
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
    final onBoardCount = player.tokens.where(
      (t) => !isInHome(t.position) && !isFinished(t.position) && !isInHomeLane(t.position),
    ).length;

    int score = 0;

    // Early game: Get tokens out of home
    if (finishedCount == 0 && homeLaneCount == 0 && onBoardCount < 2) {
      if (isInHome(token.position)) score += 50;
    }

    // Mid game: Balance advancing and safety
    if (finishedCount < 2) {
      final relativePos = isInHome(token.position) ? -1 : getRelativePosition(player.color, token.position);
      if (relativePos >= 0 && relativePos < 20) {
        score += weights['helpLagging']!;
      }
    }

    // Late game: Race to finish
    if (finishedCount >= 2) {
      if (isInHomeLane(toPosition) || isFinished(toPosition)) {
        score += weights['advanceLeading']! * 2;
      }
    }

    return score;
  }

  int _calculateExtraTurnChance(
    GameState gameState,
    PlayerState player,
    int toPosition,
    int currentDice,
  ) {
    int chance = 0;

    if (currentDice == 6 && gameState.rules.extraTurnOnSix) chance += 1;

    final captures = _analyzeCaptures(gameState, player.userId, toPosition);
    if (captures['immediate']! > 0 && gameState.rules.extraTurnOnCapture) chance += 1;

    if (isFinished(toPosition) && gameState.rules.extraTurnOnHome) chance += 1;

    return chance;
  }

  int _getDistanceToTarget(PlayerColor color, int fromRelative, int targetAbsolute) {
    final targetRelative = _getRelativePositionForColor(color, targetAbsolute);
    if (targetRelative < fromRelative) return 100;
    return targetRelative - fromRelative;
  }

  int _getRelativePositionForColor(PlayerColor color, int absolute) {
    final start = START_POSITIONS[color]!;
    int rel = absolute - start;
    if (rel < 0) rel += BOARD_SIZE;
    return rel;
  }
}

// ============================================
// BOT FACTORY
// ============================================

BotAI createBot(BotDifficulty difficulty) {
  switch (difficulty) {
    case BotDifficulty.easy:
      return EasyBot();
    case BotDifficulty.medium:
      return MediumBot();
    case BotDifficulty.hard:
      return HardBot();
  }
}
// ============================================
// Ludo Nexus - Game Models (Ported from TypeScript)
// ============================================

enum PlayerColor { red, green, yellow, blue }

enum GameMode { vsAi, vsHuman, group, private_, team, tournament }

enum BotDifficulty { easy, medium, hard }

enum MatchStatus { waiting, starting, inProgress, completed, cancelled, abandoned }

enum RoomStatus { lobby, starting, inProgress, completed }

class GameRules {
  final int tokensPerPlayer;
  final int entryRoll;
  final bool allowThreeSixes;
  final bool extraTurnOnSix;
  final bool extraTurnOnCapture;
  final bool extraTurnOnHome;
  final int turnTimeSeconds;
  final int reconnectionGraceSeconds;
  final int inactivityLimit;
  final bool allowBlockades;
  final List<int> safeCells;
  final bool teamMode;
  final BotDifficulty botDifficulty;

  GameRules({
    this.tokensPerPlayer = 4,
    this.entryRoll = 6,
    this.allowThreeSixes = true,
    this.extraTurnOnSix = true,
    this.extraTurnOnCapture = true,
    this.extraTurnOnHome = true,
    this.turnTimeSeconds = 30,
    this.reconnectionGraceSeconds = 30,
    this.inactivityLimit = 3,
    this.allowBlockades = false,
    this.safeCells = const [0, 8, 13, 21, 26, 34, 39, 47],
    this.teamMode = false,
    this.botDifficulty = BotDifficulty.medium,
  });

  factory GameRules.fromJson(Map<String, dynamic> json) => GameRules(
    tokensPerPlayer: json['tokensPerPlayer'] ?? 4,
    entryRoll: json['entryRoll'] ?? 6,
    allowThreeSixes: json['allowThreeSixes'] ?? true,
    extraTurnOnSix: json['extraTurnOnSix'] ?? true,
    extraTurnOnCapture: json['extraTurnOnCapture'] ?? true,
    extraTurnOnHome: json['extraTurnOnHome'] ?? true,
    turnTimeSeconds: json['turnTimeSeconds'] ?? 30,
    reconnectionGraceSeconds: json['reconnectionGraceSeconds'] ?? 30,
    inactivityLimit: json['inactivityLimit'] ?? 3,
    allowBlockades: json['allowBlockades'] ?? false,
    safeCells: List<int>.from(json['safeCells'] ?? [0, 8, 13, 21, 26, 34, 39, 47]),
    teamMode: json['teamMode'] ?? false,
    botDifficulty: BotDifficulty.values.firstWhere(
      (e) => e.name == json['botDifficulty'],
      orElse: () => BotDifficulty.medium,
    ),
  );

  Map<String, dynamic> toJson() => {
    'tokensPerPlayer': tokensPerPlayer,
    'entryRoll': entryRoll,
    'allowThreeSixes': allowThreeSixes,
    'extraTurnOnSix': extraTurnOnSix,
    'extraTurnOnCapture': extraTurnOnCapture,
    'extraTurnOnHome': extraTurnOnHome,
    'turnTimeSeconds': turnTimeSeconds,
    'reconnectionGraceSeconds': reconnectionGraceSeconds,
    'inactivityLimit': inactivityLimit,
    'allowBlockades': allowBlockades,
    'safeCells': safeCells,
    'teamMode': teamMode,
    'botDifficulty': botDifficulty.name,
  };
}

class LegalMove {
  final int tokenId;
  final int fromPosition;
  final int toPosition;

  LegalMove({
    required this.tokenId,
    required this.fromPosition,
    required this.toPosition,
  });

  factory LegalMove.fromJson(Map<String, dynamic> json) => LegalMove(
    tokenId: json['tokenId'] ?? 0,
    fromPosition: json['fromPosition'] ?? 0,
    toPosition: json['toPosition'] ?? 0,
  );

  Map<String, dynamic> toJson() => {
    'tokenId': tokenId,
    'fromPosition': fromPosition,
    'toPosition': toPosition,
  };
}

class Move {
  final int tokenId;
  final int fromPosition;
  final int toPosition;
  final List<CapturedToken> capturedTokens;
  final bool isExtraTurn;
  final int gameStateVersion;

  Move({
    required this.tokenId,
    required this.fromPosition,
    required this.toPosition,
    required this.capturedTokens,
    required this.isExtraTurn,
    required this.gameStateVersion,
  });

  factory Move.fromJson(Map<String, dynamic> json) => Move(
    tokenId: json['tokenId'] ?? 0,
    fromPosition: json['fromPosition'] ?? 0,
    toPosition: json['toPosition'] ?? 0,
    capturedTokens: (json['capturedTokens'] as List? ?? []).map((e) => CapturedToken.fromJson(e)).toList(),
    isExtraTurn: json['isExtraTurn'] ?? false,
    gameStateVersion: json['gameStateVersion'] ?? 0,
  );

  Map<String, dynamic> toJson() => {
    'tokenId': tokenId,
    'fromPosition': fromPosition,
    'toPosition': toPosition,
    'capturedTokens': capturedTokens.map((c) => c.toJson()).toList(),
    'isExtraTurn': isExtraTurn,
    'gameStateVersion': gameStateVersion,
  };
}

class CapturedToken {
  final String playerId;
  final int tokenId;
  final int fromPosition;

  CapturedToken({
    required this.playerId,
    required this.tokenId,
    required this.fromPosition,
  });

  factory CapturedToken.fromJson(Map<String, dynamic> json) => CapturedToken(
    playerId: json['playerId'] ?? '',
    tokenId: json['tokenId'] ?? 0,
    fromPosition: json['fromPosition'] ?? 0,
  );

  Map<String, dynamic> toJson() => {
    'playerId': playerId,
    'tokenId': tokenId,
    'fromPosition': fromPosition,
  };
}

class TokenState {
  final int id;
  final int position; // -1 = home, 0-51 = track, 52-55 = home lane, 56 = finished
  final bool isInHome;
  final bool isFinished;

  TokenState({
    required this.id,
    required this.position,
    required this.isInHome,
    required this.isFinished,
  });

  factory TokenState.fromJson(Map<String, dynamic> json) => TokenState(
    id: json['id'] ?? 0,
    position: json['position'] ?? -1,
    isInHome: json['isInHome'] ?? true,
    isFinished: json['isFinished'] ?? false,
  );

  factory TokenState.initial(int id) => TokenState(
    id: id,
    position: -1,
    isInHome: true,
    isFinished: false,
  );

  TokenState copyWith({
    int? id,
    int? position,
    bool? isInHome,
    bool? isFinished,
  }) => TokenState(
    id: id ?? this.id,
    position: position ?? this.position,
    isInHome: isInHome ?? this.isInHome,
    isFinished: isFinished ?? this.isFinished,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'position': position,
    'isInHome': isInHome,
    'isFinished': isFinished,
  };
}

class PlayerState {
  final String userId;
  final PlayerColor color;
  final List<TokenState> tokens;
  final bool isActive;
  final bool isConnected;
  final bool hasRolled;
  final DateTime? lastMoveAt;
  final int consecutiveSixes;
  final bool isBot;
  final BotDifficulty? botDifficulty;
  final int? teamId;

  PlayerState({
    required this.userId,
    required this.color,
    required this.tokens,
    this.isActive = true,
    this.isConnected = true,
    this.hasRolled = false,
    this.lastMoveAt,
    this.consecutiveSixes = 0,
    this.isBot = false,
    this.botDifficulty,
    this.teamId,
  });

  factory PlayerState.fromJson(Map<String, dynamic> json) => PlayerState(
    userId: json['userId'] ?? '',
    color: PlayerColor.values.firstWhere(
      (e) => e.name == json['color'],
      orElse: () => PlayerColor.red,
    ),
    tokens: (json['tokens'] as List).map((e) => TokenState.fromJson(e)).toList(),
    isActive: json['isActive'] ?? true,
    isConnected: json['isConnected'] ?? true,
    hasRolled: json['hasRolled'] ?? false,
    lastMoveAt: json['lastMoveAt'] != null ? DateTime.parse(json['lastMoveAt']) : null,
    consecutiveSixes: json['consecutiveSixes'] ?? 0,
    isBot: json['isBot'] ?? false,
    botDifficulty: json['botDifficulty'] != null 
      ? BotDifficulty.values.firstWhere((e) => e.name == json['botDifficulty'], orElse: () => BotDifficulty.medium)
      : null,
    teamId: json['teamId'],
  );

  factory PlayerState.initial({
    required String userId,
    required PlayerColor color,
    bool isBot = false,
    BotDifficulty? botDifficulty,
    int? teamId,
  }) => PlayerState(
    userId: userId,
    color: color,
    tokens: List.generate(4, (i) => TokenState.initial(i)),
    isBot: isBot,
    botDifficulty: botDifficulty,
    teamId: teamId,
  );

  int get finishedTokens => tokens.where((t) => t.isFinished).length;
  int get homeLaneTokens => tokens.where((t) => t.position >= 52 && t.position <= 55).length;
  int get onBoardTokens => tokens.where((t) => t.position >= 0 && t.position <= 51).length;
  int get homeTokens => tokens.where((t) => t.isInHome).length;

  Map<String, dynamic> toJson() => {
    'userId': userId,
    'color': color.name,
    'tokens': tokens.map((t) => t.toJson()).toList(),
    'isActive': isActive,
    'isConnected': isConnected,
    'hasRolled': hasRolled,
    'lastMoveAt': lastMoveAt?.toIso8601String(),
    'consecutiveSixes': consecutiveSixes,
    'isBot': isBot,
    'botDifficulty': botDifficulty?.name,
    'teamId': teamId,
  };
}

class DiceRoll {
  final int value;
  final DateTime rolledAt;
  final String rolledBy;
  final bool isServerGenerated;
  final String auditId;

  DiceRoll({
    required this.value,
    required this.rolledAt,
    required this.rolledBy,
    this.isServerGenerated = true,
    required this.auditId,
  });

  factory DiceRoll.fromJson(Map<String, dynamic> json) => DiceRoll(
    value: json['value'] ?? 0,
    rolledAt: DateTime.parse(json['rolledAt']),
    rolledBy: json['rolledBy'] ?? '',
    isServerGenerated: json['isServerGenerated'] ?? true,
    auditId: json['auditId'] ?? '',
  );

  Map<String, dynamic> toJson() => {
    'value': value,
    'rolledAt': rolledAt.toIso8601String(),
    'rolledBy': rolledBy,
    'isServerGenerated': isServerGenerated,
    'auditId': auditId,
  };
}

class GameState {
  final String matchId;
  final String? roomId;
  final String? tournamentId;
  final GameMode mode;
  final GameRules rules;
  final List<PlayerState> players;
  final int currentPlayerIndex;
  final DiceRoll? diceRoll;
  final List<LegalMove> legalMoves;
  final List<Move> moveHistory;
  final int stateVersion;
  final MatchStatus status;
  final String? winner;
  final List<String> rankings;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final DateTime createdAt;

  GameState({
    required this.matchId,
    this.roomId,
    this.tournamentId,
    required this.mode,
    required this.rules,
    required this.players,
    required this.currentPlayerIndex,
    this.diceRoll,
    this.legalMoves = const [],
    this.moveHistory = const [],
    this.stateVersion = 1,
    required this.status,
    this.winner,
    this.rankings = const [],
    this.startedAt,
    this.completedAt,
    required this.createdAt,
  });

  factory GameState.fromJson(Map<String, dynamic> json) => GameState(
    matchId: json['matchId'] ?? '',
    roomId: json['roomId'],
    tournamentId: json['tournamentId'],
    mode: GameMode.values.firstWhere(
      (e) => e.name == json['mode'],
      orElse: () => GameMode.vsHuman,
    ),
    rules: GameRules.fromJson(json['rules']),
    players: (json['players'] as List).map((e) => PlayerState.fromJson(e)).toList(),
    currentPlayerIndex: json['currentPlayerIndex'] ?? 0,
    diceRoll: json['diceRoll'] != null ? DiceRoll.fromJson(json['diceRoll']) : null,
    legalMoves: (json['legalMoves'] as List? ?? []).map((e) => LegalMove.fromJson(e)).toList(),
    moveHistory: (json['moveHistory'] as List? ?? []).map((e) => Move.fromJson(e)).toList(),
    stateVersion: json['stateVersion'] ?? 1,
    status: MatchStatus.values.firstWhere(
      (e) => e.name == json['status'],
      orElse: () => MatchStatus.waiting,
    ),
    winner: json['winner'],
    rankings: List<String>.from(json['rankings'] ?? []),
    startedAt: json['startedAt'] != null ? DateTime.parse(json['startedAt']) : null,
    completedAt: json['completedAt'] != null ? DateTime.parse(json['completedAt']) : null,
    createdAt: DateTime.parse(json['createdAt']),
  );

  PlayerState get currentPlayer => players[currentPlayerIndex];
  bool get isMyTurn => false; // Will be set based on current user

  Map<String, dynamic> toJson() => {
    'matchId': matchId,
    'roomId': roomId,
    'tournamentId': tournamentId,
    'mode': mode.name,
    'rules': rules.toJson(),
    'players': players.map((p) => p.toJson()).toList(),
    'currentPlayerIndex': currentPlayerIndex,
    'diceRoll': diceRoll?.toJson(),
    'legalMoves': legalMoves.map((m) => m.toJson()).toList(),
    'moveHistory': moveHistory.map((m) => m.toJson()).toList(),
    'stateVersion': stateVersion,
    'status': status.name,
    'winner': winner,
    'rankings': rankings,
    'startedAt': startedAt?.toIso8601String(),
    'completedAt': completedAt?.toIso8601String(),
    'createdAt': createdAt.toIso8601String(),
  };
}
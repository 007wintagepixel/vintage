// ============================================
// Ludo Nexus - WebSocket Service (Mobile)
// ============================================

import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/game_models.dart';

/// Connection status enum
enum ConnectionStatus {
  disconnected,
  connecting,
  connected,
  reconnecting,
  syncing,
}

/// WebSocket event callback types
typedef OnGameStateCallback = void Function(GameState state);
typedef OnDiceRolledCallback = void Function(DiceRolledEvent data);
typedef OnTokenMovedCallback = void Function(TokenMovedEvent data);
typedef OnTurnChangedCallback = void Function(TurnChangedEvent data);
typedef OnMatchCompletedCallback = void Function(MatchCompletedEvent data);
typedef OnPlayerReconnectedCallback = void Function(PlayerReconnectedEvent data);
typedef OnPlayerDisconnectedCallback = void Function(PlayerDisconnectedEvent data);
typedef OnErrorCallback = void Function(String code, String message);
typedef OnChatMessageCallback = void Function(ChatMessageEvent data);
typedef OnConnectionStatusCallback = void Function(ConnectionStatus status);

/// Event data classes matching server events
class DiceRolledEvent {
  final String userId;
  final DiceRoll diceRoll;
  final List<LegalMove> legalMoves;
  final GameState gameState;

  DiceRolledEvent({
    required this.userId,
    required this.diceRoll,
    required this.legalMoves,
    required this.gameState,
  });

  factory DiceRolledEvent.fromJson(Map<String, dynamic> json) => DiceRolledEvent(
    userId: json['userId'] ?? '',
    diceRoll: DiceRoll.fromJson(json['diceRoll']),
    legalMoves: (json['legalMoves'] as List).map((e) => LegalMove.fromJson(e)).toList(),
    gameState: GameState.fromJson(json['gameState']),
  );
}

class TokenMovedEvent {
  final String userId;
  final Move move;
  final List<CapturedToken> capturedTokens;
  final GameState gameState;

  TokenMovedEvent({
    required this.userId,
    required this.move,
    required this.capturedTokens,
    required this.gameState,
  });

  factory TokenMovedEvent.fromJson(Map<String, dynamic> json) => TokenMovedEvent(
    userId: json['userId'] ?? '',
    move: Move.fromJson(json['move']),
    capturedTokens: (json['capturedTokens'] as List).map((e) => CapturedToken.fromJson(e)).toList(),
    gameState: GameState.fromJson(json['gameState']),
  );
}

class TurnChangedEvent {
  final String nextPlayerId;
  final bool extraTurn;
  final DiceRoll? diceRoll;

  TurnChangedEvent({
    required this.nextPlayerId,
    required this.extraTurn,
    this.diceRoll,
  });

  factory TurnChangedEvent.fromJson(Map<String, dynamic> json) => TurnChangedEvent(
    nextPlayerId: json['nextPlayerId'] ?? '',
    extraTurn: json['extraTurn'] ?? false,
    diceRoll: json['diceRoll'] != null ? DiceRoll.fromJson(json['diceRoll']) : null,
  );
}

class MatchCompletedEvent {
  final String winner;
  final List<String> rankings;
  final GameState gameState;

  MatchCompletedEvent({
    required this.winner,
    required this.rankings,
    required this.gameState,
  });

  factory MatchCompletedEvent.fromJson(Map<String, dynamic> json) => MatchCompletedEvent(
    winner: json['winner'] ?? '',
    rankings: List<String>.from(json['rankings'] ?? []),
    gameState: GameState.fromJson(json['gameState']),
  );
}

class PlayerReconnectedEvent {
  final String userId;
  final GameState gameState;

  PlayerReconnectedEvent({
    required this.userId,
    required this.gameState,
  });

  factory PlayerReconnectedEvent.fromJson(Map<String, dynamic> json) => PlayerReconnectedEvent(
    userId: json['userId'] ?? '',
    gameState: GameState.fromJson(json['gameState']),
  );
}

class PlayerDisconnectedEvent {
  final String userId;

  PlayerDisconnectedEvent({required this.userId});

  factory PlayerDisconnectedEvent.fromJson(Map<String, dynamic> json) => PlayerDisconnectedEvent(
    userId: json['userId'] ?? '',
  );
}

class ChatMessageEvent {
  final String userId;
  final String senderName;
  final PlayerColor senderColor;
  final String content;
  final String timestamp;

  ChatMessageEvent({
    required this.userId,
    required this.senderName,
    required this.senderColor,
    required this.content,
    required this.timestamp,
  });

  factory ChatMessageEvent.fromJson(Map<String, dynamic> json) => ChatMessageEvent(
    userId: json['userId'] ?? '',
    senderName: json['senderName'] ?? '',
    senderColor: PlayerColor.values.firstWhere(
      (e) => e.name == json['senderColor'],
      orElse: () => PlayerColor.red,
    ),
    content: json['content'] ?? '',
    timestamp: json['timestamp'] ?? '',
  );
}

/// WebSocket Service for real-time game communication
class WebSocketService extends ChangeNotifier {
  static final WebSocketService _instance = WebSocketService._internal();
  factory WebSocketService() => _instance;
  WebSocketService._internal();

  // Socket instance
  IO.Socket? _socket;
  
  // Configuration
  static const String _socketNamespace = '/game';
  String? _serverUrl;
  String? _accessToken;
  String? _matchId;
  String? _userId;
  String? _username;
  
  // State
  ConnectionStatus _connectionStatus = ConnectionStatus.disconnected;
  int _reconnectionAttempt = 0;
  static const int _maxReconnectAttempts = 5;
  Timer? _reconnectTimer;
  
  // Game state
  GameState? _gameState;
  PlayerColor? _myColor;
  final List<ChatMessage> _chatMessages = [];
  String? _lastError;
  
  // Callbacks
  OnGameStateCallback? _onGameState;
  OnDiceRolledCallback? _onDiceRolled;
  OnTokenMovedCallback? _onTokenMoved;
  OnTurnChangedCallback? _onTurnChanged;
  OnMatchCompletedCallback? _onMatchCompleted;
  OnPlayerReconnectedCallback? _onPlayerReconnected;
  OnPlayerDisconnectedCallback? _onPlayerDisconnected;
  OnErrorCallback? _onError;
  OnChatMessageCallback? _onChatMessage;
  OnConnectionStatusCallback? _onConnectionStatus;

  // Secure storage for tokens
  static const _storage = FlutterSecureStorage();

  // Getters
  ConnectionStatus get connectionStatus => _connectionStatus;
  int get reconnectionAttempt => _reconnectionAttempt;
  GameState? get gameState => _gameState;
  PlayerColor? get myColor => _myColor;
  List<ChatMessage> get chatMessages => List.unmodifiable(_chatMessages);
  String? get lastError => _lastError;
  bool get isConnected => _connectionStatus == ConnectionStatus.connected;
  bool get isReconnecting => _connectionStatus == ConnectionStatus.reconnecting;
  bool get isSyncing => _connectionStatus == ConnectionStatus.syncing;
  String? get userId => _userId;
  String? get username => _username;

  /// Initialize the service with server URL
  Future<void> initialize(String serverUrl) async {
    _serverUrl = serverUrl;
    
    // Load stored auth token
    _accessToken = await _storage.read(key: 'access_token');
    _userId = await _storage.read(key: 'user_id');
    _username = await _storage.read(key: 'username');
    
    if (kDebugMode) {
      print('[WebSocketService] Initialized with server: $serverUrl');
      print('[WebSocketService] Token: ${_accessToken != null ? 'present' : 'null'}');
      print('[WebSocketService] User: $_userId');
    }
  }

  /// Set authentication credentials
  Future<void> setAuth({
    required String accessToken,
    required String userId,
    required String username,
  }) async {
    _accessToken = accessToken;
    _userId = userId;
    _username = username;
    
    await _storage.write(key: 'access_token', value: accessToken);
    await _storage.write(key: 'user_id', value: userId);
    await _storage.write(key: 'username', value: username);
  }

  /// Clear authentication
  Future<void> clearAuth() async {
    _accessToken = null;
    _userId = null;
    _username = null;
    
    await _storage.delete(key: 'access_token');
    await _storage.delete(key: 'user_id');
    await _storage.delete(key: 'username');
  }

  /// Connect to a match
  Future<void> connectToMatch(String matchId) async {
    if (_socket != null && _socket!.connected) {
      // Already connected, just join the match
      _matchId = matchId;
      _socket!.emit('join_match', {'matchId': matchId});
      return;
    }

    _matchId = matchId;
    await _createSocketConnection();
  }

  /// Create and configure socket connection
  Future<void> _createSocketConnection() async {
    if (_serverUrl == null || _accessToken == null) {
      _setError('CONFIG_ERROR', 'Server URL or auth token not configured');
      return;
    }

    _updateConnectionStatus(ConnectionStatus.connecting);

    // Build socket URL with namespace
    final socketUrl = '$_serverUrl$_socketNamespace';

    if (kDebugMode) {
      print('[WebSocketService] Connecting to: $socketUrl');
    }

    _socket = IO.io(socketUrl, <String, dynamic>{
      'auth': {'token': _accessToken},
      'transports': ['websocket', 'polling'],
      'reconnection': true,
      'reconnectionAttempts': _maxReconnectAttempts,
      'reconnectionDelay': 2000,
      'reconnectionDelayMax': 10000,
      'autoConnect': true,
      'forceNew': true,
    });

    _setupSocketListeners();
  }

  /// Set up all socket event listeners
  void _setupSocketListeners() {
    if (_socket == null) return;

    // Connection events
    _socket!.onConnect((_) {
      if (kDebugMode) print('[WebSocketService] Connected');
      _reconnectionAttempt = 0;
      _updateConnectionStatus(ConnectionStatus.connected);
      
      // Join match room
      if (_matchId != null) {
        _socket!.emit('join_match', {'matchId': _matchId});
      }
    });

    _socket!.onDisconnect((reason) {
      if (kDebugMode) print('[WebSocketService] Disconnected: $reason');
      if (reason == 'io server disconnect') {
        _updateConnectionStatus(ConnectionStatus.reconnecting);
      } else {
        _updateConnectionStatus(ConnectionStatus.disconnected);
      }
    });

    _socket!.onConnectError((error) {
      if (kDebugMode) print('[WebSocketService] Connect error: $error');
      _updateConnectionStatus(ConnectionStatus.reconnecting);
      _reconnectionAttempt++;
    });

    _socket!.onReconnectAttempt((attemptNumber) {
      if (kDebugMode) print('[WebSocketService] Reconnect attempt: $attemptNumber');
      _reconnectionAttempt = attemptNumber;
      _updateConnectionStatus(ConnectionStatus.reconnecting);
    });

    _socket!.onReconnect((_) {
      if (kDebugMode) print('[WebSocketService] Reconnected');
      _reconnectionAttempt = 0;
      _updateConnectionStatus(ConnectionStatus.syncing);
      
      // Re-join match
      if (_matchId != null) {
        _socket!.emit('join_match', {'matchId': _matchId});
      }
    });

    // Game state events
    _socket!.on('match:state', (data) {
      if (kDebugMode) print('[WebSocketService] Received match:state');
      _handleGameState(data);
    });

    _socket!.on('dice_rolled', (data) {
      if (kDebugMode) print('[WebSocketService] Received dice_rolled');
      _handleDiceRolled(data);
    });

    _socket!.on('token_moved', (data) {
      if (kDebugMode) print('[WebSocketService] Received token_moved');
      _handleTokenMoved(data);
    });

    _socket!.on('turn_changed', (data) {
      if (kDebugMode) print('[WebSocketService] Received turn_changed');
      _handleTurnChanged(data);
    });

    _socket!.on('game_completed', (data) {
      if (kDebugMode) print('[WebSocketService] Received game_completed');
      _handleMatchCompleted(data);
    });

    _socket!.on('player_reconnected', (data) {
      if (kDebugMode) print('[WebSocketService] Received player_reconnected');
      _handlePlayerReconnected(data);
    });

    _socket!.on('player_disconnected', (data) {
      if (kDebugMode) print('[WebSocketService] Received player_disconnected');
      _handlePlayerDisconnected(data);
    });

    _socket!.on('match:error', (data) {
      if (kDebugMode) print('[WebSocketService] Received match:error');
      _handleError(data);
    });

    _socket!.on('chat_message', (data) {
      if (kDebugMode) print('[WebSocketService] Received chat_message');
      _handleChatMessage(data);
    });
  }

  // Event handlers
  void _handleGameState(dynamic data) {
    try {
      final state = GameState.fromJson(data);
      _gameState = state;
      
      // Find my color
      final me = state.players.firstWhere(
        (p) => p.userId == _userId,
        orElse: () => state.players.first,
      );
      _myColor = me.color;
      
      _onGameState?.call(state);
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print('[WebSocketService] Error parsing game state: $e');
    }
  }

  void _handleDiceRolled(dynamic data) {
    try {
      final event = DiceRolledEvent.fromJson(data);
      _gameState = event.gameState;
      _onDiceRolled?.call(event);
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print('[WebSocketService] Error parsing dice_rolled: $e');
    }
  }

  void _handleTokenMoved(dynamic data) {
    try {
      final event = TokenMovedEvent.fromJson(data);
      _gameState = event.gameState;
      _onTokenMoved?.call(event);
      
      // Add system messages for captures
      if (event.capturedTokens.isNotEmpty) {
        for (final captured in event.capturedTokens) {
          final systemMsg = ChatMessage(
            id: 'system-${DateTime.now().millisecondsSinceEpoch}-${captured.tokenId}',
            senderId: 'system',
            senderName: 'System',
            senderColor: PlayerColor.red,
            content: 'Token captured and sent home!',
            timestamp: DateTime.now(),
          );
          _chatMessages.add(systemMsg);
        }
      }
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print('[WebSocketService] Error parsing token_moved: $e');
    }
  }

  void _handleTurnChanged(dynamic data) {
    try {
      final event = TurnChangedEvent.fromJson(data);
      
      if (_gameState != null) {
        // Update current player index locally
        final nextPlayerIndex = _gameState!.players.indexWhere(
          (p) => p.userId == event.nextPlayerId,
        );
        
        if (nextPlayerIndex >= 0) {
          _gameState = GameState(
            matchId: _gameState!.matchId,
            roomId: _gameState!.roomId,
            tournamentId: _gameState!.tournamentId,
            mode: _gameState!.mode,
            rules: _gameState!.rules,
            players: _gameState!.players,
            currentPlayerIndex: nextPlayerIndex,
            diceRoll: event.diceRoll,
            legalMoves: _gameState!.legalMoves,
            moveHistory: _gameState!.moveHistory,
            stateVersion: _gameState!.stateVersion,
            status: _gameState!.status,
            winner: _gameState!.winner,
            rankings: _gameState!.rankings,
            startedAt: _gameState!.startedAt,
            completedAt: _gameState!.completedAt,
            createdAt: _gameState!.createdAt,
          );
        }
      }
      
      _onTurnChanged?.call(event);
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print('[WebSocketService] Error parsing turn_changed: $e');
    }
  }

  void _handleMatchCompleted(dynamic data) {
    try {
      final event = MatchCompletedEvent.fromJson(data);
      _gameState = event.gameState;
      _onMatchCompleted?.call(event);
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print('[WebSocketService] Error parsing game_completed: $e');
    }
  }

  void _handlePlayerReconnected(dynamic data) {
    try {
      final event = PlayerReconnectedEvent.fromJson(data);
      _gameState = event.gameState;
      _updateConnectionStatus(ConnectionStatus.connected);
      _onPlayerReconnected?.call(event);
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print('[WebSocketService] Error parsing player_reconnected: $e');
    }
  }

  void _handlePlayerDisconnected(dynamic data) {
    try {
      final event = PlayerDisconnectedEvent.fromJson(data);
      
      if (_gameState != null) {
        _gameState = GameState(
          matchId: _gameState!.matchId,
          roomId: _gameState!.roomId,
          tournamentId: _gameState!.tournamentId,
          mode: _gameState!.mode,
          rules: _gameState!.rules,
          players: _gameState!.players.map((p) => 
            p.userId == event.userId 
              ? PlayerState(
                  userId: p.userId,
                  color: p.color,
                  tokens: p.tokens,
                  isActive: p.isActive,
                  isConnected: false,
                  hasRolled: p.hasRolled,
                  lastMoveAt: p.lastMoveAt,
                  consecutiveSixes: p.consecutiveSixes,
                  isBot: p.isBot,
                  botDifficulty: p.botDifficulty,
                  teamId: p.teamId,
                )
              : p
          ).toList(),
          currentPlayerIndex: _gameState!.currentPlayerIndex,
          diceRoll: _gameState!.diceRoll,
          legalMoves: _gameState!.legalMoves,
          moveHistory: _gameState!.moveHistory,
          stateVersion: _gameState!.stateVersion,
          status: _gameState!.status,
          winner: _gameState!.winner,
          rankings: _gameState!.rankings,
          startedAt: _gameState!.startedAt,
          completedAt: _gameState!.completedAt,
          createdAt: _gameState!.createdAt,
        );
      }
      
      _onPlayerDisconnected?.call(event);
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print('[WebSocketService] Error parsing player_disconnected: $e');
    }
  }

  void _handleError(dynamic data) {
    final code = data['code'] ?? 'UNKNOWN_ERROR';
    final message = data['message'] ?? 'An unknown error occurred';
    _setError(code, message);
    _onError?.call(code, message);
  }

  void _handleChatMessage(dynamic data) {
    try {
      final event = ChatMessageEvent.fromJson(data);
      final msg = ChatMessage(
        id: event.timestamp,
        senderId: event.userId,
        senderName: event.senderName,
        senderColor: event.senderColor,
        content: event.content,
        timestamp: DateTime.parse(event.timestamp),
      );
      _chatMessages.add(msg);
      _onChatMessage?.call(event);
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print('[WebSocketService] Error parsing chat_message: $e');
    }
  }

  // Actions
  Future<void> rollDice() async {
    if (_socket == null || !_socket!.connected || _matchId == null || _gameState == null) return;
    
    final myPlayer = _gameState!.players[_gameState!.currentPlayerIndex];
    if (myPlayer.userId != _userId || myPlayer.hasRolled) return;

    _socket!.emit('roll_dice', {
      'matchId': _matchId,
      'idempotencyKey': 'roll-${DateTime.now().millisecondsSinceEpoch}-${_generateRandomString(8)}',
    });
  }

  Future<void> moveToken(int tokenId, int toPosition) async {
    if (_socket == null || !_socket!.connected || _matchId == null || _gameState == null || _myColor == null) return;

    final myPlayerIndex = _gameState!.players.indexWhere((p) => p.color == _myColor);
    if (myPlayerIndex == -1) return;

    final legalMove = _gameState!.legalMoves.firstWhere(
      (m) => m.tokenId == tokenId,
      orElse: () => LegalMove(tokenId: -1, fromPosition: -1, toPosition: -1),
    );
    if (legalMove.tokenId == -1) return;

    _socket!.emit('move_token', {
      'matchId': _matchId,
      'tokenId': tokenId,
      'toPosition': legalMove.toPosition,
      'gameStateVersion': _gameState!.stateVersion,
      'idempotencyKey': 'move-${DateTime.now().millisecondsSinceEpoch}-${_generateRandomString(8)}',
    });
  }

  Future<void> sendChatMessage(String content) async {
    if (_socket == null || !_socket!.connected || _matchId == null || content.trim().isEmpty) return;
    
    _socket!.emit('send_chat', {
      'matchId': _matchId,
      'content': content.trim(),
    });
  }

  void reconnect() {
    if (_socket != null) {
      _socket!.connect();
    }
  }

  void leaveMatch() {
    if (_socket != null && _matchId != null) {
      _socket!.emit('leave_match', {'matchId': _matchId});
    }
    disconnect();
  }

  void disconnect() {
    if (_reconnectTimer != null) {
      _reconnectTimer!.cancel();
      _reconnectTimer = null;
    }
    
    if (_socket != null) {
      _socket!.disconnect();
      _socket!.dispose();
      _socket = null;
    }
    
    _matchId = null;
    _gameState = null;
    _myColor = null;
    _chatMessages.clear();
    _updateConnectionStatus(ConnectionStatus.disconnected);
  }

  // Callback setters
  void setOnGameState(OnGameStateCallback? callback) => _onGameState = callback;
  void setOnDiceRolled(OnDiceRolledCallback? callback) => _onDiceRolled = callback;
  void setOnTokenMoved(OnTokenMovedCallback? callback) => _onTokenMoved = callback;
  void setOnTurnChanged(OnTurnChangedCallback? callback) => _onTurnChanged = callback;
  void setOnMatchCompleted(OnMatchCompletedCallback? callback) => _onMatchCompleted = callback;
  void setOnPlayerReconnected(OnPlayerReconnectedCallback? callback) => _onPlayerReconnected = callback;
  void setOnPlayerDisconnected(OnPlayerDisconnectedCallback? callback) => _onPlayerDisconnected = callback;
  void setOnError(OnErrorCallback? callback) => _onError = callback;
  void setOnChatMessage(OnChatMessageCallback? callback) => _onChatMessage = callback;
  void setOnConnectionStatus(OnConnectionStatusCallback? callback) => _onConnectionStatus = callback;

  // Helpers
  void _updateConnectionStatus(ConnectionStatus status) {
    if (_connectionStatus != status) {
      _connectionStatus = status;
      _onConnectionStatus?.call(status);
      notifyListeners();
    }
  }

  void _setError(String code, String message) {
    _lastError = '$code: $message';
    notifyListeners();
  }

  String _generateRandomString(int length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return List.generate(length, (index) => chars[DateTime.now().microsecondsSinceEpoch % chars.length]).join();
  }

  @override
  void dispose() {
    disconnect();
    super.dispose();
  }
}

/// Chat Message Model for local storage
class ChatMessage {
  final String id;
  final String senderId;
  final String senderName;
  final PlayerColor senderColor;
  final String content;
  final DateTime timestamp;
  final bool isSystem;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.senderColor,
    required this.content,
    required this.timestamp,
    this.isSystem = false,
  });
}
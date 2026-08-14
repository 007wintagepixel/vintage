// ============================================
// Ludo Nexus - Game Screen (WebSocket Connected)
// ============================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/models/game_models.dart';
import '../../../../core/services/websocket_service.dart' hide ChatMessage;
import '../../../../core/config/app_config.dart';
import '../widgets/game_board.dart';
import '../widgets/dice_widget.dart';
import '../widgets/player_hand.dart';
import '../widgets/sidebar.dart';
import '../widgets/chat_widget.dart';
import '../widgets/reconnection_banner.dart';
import '../widgets/game_over_dialog.dart';
import '../widgets/error_boundary.dart';

class GameScreen extends ConsumerStatefulWidget {
  final String matchId;

  const GameScreen({super.key, required this.matchId});

  @override
  ConsumerState<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends ConsumerState<GameScreen> {
  final _websocketService = WebSocketService();
  GameState? _gameState;
  PlayerColor? _myColor;
  bool _showChat = false;
  bool _disposed = false;

  @override
  void initState() {
    super.initState();
    _setupWebSocket();
  }

  void _setupWebSocket() {
    // Set up callbacks
    _websocketService.setOnConnectionStatus(_handleConnectionStatus);
    _websocketService.setOnGameState(_handleGameState);
    _websocketService.setOnDiceRolled(_handleDiceRolled);
    _websocketService.setOnTokenMoved(_handleTokenMoved);
    _websocketService.setOnTurnChanged(_handleTurnChanged);
    _websocketService.setOnMatchCompleted(_handleMatchCompleted);
    _websocketService.setOnPlayerReconnected(_handlePlayerReconnected);
    _websocketService.setOnPlayerDisconnected(_handlePlayerDisconnected);
    _websocketService.setOnError(_handleError);
    _websocketService.setOnChatMessage(_handleChatMessage);

    // Initialize and connect
    _initializeConnection();
  }

  Future<void> _initializeConnection() async {
    // Get server URL from config
    await AppConfig.initialize();
    final serverUrl = AppConfig.apiBaseUrl;
    
    // Get auth token from secure storage
    final accessToken = AppConfig.getAuthToken();
    final userId = AppConfig.getUserId();
    final username = AppConfig.getUsername();
    
    await _websocketService.initialize(serverUrl);
    
    if (accessToken != null && userId != null && username != null) {
      await _websocketService.setAuth(
        accessToken: accessToken,
        userId: userId,
        username: username,
      );
    }
    
    await _websocketService.connectToMatch(widget.matchId);
  }

  void _handleConnectionStatus(ConnectionStatus status) {
    if (_disposed) return;
    // Connection status is handled by the service's notifier
    // We just need to trigger rebuild
    setState(() {});
  }

  void _handleGameState(GameState state) {
    if (_disposed) return;
    setState(() {
      _gameState = state;
      // Find my color
      final myUserId = _websocketService.userId ?? 'user-1';
      final me = state.players.firstWhere(
        (PlayerState p) => p.userId == myUserId,
        orElse: () => state.players.first,
      );
      _myColor = me.color;
    });
  }

  void _handleDiceRolled(DiceRolledEvent event) {
    if (_disposed) return;
    setState(() {
      _gameState = event.gameState;
    });
  }

  void _handleTokenMoved(TokenMovedEvent event) {
    if (_disposed) return;
    setState(() {
      _gameState = event.gameState;
    });
  }

  void _handleTurnChanged(TurnChangedEvent event) {
    if (_disposed) return;
    setState(() {
      // Turn changed is handled via gameState update
    });
  }

  void _handleMatchCompleted(MatchCompletedEvent event) {
    if (_disposed) return;
    setState(() {
      _gameState = event.gameState;
    });
    _showGameOverDialog(event.winner);
  }

  void _handlePlayerReconnected(PlayerReconnectedEvent event) {
    if (_disposed) return;
    setState(() {
      _gameState = event.gameState;
    });
  }

  void _handlePlayerDisconnected(PlayerDisconnectedEvent event) {
    if (_disposed) return;
    setState(() {
      // Player disconnected handled via gameState update
    });
  }

  void _handleError(String code, String message) {
    if (_disposed) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Error ($code): $message')),
    );
  }

  void _handleChatMessage(ChatMessageEvent event) {
    if (_disposed) return;
    // Chat messages are handled by the service's internal list
    setState(() {});
  }

  Future<void> _handleRollDice() async {
    await _websocketService.rollDice();
  }

  Future<void> _handleTokenClick(int tokenId) async {
    if (_gameState == null || _myColor == null) return;

    final myPlayerIndex = _gameState!.players.indexWhere((p) => p.color == _myColor);
    if (myPlayerIndex == -1) return;

    final legalMove = _gameState!.legalMoves.firstWhere(
      (m) => m.tokenId == tokenId,
      orElse: () => LegalMove(tokenId: -1, fromPosition: -1, toPosition: -1),
    );
    if (legalMove.tokenId == -1) return;

    await _websocketService.moveToken(tokenId, legalMove.toPosition);
  }

  Future<void> _handleSendChat(String content) async {
    await _websocketService.sendChatMessage(content);
  }

  void _handleReconnect() {
    _websocketService.reconnect();
  }

  void _handleLeaveMatch() {
    _websocketService.leaveMatch();
    context.go('/home');
  }

  void _showGameOverDialog(String winnerId) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => GameOverDialog(
        winnerId: winnerId,
        players: _gameState!.players,
        currentUserId: _websocketService.userId ?? 'user-1',
        onBackToDashboard: () {
          Navigator.of(context).pop();
          context.go('/home');
        },
      ),
    );
  }

  @override
  void dispose() {
    _disposed = true;
    _websocketService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final connectionStatus = _websocketService.connectionStatus;
    final isConnected = connectionStatus == ConnectionStatus.connected;
    final isReconnecting = connectionStatus == ConnectionStatus.reconnecting;
    final isSyncing = connectionStatus == ConnectionStatus.syncing;

    if (_gameState == null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              Text(
                isReconnecting 
                  ? 'Reconnecting...' 
                  : isSyncing 
                    ? 'Syncing game state...'
                    : 'Loading game...',
              ),
            ],
          ),
        ),
      );
    }

    final myPlayerIndex = _gameState!.players.indexWhere((p) => p.color == _myColor);
    final myPlayer = myPlayerIndex >= 0 ? _gameState!.players[myPlayerIndex] : null;
    final isMyTurn = myPlayerIndex == _gameState!.currentPlayerIndex;
    final currentPlayer = _gameState!.players[_gameState!.currentPlayerIndex];

    return ErrorBoundary(
      fallbackBuilder: (details) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            const Text('Game Error'),
            const SizedBox(height: 8),
            const Text('Something went wrong. Your game state is saved on the server.'),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () => context.go('/home'),
              child: const Text('Return to Home'),
            ),
          ],
        ),
      ),
      child: Scaffold(
        body: Stack(
          children: [
            // Reconnection Banner
            ReconnectionBanner(
              isReconnecting: isReconnecting || isSyncing,
              onRetry: _handleReconnect,
            ),

            // Main Game Layout
            Row(
              children: [
                // Left Sidebar
                Sidebar(
                  players: _gameState!.players,
                  currentPlayerColor: _myColor!,
                  gameStatus: _gameState!.status.name,
                  onTokenClick: _handleTokenClick,
                  onToggleChat: () => setState(() => _showChat = !_showChat),
                  showChat: _showChat,
                  onLeaveMatch: _handleLeaveMatch,
                ),

                // Main Game Area
                Expanded(
                  child: Column(
                    children: [
                      // Top Bar
                      Container(
                        height: 64,
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.9),
                          border: Border(
                            bottom: BorderSide(color: Colors.grey[800]!, width: 1),
                          ),
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.arrow_back),
                              onPressed: _handleLeaveMatch,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Ludo Nexus',
                              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w700,
                                foreground: Paint()
                                  ..shader = const LinearGradient(
                                    colors: [Color(0xFF22D3EE), Color(0xFFD946EF)],
                                  ).createShader(const Rect.fromLTWH(0, 0, 200, 70)),
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.grey[900],
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.grey[700]!),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: isConnected ? Colors.green : (isReconnecting || isSyncing ? Colors.orange : Colors.red),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    isConnected 
                                      ? 'Connected' 
                                      : isReconnecting 
                                        ? 'Reconnecting...' 
                                        : isSyncing 
                                          ? 'Syncing...'
                                          : 'Disconnected',
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Colors.grey[300],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Game Board
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Stack(
                            children: [
                              Center(
                                child: AspectRatio(
                                  aspectRatio: 1,
                                  child: GameBoard(
                                    gameState: _gameState!,
                                    myColor: _myColor!,
                                    currentPlayerColor: currentPlayer.color,
                                    onTokenClick: _handleTokenClick,
                                  ),
                                ),
                              ),

                              // Dice
                              if (myPlayer != null)
                                Positioned(
                                  bottom: 40,
                                  left: 0,
                                  right: 0,
                                  child: Center(
                                    child: DiceWidget(
                                      value: isMyTurn && _gameState!.diceRoll != null ? _gameState!.diceRoll!.value : null,
                                      isRolling: isMyTurn && _gameState!.diceRoll == null && myPlayer.hasRolled,
                                      canRoll: isMyTurn && !myPlayer.hasRolled && _gameState!.status == MatchStatus.inProgress,
                                      onRoll: _handleRollDice,
                                      playerColor: _myColor!,
                                    ),
                                  ),
                                ),

                              // Game Over Overlay
                              if (_gameState!.status == MatchStatus.completed && _gameState!.winner != null)
                                GameOverDialog(
                                  winnerId: _gameState!.winner!,
                                  players: _gameState!.players,
                                  currentUserId: _websocketService.userId ?? 'user-1',
                                  onBackToDashboard: () => context.go('/home'),
                                ),
                            ],
                          ),
                        ),
                      ),

                      // Player Hand (for current player)
                      if (myPlayer != null && !_showChat)
                        Positioned(
                          bottom: 20,
                          right: 20,
                          child: PlayerHand(
                            tokens: myPlayer.tokens.map((t) => TokenInfo(
                                id: t.id,
                                position: t.position,
                                isLegal: _gameState!.legalMoves.any((m) => m.tokenId == t.id),
                                isFinished: t.isFinished,
                              )).toList(),
                            color: _myColor!,
                            isCurrentPlayer: isMyTurn,
                            onTokenClick: _handleTokenClick,
                          ),
                        ),
                    ],
                  ),
                ),

                // Right Sidebar - Chat
                if (_showChat)
                  Container(
                    width: 360,
                    decoration: BoxDecoration(
                      color: Colors.black,
                      border: Border(
                        left: BorderSide(color: Colors.grey[800]!, width: 1),
                      ),
                    ),
                    child: ChatWidget(
                      messages: _websocketService.chatMessages.map((m) => ChatMessage(
                        id: m.id,
                        senderId: m.senderId,
                        senderName: m.senderName,
                        senderColor: m.senderColor,
                        content: m.content,
                        timestamp: m.timestamp,
                      )).toList(),
                      onSend: _handleSendChat,
                      currentUserId: _websocketService.userId ?? 'user-1',
                      currentUserColor: _myColor!,
                      currentUserName: _websocketService.username ?? 'You',
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// Chat Message Model - now imported from chat_widget.dart

// Token Info for PlayerHand widget - now imported from player_hand.dart
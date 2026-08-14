// ============================================
// Ludo Nexus - Sidebar Widget
// ============================================

import 'package:flutter/material.dart';

import '../../../../../core/models/game_models.dart';
import 'player_hand.dart';

class Sidebar extends StatelessWidget {
  final List<PlayerState> players;
  final PlayerColor currentPlayerColor;
  final String gameStatus;
  final Function(int) onTokenClick;
  final VoidCallback onToggleChat;
  final bool showChat;
  final VoidCallback onLeaveMatch;

  const Sidebar({
    super.key,
    required this.players,
    required this.currentPlayerColor,
    required this.gameStatus,
    required this.onTokenClick,
    required this.onToggleChat,
    required this.showChat,
    required this.onLeaveMatch,
  });

  @override
  Widget build(BuildContext context) {
    final currentPlayer = players.firstWhere(
      (p) => p.color == currentPlayerColor,
      orElse: () => players.first,
    );

    return Container(
      width: 280,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [const Color(0xFF111827), const Color(0xFF0C0A09)],
        ),
        border: Border(
          right: BorderSide(color: Colors.grey[800]!),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Players',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Colors.white,
                ),
              ),
              TextButton.icon(
                onPressed: onToggleChat,
                icon: const Icon(Icons.chat, size: 18),
                label: const Text('Chat'),
                style: TextButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: Colors.grey[800],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Current turn indicator
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  PlayerHand.PLAYER_COLORS[currentPlayerColor]!.withValues(alpha: 0.1),
                  PlayerHand.PLAYER_COLORS[currentPlayerColor]!.withValues(alpha: 0.05),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: PlayerHand.PLAYER_COLORS[currentPlayerColor]!.withValues(alpha: 0.4),
              ),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            PlayerHand.PLAYER_COLORS[currentPlayerColor]!.withValues(alpha: 0.8),
                            PlayerHand.PLAYER_COLORS[currentPlayerColor]!,
                          ],
                        ),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          currentPlayer.userId[0].toUpperCase(),
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Player ${currentPlayer.userId.substring(0, 8)}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: Colors.white,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            gameStatus == 'in_progress' 
                                ? 'Current Turn' 
                                : gameStatus == 'completed' 
                                    ? 'Winner! 🏆' 
                                    : 'Game Starting...',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey[400],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Dice display placeholder
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: Colors.grey[900],
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: PlayerHand.PLAYER_COLORS[currentPlayerColor]!,
                      width: 3,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: PlayerHand.PLAYER_COLORS[currentPlayerColor]!.withValues(alpha: 0.4),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      '?',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: PlayerHand.PLAYER_COLORS[currentPlayerColor]!,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Player panels
          ...players.map((player) => _buildPlayerPanel(player)).toList(),

          const SizedBox(height: 24),

          // Leave button
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: onLeaveMatch,
              icon: const Icon(Icons.logout, size: 18),
              label: const Text('Leave Match'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.red[400],
                side: BorderSide(color: Colors.red[400]!),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerPanel(PlayerState player) {
    final colorConfig = PlayerHand.PLAYER_COLORS[player.color]!;
    final isCurrentTurn = player.color == currentPlayerColor;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            colorConfig.withValues(alpha: 0.1),
            colorConfig.withValues(alpha: 0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: player.color == currentPlayerColor 
              ? colorConfig.withValues(alpha: 0.6)
              : colorConfig.withValues(alpha: 0.2),
          width: player.color == currentPlayerColor ? 2 : 1,
        ),
        boxShadow: player.color == currentPlayerColor
            ? [
                BoxShadow(
                  color: colorConfig.withValues(alpha: 0.3),
                  blurRadius: 20,
                ),
              ]
            : null,
      ),
      child: Column(
        children: [
          // Player header
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      colorConfig.withValues(alpha: 0.8),
                      colorConfig,
                    ],
                  ),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    player.userId[0].toUpperCase(),
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          'Player ${player.userId.substring(0, 8)}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: Colors.white,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        if (player.isBot) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                            decoration: BoxDecoration(
                              color: Colors.grey[800],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'BOT',
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey[400],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    Text(
                      player.color == currentPlayerColor ? 'Your Turn' : 'Waiting',
                      style: TextStyle(
                        fontSize: 11,
                        color: player.color == currentPlayerColor ? colorConfig : Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Token status
          Row(
            children: [
              _buildStatusCell(player.tokens.where((t) => t.isFinished).length, 'Home', colorConfig, true),
              _buildStatusCell(player.tokens.where((t) => t.position >= 52 && t.position <= 55).length, 'Lane', colorConfig, true),
              _buildStatusCell(player.tokens.where((t) => t.position >= 0 && t.position <= 51).length, 'Board', colorConfig, true),
              _buildStatusCell(player.tokens.where((t) => t.isInHome).length, 'Base', colorConfig, true),
            ],
          ),
          const SizedBox(height: 12),

          // Token buttons (only for current player's turn)
          if (player.color == currentPlayerColor)
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: player.tokens.asMap().entries.map((entry) {
                final index = entry.key;
                final token = entry.value;
                final isLegal = token.position != -1 && !token.isFinished;
                final isFinished = token.isFinished;
                
                return AnimatedScale(
                  scale: !token.isFinished ? 1.05 : 1.0,
                  duration: const Duration(milliseconds: 100),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: token.isFinished ? null : () => onTokenClick(index),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          gradient: token.isFinished
                              ? LinearGradient(
                                  colors: [
                                    PlayerHand.PLAYER_COLORS[player.color]!.withValues(alpha: 0.8),
                                    PlayerHand.PLAYER_COLORS[player.color]!,
                                  ],
                                )
                              : LinearGradient(
                                  colors: [
                                    colorConfig.withValues(alpha: 0.1),
                                    colorConfig.withValues(alpha: 0.3),
                                  ],
                                ),
                          color: token.isFinished ? null : Colors.grey[200],
                          border: Border.all(
                            color: token.isFinished
                                ? PlayerHand.PLAYER_COLORS[player.color]!
                                : colorConfig,
                            width: 2,
                          ),
                          boxShadow: token.isFinished
                              ? [
                                  BoxShadow(
                                    color: PlayerHand.PLAYER_COLORS[player.color]!.withValues(alpha: 0.3),
                                    blurRadius: 12,
                                    spreadRadius: 1,
                                  ),
                                ]
                              : null,
                        ),
                        child: Center(
                          child: token.isFinished
                              ? const Icon(
                                  Icons.check,
                                  color: Colors.white,
                                  size: 18,
                                )
                              : Text(
                                  '${index + 1}',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: colorConfig,
                                  ),
                                ),
                        ),
                      ),
                    ),
                  );
              }).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildStatusCell(int count, String label, Color color, bool active) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Text(
              '$count',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                fontSize: 9,
                color: Colors.grey[600],
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      );
  }
}
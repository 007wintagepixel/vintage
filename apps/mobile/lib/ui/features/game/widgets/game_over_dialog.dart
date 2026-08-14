// ============================================
// Ludo Nexus - Game Over Dialog
// ============================================

import 'package:flutter/material.dart';

import '../../../../../core/models/game_models.dart';

class GameOverDialog extends StatelessWidget {
  final String winnerId;
  final List<PlayerState> players;
  final String currentUserId;
  final VoidCallback onBackToDashboard;

  const GameOverDialog({
    super.key,
    required this.winnerId,
    required this.players,
    required this.currentUserId,
    required this.onBackToDashboard,
  });

  static const Map<PlayerColor, Color> PLAYER_COLORS = {
    PlayerColor.red: Color(0xFFEF4444),
    PlayerColor.green: Color(0xFF22C55E),
    PlayerColor.yellow: Color(0xFFEAB308),
    PlayerColor.blue: Color(0xFF3B82F6),
  };

  @override
  Widget build(BuildContext context) {
    final winner = players.firstWhere(
      (p) => p.userId == winnerId,
      orElse: () => players.first,
    );
    final isWinner = winnerId == currentUserId;

    return Container(
      color: Colors.black.withValues(alpha: 0.8),
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(24),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF111827),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.grey[700]!),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.5),
                blurRadius: 60,
                spreadRadius: 10,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Trophy
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFFFBBF24),
                      const Color(0xFFF59E0B),
                    ],
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFBBF24).withValues(alpha: 0.5),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: const Center(
                  child: Text(
                    '🏆',
                    style: TextStyle(fontSize: 40),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Title
              Text(
                'Game Complete!',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  foreground: Paint()
                    ..shader = LinearGradient(
                      colors: [
                        const Color(0xFF22D3EE),
                        const Color(0xFFFBBF24),
                      ],
                    ).createShader(const Rect.fromLTWH(0, 0, 200, 70)),
              ),
              ),
              const SizedBox(height: 8),

              // Winner message
              Text(
                isWinner ? 'You Won! 🎉' : '${winner.userId.substring(0, 8)} Wins!',
                style: TextStyle(
                  fontSize: 18,
                  color: isWinner ? const Color(0xFFFBBF24) : Colors.white,
                ),
              ),
              const SizedBox(height: 24),

              // Rankings
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1F2937),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey[700]!),
                ),
                child: Column(
                  children: players.asMap().entries.map((entry) {
                    final rank = entry.key + 1;
                    final player = entry.value;
                    final isWinner = player.userId == winnerId;
                    final isMe = player.userId == currentUserId;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: isMe
                            ? const Color(0xFF3B82F6).withValues(alpha: 0.1)
                            : const Color(0xFF1F2937),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isMe
                              ? const Color(0xFF3B82F6)
                              : Colors.grey[700]!,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: isWinner
                                  ? const Color(0xFFFBBF24)
                                  : rank == 2
                                      ? Colors.grey[500]
                                      : rank == 3
                                          ? Colors.red[700]
                                          : Colors.grey[700],
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                '$rank',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: isWinner ? Colors.black : Colors.white,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Player ${player.userId.substring(0, 8)}',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                color: isMe ? const Color(0xFF3B82F6) : Colors.white,
                              ),
                            ),
                          ),
                          if (isWinner)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFBBF24).withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                'WINNER',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: const Color(0xFFFBBF24),
                                ),
                              ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 24),

              // Back to dashboard button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: onBackToDashboard,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3B82F6),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Back to Dashboard',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
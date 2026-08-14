// ============================================
// Ludo Nexus - Player Hand Widget
// ============================================

import 'package:flutter/material.dart';

import '../../../../../core/models/game_models.dart';

class TokenInfo {
  final int id;
  final int position;
  final bool isLegal;
  final bool isFinished;

  TokenInfo({
    required this.id,
    required this.position,
    required this.isLegal,
    required this.isFinished,
  });
}

class PlayerHand extends StatelessWidget {
  final List<TokenInfo> tokens;
  final PlayerColor color;
  final bool isCurrentPlayer;
  final Function(int) onTokenClick;

  const PlayerHand({
    super.key,
    required this.tokens,
    required this.color,
    required this.isCurrentPlayer,
    required this.onTokenClick,
  });

  static const Map<PlayerColor, Color> PLAYER_COLORS = {
    PlayerColor.red: Color(0xFFEF4444),
    PlayerColor.green: Color(0xFF22C55E),
    PlayerColor.yellow: Color(0xFFEAB308),
    PlayerColor.blue: Color(0xFF3B82F6),
  };

  @override
  Widget build(BuildContext context) {
    if (!isCurrentPlayer) {
      return const SizedBox.shrink();
    }

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 300),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: _buildTokenWidgets(),
        ),
      ),
    );
  }

  List<Widget> _buildTokenWidgets() {
    final widgets = <Widget>[];
    for (int i = 0; i < tokens.length; i++) {
      widgets.add(_buildTokenWidget(tokens[i]));
    }
    return widgets;
  }

  Widget _buildTokenWidget(TokenInfo token) {
    final isFinished = token.isFinished;
    final isLegal = token.isLegal;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: AnimatedScale(
        scale: isLegal && !isFinished ? 1.1 : 1.0,
        duration: const Duration(milliseconds: 200),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isFinished || !isLegal ? null : () => onTokenClick(token.id),
            borderRadius: BorderRadius.circular(12),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 48,
              height: 48,
              decoration: _buildDecoration(isFinished, isLegal),
              child: Center(
                child: isFinished
                    ? const Icon(Icons.check, color: Colors.white, size: 24)
                    : Text(
                        '${token.id + 1}',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: isFinished
                              ? Colors.white
                              : isLegal
                                  ? PLAYER_COLORS[color]!
                                  : Colors.grey[400],
                        ),
                      ),
              ),
            ),
          ),
        );
      });
    }
  }

  BoxDecoration _buildDecoration(bool isFinished, bool isLegal) {
    final colorValue = PLAYER_COLORS[color]!;
    
    return BoxDecoration(
      borderRadius: BorderRadius.circular(12),
      gradient: isFinished
          ? LinearGradient(
              colors: [
                colorValue.withValues(alpha: 0.8),
                colorValue,
              ],
            )
          : isLegal
              ? LinearGradient(
                  colors: [
                    colorValue.withValues(alpha: 0.1),
                    colorValue.withValues(alpha: 0.3),
                  ],
                )
              : null,
      color: isFinished || isLegal ? null : Colors.grey[200],
      border: Border.all(
        color: isLegal
            ? colorValue
            : isFinished
                ? colorValue
                : Colors.grey[300]!,
        width: 2,
      ),
      boxShadow: isLegal
          ? [
              BoxShadow(
                color: colorValue.withValues(alpha: 0.4),
                blurRadius: 15,
                spreadRadius: 2,
              ),
            ]
          : isFinished
              ? [
                  BoxShadow(
                    color: colorValue.withValues(alpha: 0.3),
                    blurRadius: 12,
                    spreadRadius: 1,
                  ),
                ]
              : null,
    );
  }
}
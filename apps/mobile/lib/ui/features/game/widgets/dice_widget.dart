// ============================================
// Ludo Nexus - Dice Widget
// ============================================

import 'package:flutter/material.dart';

import '../../../../../core/models/game_models.dart';

class DiceWidget extends StatelessWidget {
  final int? value;
  final bool isRolling;
  final bool canRoll;
  final VoidCallback onRoll;
  final PlayerColor playerColor;

  const DiceWidget({
    super.key,
    required this.value,
    required this.isRolling,
    required this.canRoll,
    required this.onRoll,
    required this.playerColor,
  });

  static const Map<PlayerColor, Color> PLAYER_COLORS = {
    PlayerColor.red: Color(0xFFEF4444),
    PlayerColor.green: Color(0xFF22C55E),
    PlayerColor.yellow: Color(0xFFEAB308),
    PlayerColor.blue: Color(0xFF3B82F6),
  };

  @override
  Widget build(BuildContext context) {
    final colorConfig = PLAYER_COLORS[playerColor]!;

    final diceFaces = [
      [{'x': 0.5, 'y': 0.5}],
      [{'x': 0.25, 'y': 0.25}, {'x': 0.75, 'y': 0.75}],
      [{'x': 0.25, 'y': 0.25}, {'x': 0.5, 'y': 0.5}, {'x': 0.75, 'y': 0.75}],
      [{'x': 0.25, 'y': 0.25}, {'x': 0.75, 'y': 0.25}, {'x': 0.25, 'y': 0.75}, {'x': 0.75, 'y': 0.75}],
      [{'x': 0.25, 'y': 0.25}, {'x': 0.75, 'y': 0.25}, {'x': 0.5, 'y': 0.5}, {'x': 0.25, 'y': 0.75}, {'x': 0.75, 'y': 0.75}],
      [{'x': 0.25, 'y': 0.25}, {'x': 0.75, 'y': 0.25}, {'x': 0.25, 'y': 0.5}, {'x': 0.75, 'y': 0.5}, {'x': 0.25, 'y': 0.75}, {'x': 0.75, 'y': 0.75}],
    ];

    final dots = value != null ? diceFaces[value! - 1] : diceFaces[0];

    return GestureDetector(
      onTap: canRoll ? onRoll : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.white, Colors.grey[100]!],
          ),
          border: Border.all(color: colorConfig, width: 3),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 24,
              offset: const Offset(0, 8),
            ),
            BoxShadow(
              color: Colors.white.withOpacity(0.5),
              blurRadius: 4,
              offset: const Offset(0, -2),
            ),
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 0,
              spreadRadius: 1,
            ),
          ],
        ),
        child: Stack(
          children: [
            Center(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: dots.map((dot) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        if (dot['x']! < 0.5)
                          _buildDot(dot['x']!, dot['y']!, colorConfig)
                        else
                          const Spacer(),
                        if (dot['x']! > 0.5)
                          _buildDot(dot['x']!, dot['y']!, colorConfig)
                        else if (dot['x']! == 0.5)
                          _buildDot(dot['x']!, dot['y']!, colorConfig),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ),
            if (isRolling)
              Center(
                child: Text(
                  'ROLLING...',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: colorConfig,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDot(double x, double y, Color color) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: 10,
      height: 10,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          center: Alignment(-0.3, -0.3),
          radius: 1.0,
          colors: [Colors.white, color],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
    );
  }
}
// ============================================
// Ludo Nexus - Game Board Widget
// ============================================

import 'package:flutter/material.dart';

import '../../../../../core/models/game_models.dart';
import '../../../../../core/game/game_engine.dart';

class GameBoard extends StatefulWidget {
  final GameState gameState;
  final PlayerColor myColor;
  final PlayerColor currentPlayerColor;
  final Function(int) onTokenClick;

  const GameBoard({
    super.key,
    required this.gameState,
    required this.myColor,
    required this.currentPlayerColor,
    required this.onTokenClick,
  });

  @override
  State<GameBoard> createState() => _GameBoardState();
}

class _GameBoardState extends State<GameBoard> {
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: GameBoardPainter(
        gameState: widget.gameState,
        myColor: widget.myColor,
        currentPlayerColor: widget.currentPlayerColor,
        onTokenClick: widget.onTokenClick,
      ),
      child: Container(),
    );
  }
}

// Custom Painter for the Ludo Board
class GameBoardPainter extends CustomPainter {
  final GameState gameState;
  final PlayerColor myColor;
  final PlayerColor currentPlayerColor;
  final Function(int) onTokenClick;

  static const double BOARD_SIZE = 52;
  static const double TOKEN_RADIUS = 16.0;
  static const double CELL_SIZE = 40.0;
  static const double BOARD_PADDING = 60.0;

  static const Map<PlayerColor, Color> PLAYER_COLORS = {
    PlayerColor.red: Color(0xFFEF4444),
    PlayerColor.green: Color(0xFF22C55E),
    PlayerColor.yellow: Color(0xFFEAB308),
    PlayerColor.blue: Color(0xFF3B82F6),
  };

  static const List<int> SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];
  static const Map<PlayerColor, int> START_POSITIONS = {
    PlayerColor.red: 0,
    PlayerColor.green: 13,
    PlayerColor.yellow: 26,
    PlayerColor.blue: 39,
  };
  static const Map<PlayerColor, int> HOME_LANE_ENTRY = {
    PlayerColor.red: 51,
    PlayerColor.green: 12,
    PlayerColor.yellow: 25,
    PlayerColor.blue: 38,
  };

  GameBoardPainter({
    required this.gameState,
    required this.myColor,
    required this.currentPlayerColor,
    required this.onTokenClick,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final centerX = size.width / 2;
    final centerY = size.height / 2;
    final boardScale = (size.width - BOARD_PADDING * 2) / (CELL_SIZE * 18);

    _drawBoard(canvas, size, centerX, centerY, boardScale);
    _drawTokens(canvas, size, centerX, centerY, boardScale);
  }

  void _drawBoard(Canvas canvas, Size size, double centerX, double centerY, double scale) {
    // Draw background
    final backgroundPaint = Paint()..color = const Color(0xFF0C0A09);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), backgroundPaint);

    // Draw four arms of the cross
    final armPaint = Paint()..color = const Color(0xFF1F2937);
    final armWidth = CELL_SIZE * 6 * scale;
    final armLength = CELL_SIZE * 6 * scale;

    // Horizontal arms
    canvas.drawRect(
      Rect.fromLTWH(
        centerX - CELL_SIZE * 12 * scale,
        centerY - armWidth / 2,
        armLength,
        armWidth,
      ),
      armPaint,
    );
    canvas.drawRect(
      Rect.fromLTWH(
        centerX + CELL_SIZE * 6 * scale,
        centerY - armWidth / 2,
        armLength,
        armWidth,
      ),
      armPaint,
    );

    // Vertical arms
    canvas.drawRect(
      Rect.fromLTWH(
        centerX - armWidth / 2,
        centerY - CELL_SIZE * 12 * scale,
        armWidth,
        armLength,
      ),
      armPaint,
    );
    canvas.drawRect(
      Rect.fromLTWH(
        centerX - armWidth / 2,
        centerY + CELL_SIZE * 6 * scale,
        armWidth,
        armLength,
      ),
      armPaint,
    );

    // Draw track cells
    for (int i = 0; i < 52; i++) {
      final pos = _getTrackCoordinates(i, centerX, centerY, scale);
      final isSafe = SAFE_CELLS.contains(i);
      final isStart = START_POSITIONS.values.contains(i);

      final cellPaint = Paint()
        ..color = isSafe
            ? const Color(0xFF22D3EE).withOpacity(0.25)
            : isStart
                ? const Color(0xFFFBBF24).withOpacity(0.25)
                : const Color(0xFF374151);
      canvas.drawCircle(pos, CELL_SIZE * scale * 0.35, cellPaint);

      final strokePaint = Paint()
        ..color = isSafe
            ? const Color(0xFF22D3EE)
            : isStart
                ? const Color(0xFFFBBF24)
                : const Color(0xFF4B5563)
        ..style = PaintingStyle.stroke
        ..strokeWidth = (isSafe || isStart ? 2 : 1) * scale;
      canvas.drawCircle(pos, CELL_SIZE * scale * 0.35, strokePaint);
    }

    // Draw home lanes
    _drawHomeLanes(canvas, centerX, centerY, scale);

    // Draw center area
    _drawCenter(canvas, centerX, centerY, scale);

    // Draw safe cell indicators
    for (int cellIndex in SAFE_CELLS) {
      final pos = _getTrackCoordinates(cellIndex, centerX, centerY, scale);
      final safePaint = Paint()
        ..color = const Color(0xFF22D3EE)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2 * scale;
      canvas.drawCircle(pos, CELL_SIZE * scale * 0.45, safePaint);
    }
  }

  void _drawHomeLanes(Canvas canvas, double centerX, double centerY, double scale) {
    const laneOffset = 30.0;
    const laneWidth = 24.0;

    final colors = {
      PlayerColor.red: const Color(0xFFEF4444),
      PlayerColor.green: const Color(0xFF22C55E),
      PlayerColor.yellow: const Color(0xFFEAB308),
      PlayerColor.blue: const Color(0xFF3B82F6),
    };

    colors.forEach((color, colorValue) {
      for (int i = 0; i < 4; i++) {
        double x, y;
        switch (color) {
          case PlayerColor.red:
            x = centerX - laneOffset * (4 - i) * scale - laneWidth * scale / 2;
            y = centerY - laneWidth * scale / 2;
            break;
          case PlayerColor.green:
            x = centerX - laneWidth * scale / 2;
            y = centerY - laneOffset * (4 - i) * scale - laneWidth * scale / 2;
            break;
          case PlayerColor.yellow:
            x = centerX + laneOffset * (4 - i) * scale - laneWidth * scale / 2;
            y = centerY - laneWidth * scale / 2;
            break;
          case PlayerColor.blue:
            x = centerX - laneWidth * scale / 2;
            y = centerY + laneOffset * (4 - i) * scale - laneWidth * scale / 2;
            break;
        }

        final lanePaint = Paint()..color = colorValue.withOpacity(0.12);
        canvas.drawRect(
          Rect.fromLTWH(x, y, laneWidth * scale, laneWidth * scale),
          lanePaint,
        );
        final strokePaint = Paint()
          ..color = colorValue
          ..style = PaintingStyle.stroke
          ..strokeWidth = scale;
        canvas.drawRect(
          Rect.fromLTWH(x, y, laneWidth * scale, laneWidth * scale),
          strokePaint,
        );
      }
    });
  }

  void _drawCenter(Canvas canvas, double centerX, double centerY, double scale) {
    const size = 6.0;
    final centerSize = CELL_SIZE * size * scale;

    // Center square
    final centerPaint = Paint()..color = const Color(0xFF111827);
    canvas.drawRect(
      Rect.fromLTWH(
        centerX - centerSize / 2,
        centerY - centerSize / 2,
        centerSize,
        centerSize,
      ),
      centerPaint,
    );

    // Four triangles
    const triangleSize = 3.0;
    final triSize = CELL_SIZE * triangleSize * scale;

    final colors = {
      PlayerColor.red: const Color(0xFFEF4444),
      PlayerColor.green: const Color(0xFF22C55E),
      PlayerColor.yellow: const Color(0xFFEAB308),
      PlayerColor.blue: const Color(0xFF3B82F6),
    };

    colors.forEach((color, colorValue) {
      final path = Path();
      switch (color) {
        case PlayerColor.red:
          path.moveTo(centerX - triSize, centerY - triSize);
          path.lineTo(centerX + triSize, centerY);
          path.lineTo(centerX - triSize, centerY + triSize);
          break;
        case PlayerColor.green:
          path.moveTo(centerX - triSize, centerY - triSize);
          path.lineTo(centerX, centerY - triSize);
          path.lineTo(centerX, centerY + triSize);
          break;
        case PlayerColor.yellow:
          path.moveTo(centerX + triSize, centerY - triSize);
          path.lineTo(centerX - triSize, centerY);
          path.lineTo(centerX + triSize, centerY + triSize);
          break;
        case PlayerColor.blue:
          path.moveTo(centerX - triSize, centerY - triSize);
          path.lineTo(centerX + triSize, centerY - triSize);
          path.lineTo(centerX, centerY + triSize);
          break;
      }
      path.close();

      final trianglePaint = Paint()
        ..color = colorValue.withOpacity(0.18)
        ..style = PaintingStyle.fill;
      canvas.drawPath(path, trianglePaint);
    });
  }

  void _drawTokens(Canvas canvas, Size size, double centerX, double centerY, double scale) {
    final allTokens = <_TokenDrawData>[];

    for (final player in gameState.players) {
      for (final token in player.tokens) {
        final position = _getTokenPosition(token, player.color, centerX, centerY, scale);
        allTokens.add(_TokenDrawData(
          position: position,
          color: player.color,
          tokenId: token.id,
          playerId: player.userId,
        ));
      }
    }

    // Sort tokens so tokens in home lanes are drawn on top
    allTokens.sort((a, b) {
      final aInLane = _isInHomeLane(a.tokenId, a.position.dx, a.position.dy);
      final bInLane = _isInHomeLane(b.tokenId, b.position.dx, b.position.dy);
      if (aInLane != bInLane) return aInLane ? 1 : -1;
      return 0;
    });

    for (final token in allTokens) {
      _drawToken(canvas, token, scale);
    }
  }

  void _drawToken(Canvas canvas, _TokenDrawData token, double scale) {
    final tokenRadius = TOKEN_RADIUS * scale;
    final colorValue = PLAYER_COLORS[token.color]!;

    // Token shadow
    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.4)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
    canvas.drawCircle(
      token.position.translate(2 * scale, 2 * scale),
      tokenRadius,
      shadowPaint,
    );

    // Token gradient
    final gradient = RadialGradient(
      center: Alignment(-0.3, -0.3),
      radius: 1.0,
      colors: [
        Colors.white.withOpacity(0.3),
        colorValue,
      ],
    );

    final tokenPaint = Paint()
      ..shader = gradient.createShader(
        Rect.fromCircle(center: token.position, radius: tokenRadius),
      );

    final borderPaint = Paint()
      ..color = colorValue.withOpacity(0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2 * scale;

    canvas.drawCircle(token.position, tokenRadius, tokenPaint);
    canvas.drawCircle(token.position, tokenRadius, borderPaint);

    // Token number
    final textPainter = TextPainter(
      text: TextSpan(
        text: '${token.tokenId + 1}',
        style: TextStyle(
          color: Colors.white,
          fontSize: 14 * scale,
          fontWeight: FontWeight.bold,
        ),
      ),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(
      canvas,
      token.position - Offset(textPainter.width / 2, textPainter.height / 2),
    );
  }

  Offset _getTokenPosition(TokenState token, PlayerColor color, double centerX, double centerY, double scale) {
    if (isInHome(token.position)) {
      return _getHomePosition(color, token.id, centerX, centerY, scale);
    } else if (isFinished(token.position)) {
      return Offset(centerX, centerY);
    } else if (isInHomeLane(token.position)) {
      return _getHomeLanePosition(color, token.position - 52, centerX, centerY, scale);
    } else {
      return _getTrackPosition(token.position, centerX, centerY, scale);
    }
  }

  Offset _getTrackPosition(int index, double centerX, double centerY, double scale) {
    if (index < 0 || index >= 52) return Offset(-100, -100);

    final perimeter = 52.0;
    final progress = index / perimeter;
    final side = (progress * 4).floor();
    final sideProgress = (progress * 4) % 1;
    final sideIndex = (sideProgress * 13).floor();

    double x, y;
    final offset = centerX - CELL_SIZE * 6 * scale;

    switch (side) {
      case 0:
        x = offset + CELL_SIZE * 6 * scale + sideIndex * CELL_SIZE * scale;
        y = centerY - CELL_SIZE * 6 * scale;
        break;
      case 1:
        x = centerX + CELL_SIZE * 6 * scale;
        y = centerY - CELL_SIZE * 6 * scale + sideIndex * CELL_SIZE * scale;
        break;
      case 2:
        x = centerX + CELL_SIZE * 6 * scale - sideIndex * CELL_SIZE * scale;
        y = centerY + CELL_SIZE * 6 * scale;
        break;
      case 3:
        x = centerX - CELL_SIZE * 6 * scale;
        y = centerY + CELL_SIZE * 6 * scale - sideIndex * CELL_SIZE * scale;
        break;
      default:
        x = centerX;
        y = centerY;
    }

    return Offset(x + CELL_SIZE * scale / 2, y + CELL_SIZE * scale / 2);
  }

  Offset _getHomeLanePosition(PlayerColor color, int laneIndex, double centerX, double centerY, double scale) {
    const laneOffset = 30.0;
    final laneWidth = 24.0;

    double x, y;
    switch (color) {
      case PlayerColor.red:
        return Offset(
          centerX - (laneOffset * (4 - laneIndex) + 12) * scale,
          centerY,
        );
      case PlayerColor.green:
        return Offset(
          centerX,
          centerY - (laneOffset * (4 - laneIndex) + 12) * scale,
        );
      case PlayerColor.yellow:
        return Offset(
          centerX + (laneOffset * (4 - laneIndex) + 12) * scale,
          centerY,
        );
      case PlayerColor.blue:
        return Offset(
          centerX,
          centerY + (laneOffset * (4 - laneIndex) + 12) * scale,
        );
    }
  }

  Offset _getHomePosition(PlayerColor color, int tokenIndex, double centerX, double centerY, double scale) {
    final basePositions = {
      PlayerColor.red: [
        Offset(-10.5, -10.5),
        Offset(-6.5, -10.5),
        Offset(-10.5, -6.5),
        Offset(-6.5, -6.5),
      ],
      PlayerColor.green: [
        Offset(6.5, -10.5),
        Offset(10.5, -10.5),
        Offset(6.5, -6.5),
        Offset(10.5, -6.5),
      ],
      PlayerColor.yellow: [
        Offset(6.5, 6.5),
        Offset(10.5, 6.5),
        Offset(6.5, 10.5),
        Offset(10.5, 10.5),
      ],
      PlayerColor.blue: [
        Offset(-10.5, 6.5),
        Offset(-6.5, 6.5),
        Offset(-10.5, 10.5),
        Offset(-6.5, 10.5),
      ],
    };

    final pos = basePositions[color]![tokenIndex];
    return Offset(
      centerX + pos.dx * CELL_SIZE * scale,
      centerY + pos.dy * CELL_SIZE * scale,
    );
  }

  Offset _getTrackCoordinates(int index, double centerX, double centerY, double scale) {
    return _getTrackPosition(index, centerX, centerY, 1.0).translate(
      centerX - CELL_SIZE * 9.5,
      centerY - CELL_SIZE * 9.5,
    );
  }

  bool _isInHomeLane(int tokenId, double dx, double dy) {
    // Simplified check - in real implementation, track actual position
    return false;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return oldDelegate is GameBoardPainter &&
        oldDelegate.gameState != gameState;
  }
}

class _TokenDrawData {
  final Offset position;
  final PlayerColor color;
  final int tokenId;
  final String playerId;

  _TokenDrawData({
    required this.position,
    required this.color,
    required this.tokenId,
    required this.playerId,
  });
}
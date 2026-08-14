// ============================================
// Ludo Nexus - Chat Widget
// ============================================

import 'package:flutter/material.dart';

import '../../../../../core/models/game_models.dart';

class ChatMessage {
  final String id;
  final String senderId;
  final String senderName;
  final PlayerColor senderColor;
  final String content;
  final DateTime timestamp;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.senderColor,
    required this.content,
    required this.timestamp,
  });
}

class ChatWidget extends StatelessWidget {
  final List<ChatMessage> messages;
  final Function(String) onSend;
  final String currentUserId;
  final PlayerColor currentUserColor;
  final String currentUserName;

  const ChatWidget({
    super.key,
    required this.messages,
    required this.onSend,
    required this.currentUserId,
    required this.currentUserColor,
    required this.currentUserName,
  });

  static const Map<PlayerColor, Color> PLAYER_COLORS = {
    PlayerColor.red: Color(0xFFEF4444),
    PlayerColor.green: Color(0xFF22C55E),
    PlayerColor.yellow: Color(0xFFEAB308),
    PlayerColor.blue: Color(0xFF3B82F6),
  };

  @override
  Widget build(BuildContext context) {
    final TextEditingController controller = TextEditingController();

    return Container(
      height: 300,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 24,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
              border: Border(
                bottom: BorderSide(color: Colors.grey[200]!),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Chat',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  '${messages.length} messages',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),

          // Messages
          Expanded(
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.all(16),
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final msg = messages[messages.length - 1 - index];
                final isMe = msg.senderId == currentUserId;
                final colorConfig = PLAYER_COLORS[msg.senderColor]!;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (!isMe)
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              colors: [
                                PLAYER_COLORS[msg.senderColor]!.withValues(alpha: 0.8),
                                PLAYER_COLORS[msg.senderColor]!,
                              ],
                            ),
                          ),
                          child: Center(
                            child: Text(
                              msg.senderName[0].toUpperCase(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ),
                      const SizedBox(width: 8),
                      Container(
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.of(context).size.width * 0.7,
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 10,
                        ),
                        decoration: BoxDecoration(
                          color: isMe ? const Color(0xFF3B82F6) : Colors.grey[100],
                          borderRadius: BorderRadius.only(
                            topLeft: const Radius.circular(18),
                            topRight: const Radius.circular(18),
                            bottomLeft: Radius.circular(isMe ? 4 : 18),
                            bottomRight: Radius.circular(isMe ? 18 : 4),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              msg.senderName,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: isMe ? Colors.white70 : Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              msg.content,
                              style: TextStyle(
                                fontSize: 14,
                                color: isMe ? Colors.white : Colors.black87,
                                height: 1.4,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              msg.timestamp.toLocal().toString().substring(11, 16),
                              style: TextStyle(
                                fontSize: 10,
                                color: isMe ? Colors.white54 : Colors.grey[500],
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (isMe)
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              colors: [
                                PLAYER_COLORS[currentUserColor]!.withValues(alpha: 0.8),
                                PLAYER_COLORS[currentUserColor]!,
                              ],
                            ),
                          ),
                          child: Center(
                            child: Text(
                              currentUserName[0].toUpperCase(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                );
              },
            ),
          ),

          // Input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
              border: Border(
                top: BorderSide(color: Colors.grey[200]!),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: TextEditingController(),
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      hintStyle: TextStyle(color: Colors.grey[400]),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide(color: Colors.grey[300]!),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide(color: Colors.grey[300]!),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: const BorderSide(color: Color(0xFF3B82F6), width: 2),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    onSubmitted: (value) {
                      if (value.trim().isNotEmpty) {
                        onSend(value.trim());
                      }
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(0xFF3B82F6),
                        const Color(0xFF1D4ED8),
                      ],
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(
                      Icons.send,
                      color: Colors.white,
                      size: 20,
                    ),
                    onPressed: () {
                      // Handle send
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
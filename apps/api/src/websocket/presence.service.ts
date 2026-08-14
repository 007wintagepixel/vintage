// ============================================
// Presence Service (User online status)
// ============================================

import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);
  private readonly userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds
  private readonly socketUser = new Map<string, string>(); // socketId -> userId

  async userConnected(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
    this.socketUser.set(socketId, userId);
  }

  async userDisconnected(socketId: string) {
    const userId = this.socketUser.get(socketId);
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(socketId);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
          // User is now offline
          this.logger.log(`User ${userId} went offline`);
        }
      }
      this.socketUser.delete(socketId);
    }
  }

  isUserOnline(userId: string): boolean {
    return (
      this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0
    );
  }

  getUserSocketCount(userId: string): number {
    return this.userSockets.get(userId)?.size ?? 0;
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  getOnlineCount(): number {
    return this.userSockets.size;
  }
}

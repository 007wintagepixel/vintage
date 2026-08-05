// ============================================
// Room Gateway (WebSocket for room lobby)
// ============================================

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { RoomService } from './room.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/room',
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RoomGateway.name);
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly roomService: RoomService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token ?? client.handshake.query?.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        issuer: 'ludo-nexus',
        audience: 'ludo-nexus-api',
      });

      const userId = payload.sub;
      
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      client.join(`user:${userId}`);
      this.logger.log(`Client ${client.id} connected for user ${userId}`);
      client.emit('connected', { userId, socketId: client.id });
    } catch (error) {
      this.logger.warn(`Client ${client.id} auth failed: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.userSockets.delete(userId);
        break;
      }
    }
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return { error: 'Not authenticated' };

      const room = await this.roomService.getRoom(data.roomId);
      const isParticipant = room.players.some(p => p.userId === userId);
      if (!isParticipant) return { error: 'Not a participant' };

      client.join(`room:${data.roomId}`);
      return { success: true, room };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(`room:${data.roomId}`);
    return { success: true };
  }

  @SubscribeMessage('room_action')
  async handleRoomAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; action: string; targetUserId?: string; inviteUserId?: string },
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return { error: 'Not authenticated' };

      const result = await this.roomService.performAction(userId, {
        roomId: data.roomId,
        action: data.action as any,
        targetUserId: data.targetUserId,
        inviteUserId: data.inviteUserId,
      });

      // Broadcast room update
      this.server.to(`room:${data.roomId}`).emit('room_updated', result);
      return { success: true, room: result };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('send_chat')
  async handleSendChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: string },
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return { error: 'Not authenticated' };

    this.server.to(`room:${data.roomId}`).emit('chat_message', {
      userId,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { pong: true, timestamp: Date.now() };
  }

  private getUserIdFromSocket(client: Socket): string | null {
    const token = client.handshake.auth?.token ?? client.handshake.query?.token;
    if (!token) return null;
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        issuer: 'ludo-nexus',
        audience: 'ludo-nexus-api',
      });
      return payload.sub;
    } catch {
      return null;
    }
  }

  emitToRoom(roomId: string, event: string, data: any) {
    this.server.to(`room:${roomId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
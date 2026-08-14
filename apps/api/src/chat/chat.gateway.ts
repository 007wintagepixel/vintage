// ============================================
// Chat Gateway (WebSocket)
// ============================================

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: { origin: "*", credentials: true },
  namespace: "/chat",
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ?? client.handshake.query?.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
        issuer: "ludo-nexus",
        audience: "ludo-nexus-api",
      });

      const userId = payload.sub;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      client.join(`user:${userId}`);
      this.logger.log(`Client ${client.id} connected for user ${userId}`);
      client.emit("connected", { userId, socketId: client.id });
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

  @SubscribeMessage("join_conversation")
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return { error: "Not authenticated" };

      client.join(`conversation:${data.conversationId}`);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage("leave_conversation")
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    return { success: true };
  }

  @SubscribeMessage("send_message")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      conversationId: string;
      content: string;
      type?: string;
      replyTo?: string;
    },
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return { error: "Not authenticated" };

      const message = await this.chatService.sendMessage(
        data.conversationId,
        userId,
        {
          conversationId: data.conversationId,
          content: data.content,
          type: (data.type as any) ?? "text",
          replyTo: data.replyTo,
        },
      );

      // Broadcast to conversation
      this.server
        .to(`conversation:${data.conversationId}`)
        .emit("new_message", message);

      return { success: true, message };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage("typing_start")
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return;

    client
      .to(`conversation:${data.conversationId}`)
      .emit("user_typing", { userId });
  }

  @SubscribeMessage("typing_stop")
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return;

    client
      .to(`conversation:${data.conversationId}`)
      .emit("user_stopped_typing", { userId });
  }

  @SubscribeMessage("mark_read")
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() _data: { conversationId: string },
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return { error: "Not authenticated" };

    // The service handles marking as read when fetching messages
    return { success: true };
  }

  @SubscribeMessage("join_global")
  handleJoinGlobal(@ConnectedSocket() client: Socket) {
    client.join("global_chat");
    return { success: true };
  }

  @SubscribeMessage("leave_global")
  handleLeaveGlobal(@ConnectedSocket() client: Socket) {
    client.leave("global_chat");
    return { success: true };
  }

  @SubscribeMessage("send_global")
  async handleSendGlobal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string },
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return { error: "Not authenticated" };

      const message = await this.chatService.sendGlobalMessage(
        userId,
        data.content,
      );

      this.server.to("global_chat").emit("global_message", message);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage("ping")
  handlePing() {
    return { pong: true, timestamp: Date.now() };
  }

  private getUserIdFromSocket(client: Socket): string | null {
    const token = client.handshake.auth?.token ?? client.handshake.query?.token;
    if (!token) return null;

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
        issuer: "ludo-nexus",
        audience: "ludo-nexus-api",
      });
      return payload.sub;
    } catch {
      return null;
    }
  }

  emitToConversation(conversationId: string, event: string, data: any) {
    this.server.to(`conversation:${conversationId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  broadcastGlobal(event: string, data: any) {
    this.server.to("global_chat").emit(event, data);
  }
}

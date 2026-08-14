// ============================================
// Main WebSocket Gateway (General connections)
// ============================================

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { PresenceService } from "./presence.service";

@WebSocketGateway({
  cors: { origin: "*", credentials: true },
  namespace: "/",
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly presenceService: PresenceService,
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

      // Register presence
      await this.presenceService.userConnected(userId, client.id);

      client.join(`user:${userId}`);
      this.logger.log(`User ${userId} connected via main gateway`);
      client.emit("connected", { userId, socketId: client.id });
    } catch (error) {
      this.logger.warn(`Main gateway connection failed: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    await this.presenceService.userDisconnected(client.id);
    this.logger.log(`Client ${client.id} disconnected from main gateway`);
  }

  // Broadcast to all connected users
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Send to specific user
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  // Send notification
  sendNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit("notification", notification);
  }
}

// ============================================
// Game Gateway (WebSocket)
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

import { PrismaService } from "../prisma/prisma.service";
import { GameService } from "./game.service";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  namespace: "/game",
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(GameGateway.name);
  private readonly userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly gameService: GameService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake auth or query
      const token =
        client.handshake.auth?.token ?? client.handshake.query?.token;

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
        issuer: "ludo-nexus",
        audience: "ludo-nexus-api",
      });

      const userId = payload.sub;

      // Store user-socket mapping
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Join user room
      client.join(`user:${userId}`);

      this.logger.log(`Client ${client.id} connected for user ${userId}`);

      // Send connection confirmation
      client.emit("connected", { userId, socketId: client.id });
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} authentication failed: ${error.message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove from user sockets
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage("join_match")
  async handleJoinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return { error: "Not authenticated" };

      // Verify user is part of match
      const match = await this.gameService.getMatch(data.matchId, userId);

      // Join match room
      client.join(`match:${data.matchId}`);

      // Get current game state
      const gameState = await this.gameService.getMatchState(data.matchId);

      return { success: true, gameState };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage("leave_match")
  handleLeaveMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    client.leave(`match:${data.matchId}`);
    return { success: true };
  }

  @SubscribeMessage("roll_dice")
  async handleRollDice(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; idempotencyKey: string },
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return { error: "Not authenticated" };

      const result = await this.gameService.rollDice(
        data.matchId,
        userId,
        data.idempotencyKey,
      );

      // Broadcast to match room
      this.server.to(`match:${data.matchId}`).emit("dice_rolled", {
        userId,
        diceRoll: result.diceRoll,
        legalMoves: result.legalMoves,
        gameState: result.gameState,
      });

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage("move_token")
  async handleMoveToken(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      matchId: string;
      tokenId: number;
      toPosition: number;
      gameStateVersion: number;
      idempotencyKey: string;
    },
  ) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) return { error: "Not authenticated" };

      const result = await this.gameService.moveToken(
        data.matchId,
        userId,
        data.tokenId,
        data.toPosition,
        data.gameStateVersion,
        data.idempotencyKey,
      );

      // Broadcast to match room
      this.server.to(`match:${data.matchId}`).emit("token_moved", {
        userId,
        move: result.move,
        capturedTokens: result.capturedTokens,
        gameState: result.gameState,
      });

      // Check if game completed
      if (result.gameState.status === "completed") {
        this.server.to(`match:${data.matchId}`).emit("game_completed", {
          winner: result.gameState.winner,
          rankings: result.gameState.rankings,
          gameState: result.gameState,
        });
      }

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage("send_chat")
  async handleSendChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; message: string },
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return { error: "Not authenticated" };

    // Broadcast to match room
    this.server.to(`match:${data.matchId}`).emit("chat_message", {
      userId,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }

  @SubscribeMessage("ping")
  handlePing() {
    return { pong: true, timestamp: Date.now() };
  }

  // Helper methods
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

  // Public methods for other services to emit events
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitToMatch(matchId: string, event: string, data: any) {
    this.server.to(`match:${matchId}`).emit(event, data);
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}

// ============================================
// @ludo-nexus/api-client - Socket Client
// ============================================

import { io, Socket } from 'socket.io-client';

type EventHandler = (data: any) => void;

export interface SocketClientOptions {
  url?: string;
  token: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export class SocketClient {
  private socket: Socket | null = null;
  private options: SocketClientOptions;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private connected = false;
  private connecting = false;

  constructor(options: SocketClientOptions) {
    this.options = {
      url: options.url ?? (typeof window !== 'undefined' 
        ? (window.location.origin.includes('localhost') ? 'http://localhost:3001' : '')
        : 'http://localhost:3001'),
      token: options.token,
      autoConnect: options.autoConnect ?? true,
      reconnection: options.reconnection ?? true,
      reconnectionAttempts: options.reconnectionAttempts ?? 5,
      reconnectionDelay: options.reconnectionDelay ?? 2000,
    };
  }

  connect(): Promise<void> {
    if (this.connected || this.connecting) {
      return Promise.resolve();
    }

    this.connecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.options.url, {
          auth: { token: this.options.token },
          transports: ['websocket', 'polling'],
          reconnection: this.options.reconnection,
          reconnectionAttempts: this.options.reconnectionAttempts,
          reconnectionDelay: this.options.reconnectionDelay,
          timeout: 10000,
        });

        this.socket.on('connect', () => {
          this.connected = true;
          this.connecting = false;
          this.emit('connected', { socketId: this.socket?.id });
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          this.connected = false;
          this.emit('disconnected', { reason });
        });

        this.socket.on('connect_error', (error) => {
          this.connecting = false;
          this.emit('connect_error', { error: error.message });
          reject(new Error(error.message));
        });

        // Forward all events to handlers
        this.socket.onAny((eventName, data) => {
          this.emit(eventName, data);
        });

      } catch (error) {
        this.connecting = false;
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Event handling
  on(event: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
    
    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler) {
    this.eventHandlers.get(event)?.delete(handler);
  }

  private emit(event: string, data: any) {
    this.eventHandlers.get(event)?.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in socket handler for ${event}:`, error);
      }
    });
  }

  // Game events
  joinMatch(matchId: string) {
    this.socket?.emit('join_match', { matchId });
  }

  leaveMatch(matchId: string) {
    this.socket?.emit('leave_match', { matchId });
  }

  rollDice(matchId: string, idempotencyKey: string) {
    this.socket?.emit('roll_dice', { matchId, idempotencyKey });
  }

  moveToken(matchId: string, tokenId: number, toPosition: number, gameStateVersion: number, idempotencyKey: string) {
    this.socket?.emit('move_token', { matchId, tokenId, toPosition, gameStateVersion, idempotencyKey });
  }

  // Room events
  joinRoom(roomId: string) {
    this.socket?.emit('join_room', { roomId });
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leave_room', { roomId });
  }

  roomAction(roomId: string, action: string, targetUserId?: string, inviteUserId?: string) {
    this.socket?.emit('room_action', { roomId, action, targetUserId, inviteUserId });
  }

  // Chat events
  joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', { conversationId });
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('leave_conversation', { conversationId });
  }

  sendMessage(conversationId: string, content: string, type: string = 'text', replyTo?: string) {
    this.socket?.emit('send_message', { conversationId, content, type, replyTo });
  }

  typingStart(conversationId: string) {
    this.socket?.emit('typing_start', { conversationId });
  }

  typingStop(conversationId: string) {
    this.socket?.emit('typing_stop', { conversationId });
  }

  markRead(conversationId: string) {
    this.socket?.emit('mark_read', { conversationId });
  }

  joinGlobal() {
    this.socket?.emit('join_global');
  }

  leaveGlobal() {
    this.socket?.emit('leave_global');
  }

  sendGlobal(content: string) {
    this.socket?.emit('send_global', { content });
  }

  // Matchmaking
  joinQueue(mode: string, skillRating?: number, region?: string) {
    this.socket?.emit('join_queue', { mode, skillRating, region });
  }

  leaveQueue() {
    this.socket?.emit('leave_queue');
  }

  // Ping/pong for connection health
  ping() {
    this.socket?.emit('ping');
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

export function createSocketClient(options: SocketClientOptions): SocketClient {
  return new SocketClient(options);
}
// ============================================
// App Module
// ============================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { MatchModule } from './match/match.module';
import { RoomModule } from './room/room.module';
import { TournamentModule } from './tournament/tournament.module';
import { WalletModule } from './wallet/wallet.module';
import { FriendModule } from './friend/friend.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { WebsocketModule } from './websocket/websocket.module';

// Build imports dynamically — BullMQ/Redis is optional
const hasRedis = !!process.env.REDIS_URL || !!process.env.REDIS_HOST;
const dynamicImports: any[] = [];

if (hasRedis) {
  // BullMQ for background jobs (requires Redis)
  if (process.env.REDIS_URL) {
    // Parse REDIS_URL (redis://[:password@]host:port)
    const redisUrl = new URL(process.env.REDIS_URL);
    dynamicImports.push(
      BullModule.forRoot({
        connection: {
          host: redisUrl.hostname,
          port: parseInt(redisUrl.port || '6379', 10),
          password: redisUrl.password || undefined,
        },
      }),
    );
  } else {
    dynamicImports.push(
      BullModule.forRoot({
        connection: {
          host: process.env.REDIS_HOST ?? 'localhost',
          port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
          password: process.env.REDIS_PASSWORD,
        },
      }),
    );
  }
}

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),

    // Task scheduling
    ScheduleModule.forRoot(),

    // BullMQ (only if Redis is available)
    ...dynamicImports,

    // Core modules
    PrismaModule,
    AuthModule,
    UserModule,
    GameModule,
    MatchModule,
    RoomModule,
    TournamentModule,
    WalletModule,
    FriendModule,
    ChatModule,
    AdminModule,
    HealthModule,
    WebsocketModule,
  ],
})
export class AppModule {}
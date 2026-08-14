// ============================================
// Room Module
// ============================================

import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { RoomGateway } from "./room.gateway";
import { GameModule } from "../game/game.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [GameModule, AuthModule],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
  exports: [RoomService, RoomGateway],
})
export class RoomModule {}

// ============================================
// WebSocket Module
// ============================================

import { Module } from "@nestjs/common";
import { WebsocketGateway } from "./websocket.gateway";
import { PresenceService } from "./presence.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  providers: [WebsocketGateway, PresenceService],
  exports: [WebsocketGateway, PresenceService],
})
export class WebsocketModule {}

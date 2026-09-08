// ============================================
// Game Module
// ============================================

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { GameEngineService } from "./game-engine.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [GameController],
  providers: [GameService, GameGateway, GameEngineService],
  exports: [GameService, GameGateway, GameEngineService],
})
export class GameModule {}

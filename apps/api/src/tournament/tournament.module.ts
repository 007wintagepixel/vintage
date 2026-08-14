// ============================================
// Tournament Module
// ============================================

import { Module } from "@nestjs/common";
// import { TournamentController } from './tournament.controller'; // Not implemented yet
import { TournamentService } from "./tournament.service";
// import { TournamentGateway } from './tournament.gateway'; // Not implemented yet
import { GameModule } from "../game/game.module";

@Module({
  imports: [GameModule],
  // controllers: [TournamentController],
  providers: [TournamentService /* TournamentGateway */],
  exports: [TournamentService /* TournamentGateway */],
})
export class TournamentModule {}

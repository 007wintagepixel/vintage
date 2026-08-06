// ============================================
// Tournament Module
// ============================================

import { Module } from '@nestjs/common';
// import { TournamentController } from './tournament.controller'; // Not implemented yet
import { TournamentService } from './tournament.service';
// import { TournamentGateway } from './tournament.gateway'; // Not implemented yet

@Module({
  // controllers: [TournamentController],
  providers: [TournamentService, /* TournamentGateway */],
  exports: [TournamentService, /* TournamentGateway */],
})
export class TournamentModule {}
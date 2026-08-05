// ============================================
// Tournament Module
// ============================================

import { Module } from '@nestjs/common';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { TournamentGateway } from './tournament.gateway';

@Module({
  controllers: [TournamentController],
  providers: [TournamentService, TournamentGateway],
  exports: [TournamentService, TournamentGateway],
})
export class TournamentModule {}
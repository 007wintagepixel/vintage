// ============================================
// Match Module
// ============================================

import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchmakingService } from './matchmaking.service';

@Module({
  controllers: [MatchController],
  providers: [MatchService, MatchmakingService],
  exports: [MatchService, MatchmakingService],
})
export class MatchModule {}
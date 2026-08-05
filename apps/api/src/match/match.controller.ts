// ============================================
// Match Controller
// ============================================

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { MatchService } from './match.service';
import { MatchmakingService } from './matchmaking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { Validation } from '@ludo-nexus/validation';

@ApiTags('Match')
@Controller({ path: 'match', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly matchmakingService: MatchmakingService,
  ) {}

  @Get('history')
  @ApiOperation({ summary: 'Get match history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Match history' })
  async getHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.matchService.getMatchHistory(userId, page, limit);
  }

  @Get('replay/:matchId')
  @ApiOperation({ summary: 'Get match replay' })
  @ApiResponse({ status: 200, description: 'Match replay data' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async getReplay(
    @CurrentUser('id') userId: string,
    @Param('matchId') matchId: string,
  ) {
    return this.matchService.getMatchReplay(matchId, userId);
  }

  @Get('live')
  @ApiOperation({ summary: 'Get live matches' })
  @ApiResponse({ status: 200, description: 'List of live matches' })
  async getLiveMatches() {
    return this.matchService.getLiveMatches();
  }

  // Matchmaking
  @Post('matchmaking/join')
  @ApiOperation({ summary: 'Join matchmaking queue' })
  @ApiResponse({ status: 200, description: 'Joined queue' })
  @HttpCode(HttpStatus.OK)
  async joinQueue(
    @CurrentUser('id') userId: string,
    @Body() data: { mode: string; skillRating?: number; region?: string },
  ) {
    return this.matchmakingService.joinQueue(userId, data.mode, {
      skillRating: data.skillRating,
      region: data.region,
    });
  }

  @Post('matchmaking/leave')
  @ApiOperation({ summary: 'Leave matchmaking queue' })
  @ApiResponse({ status: 200, description: 'Left queue' })
  @HttpCode(HttpStatus.OK)
  async leaveQueue(@CurrentUser('id') userId: string) {
    return this.matchmakingService.leaveQueue(userId);
  }

  @Get('matchmaking/status')
  @ApiOperation({ summary: 'Get queue status' })
  @ApiResponse({ status: 200, description: 'Queue status' })
  async getQueueStatus(@CurrentUser('id') userId: string) {
    return this.matchmakingService.getQueueStatus(userId);
  }
}
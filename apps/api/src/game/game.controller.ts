// ============================================
// Game Controller
// ============================================

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';

import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Validation } from '@ludo-nexus/validation';

import type { CreateMatch, RollDice, MoveToken, ReconnectMatch } from '@ludo-nexus/validation';

@ApiTags('Game')
@Controller({ path: 'game', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('matches')
  @ApiOperation({ summary: 'Create a new match' })
  @ApiResponse({ status: 201, description: 'Match created' })
  @HttpCode(HttpStatus.CREATED)
  async createMatch(
    @CurrentUser('id') userId: string,
    @Body() data: CreateMatch,
  ) {
    return this.gameService.createMatch(userId, data.mode, {
      entryFee: data.entryFee,
      rules: data.rules,
      opponentCount: data.opponentCount,
      botDifficulty: data.botDifficulty,
    });
  }

  @Get('matches/:matchId')
  @ApiOperation({ summary: 'Get match details' })
  @ApiResponse({ status: 200, description: 'Match details' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async getMatch(
    @CurrentUser('id') userId: string,
    @Param('matchId') matchId: string,
  ) {
    return this.gameService.getMatch(matchId, userId);
  }

  @Get('matches/:matchId/state')
  @ApiOperation({ summary: 'Get current game state' })
  @ApiResponse({ status: 200, description: 'Current game state' })
  async getMatchState(
    @Param('matchId') matchId: string,
  ) {
    return this.gameService.getMatchState(matchId);
  }

  @Post('matches/:matchId/roll-dice')
  @ApiOperation({ summary: 'Roll dice' })
  @ApiResponse({ status: 200, description: 'Dice rolled' })
  @HttpCode(HttpStatus.OK)
  async rollDice(
    @CurrentUser('id') userId: string,
    @Param('matchId') matchId: string,
    @Body() data: RollDice,
  ) {
    return this.gameService.rollDice(matchId, userId, data.idempotencyKey);
  }

  @Post('matches/:matchId/move-token')
  @ApiOperation({ summary: 'Move token' })
  @ApiResponse({ status: 200, description: 'Token moved' })
  @HttpCode(HttpStatus.OK)
  async moveToken(
    @CurrentUser('id') userId: string,
    @Param('matchId') matchId: string,
    @Body() data: MoveToken,
  ) {
    return this.gameService.moveToken(
      matchId,
      userId,
      data.tokenId,
      data.toPosition,
      data.gameStateVersion,
      data.idempotencyKey
    );
  }

  @Post('matches/:matchId/reconnect')
  @ApiOperation({ summary: 'Reconnect to match' })
  @ApiResponse({ status: 200, description: 'Reconnected' })
  @HttpCode(HttpStatus.OK)
  async reconnect(
    @CurrentUser('id') userId: string,
    @Param('matchId') matchId: string,
  ) {
    return this.gameService.getMatch(matchId, userId);
  }
}
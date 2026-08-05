// ============================================
// Room Controller
// ============================================

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { RoomService } from './room.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { Validation } from '@ludo-nexus/validation';

@ApiTags('Room')
@Controller({ path: 'room', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created' })
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @CurrentUser('id') userId: string,
    @Body() data: Validation['createRoom'],
  ) {
    return this.roomService.createRoom(userId, data);
  }

  @Get(':roomId')
  @ApiOperation({ summary: 'Get room details' })
  @ApiResponse({ status: 200, description: 'Room details' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getRoom(@Param('roomId') roomId: string) {
    return this.roomService.getRoom(roomId);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get room by code' })
  @ApiResponse({ status: 200, description: 'Room details' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getRoomByCode(@Param('code') code: string) {
    return this.roomService.getRoomByCode(code);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join room by code' })
  @ApiResponse({ status: 200, description: 'Joined room' })
  @HttpCode(HttpStatus.OK)
  async joinRoom(
    @CurrentUser('id') userId: string,
    @Body() data: Validation['joinRoom'],
  ) {
    return this.roomService.joinRoom(userId, data);
  }

  @Post('leave/:roomId')
  @ApiOperation({ summary: 'Leave room' })
  @ApiResponse({ status: 200, description: 'Left room' })
  @HttpCode(HttpStatus.OK)
  async leaveRoom(
    @CurrentUser('id') userId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.leaveRoom(userId, roomId);
  }

  @Delete(':roomId')
  @ApiOperation({ summary: 'Delete room (host only)' })
  @ApiResponse({ status: 200, description: 'Room deleted' })
  @HttpCode(HttpStatus.OK)
  async deleteRoom(
    @CurrentUser('id') userId: string,
    @Param('roomId') roomId: string,
  ) {
    return this.roomService.deleteRoom(userId, roomId);
  }

  @Post('action')
  @ApiOperation({ summary: 'Perform room action (ready, kick, invite, start, etc.)' })
  @ApiResponse({ status: 200, description: 'Action performed' })
  @HttpCode(HttpStatus.OK)
  async performAction(
    @CurrentUser('id') userId: string,
    @Body() data: Validation['roomAction'],
  ) {
    return this.roomService.performAction(userId, data);
  }

  @Get('public/list')
  @ApiOperation({ summary: 'Get public rooms' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of public rooms' })
  async getPublicRooms(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.roomService.getPublicRooms(page, limit);
  }
}
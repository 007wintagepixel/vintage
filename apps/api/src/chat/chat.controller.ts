// ============================================
// Chat Controller
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

import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { Validation } from '@ludo-nexus/validation';

@ApiTags('Chat')
@Controller({ path: 'chat', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Conversations list' })
  async getConversations(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.chatService.getConversations(userId, page, limit);
  }

  @Get('conversations/:conversationId')
  @ApiOperation({ summary: 'Get conversation details' })
  @ApiResponse({ status: 200, description: 'Conversation details' })
  async getConversation(
    @CurrentUser('id') userId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.getConversation(conversationId, userId);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created' })
  @HttpCode(HttpStatus.CREATED)
  async createConversation(
    @CurrentUser('id') userId: string,
    @Body() data: Validation['createConversation'],
  ) {
    return this.chatService.createConversation(userId, data);
  }

  @Post('conversations/:conversationId/leave')
  @ApiOperation({ summary: 'Leave conversation' })
  @ApiResponse({ status: 200, description: 'Left conversation' })
  @HttpCode(HttpStatus.OK)
  async leaveConversation(
    @CurrentUser('id') userId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.leaveConversation(userId, conversationId);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get messages in conversation' })
  @ApiQuery({ name: 'before', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Messages list' })
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('conversationId') conversationId: string,
    @Query() data: Validation['messageQuery'],
  ) {
    return this.chatService.getMessages(userId, { ...data, conversationId });
  }

  @Post('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Send message' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('conversationId') conversationId: string,
    @Body() data: Validation['sendMessage'],
  ) {
    return this.chatService.sendMessage(userId, { ...data, conversationId });
  }

  @Get('global')
  @ApiOperation({ summary: 'Get global chat messages' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Global chat messages' })
  async getGlobalMessages(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.chatService.getGlobalChatMessages(page, limit);
  }

  @Post('global')
  @ApiOperation({ summary: 'Send global message' })
  @ApiResponse({ status: 201, description: 'Global message sent' })
  @HttpCode(HttpStatus.CREATED)
  async sendGlobalMessage(
    @CurrentUser('id') userId: string,
    @Body() data: { content: string },
  ) {
    return this.chatService.sendGlobalMessage(userId, data.content);
  }
}
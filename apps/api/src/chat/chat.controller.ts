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
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";

import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

import type {
  CreateConversation,
  SendMessage,
  MessageQuery,
} from "@ludo-nexus/shared-types";

@ApiTags("Chat")
@Controller({ path: "chat", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("conversations")
  @ApiOperation({ summary: "Get user conversations" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Conversations list" })
  async getConversations(
    @CurrentUser("id") userId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    return this.chatService.getConversations(userId, page, limit);
  }

  @Get("conversations/:conversationId")
  @ApiOperation({ summary: "Get conversation details" })
  @ApiResponse({ status: 200, description: "Conversation details" })
  async getConversation(
    @CurrentUser("id") userId: string,
    @Param("conversationId") conversationId: string,
  ) {
    return this.chatService.getConversation(conversationId, userId);
  }

  @Post("conversations")
  @ApiOperation({ summary: "Create new conversation" })
  @ApiResponse({ status: 201, description: "Conversation created" })
  @HttpCode(HttpStatus.CREATED)
  async createConversation(
    @CurrentUser("id") userId: string,
    @Body() data: CreateConversation,
  ) {
    return this.chatService.createConversation(userId, data);
  }

  @Post("conversations/:conversationId/leave")
  @ApiOperation({ summary: "Leave conversation" })
  @ApiResponse({ status: 200, description: "Left conversation" })
  @HttpCode(HttpStatus.OK)
  async leaveConversation(
    @CurrentUser("id") userId: string,
    @Param("conversationId") conversationId: string,
  ) {
    return this.chatService.leaveConversation(userId, conversationId);
  }

  @Get("conversations/:conversationId/messages")
  @ApiOperation({ summary: "Get messages in conversation" })
  @ApiQuery({ name: "before", required: false, type: String })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Messages list" })
  async getMessages(
    @CurrentUser("id") userId: string,
    @Param("conversationId") conversationId: string,
    @Query() query: MessageQuery,
  ) {
    return this.chatService.getMessages(
      conversationId,
      userId,
      query.before,
      query.limit,
    );
  }

  @Post("conversations/:conversationId/messages")
  @ApiOperation({ summary: "Send message" })
  @ApiResponse({ status: 201, description: "Message sent" })
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @CurrentUser("id") userId: string,
    @Param("conversationId") conversationId: string,
    @Body() data: SendMessage,
  ) {
    return this.chatService.sendMessage(conversationId, userId, data);
  }

  @Patch("messages/:messageId")
  @ApiOperation({ summary: "Edit message" })
  @ApiResponse({ status: 200, description: "Message updated" })
  async editMessage(
    @CurrentUser("id") userId: string,
    @Param("messageId") messageId: string,
    @Body() data: { content: string },
  ) {
    return this.chatService.editMessage(messageId, userId, data.content);
  }

  @Delete("messages/:messageId")
  @ApiOperation({ summary: "Delete message" })
  @ApiResponse({ status: 200, description: "Message deleted" })
  @HttpCode(HttpStatus.OK)
  async deleteMessage(
    @CurrentUser("id") userId: string,
    @Param("messageId") messageId: string,
  ) {
    return this.chatService.deleteMessage(messageId, userId);
  }
}

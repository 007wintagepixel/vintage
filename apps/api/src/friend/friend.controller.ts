// ============================================
// Friend Controller
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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";

import { FriendService } from "./friend.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

import { z } from "zod";
import { Validation } from "@ludo-nexus/validation";

@ApiTags("Friends")
@Controller({ path: "friends", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  @ApiOperation({ summary: "Get friend list" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Friend list" })
  async getFriends(
    @CurrentUser("id") userId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 50,
  ) {
    return this.friendService.getFriends(userId, page, limit);
  }

  @Get("requests")
  @ApiOperation({ summary: "Get friend requests" })
  @ApiQuery({ name: "type", required: false, enum: ["received", "sent"] })
  @ApiResponse({ status: 200, description: "Friend requests" })
  async getRequests(
    @CurrentUser("id") userId: string,
    @Query("type") type: "received" | "sent" = "received",
  ) {
    return this.friendService.getFriendRequests(userId, type);
  }

  @Get("blocked")
  @ApiOperation({ summary: "Get blocked users" })
  @ApiResponse({ status: 200, description: "Blocked users" })
  async getBlocked(@CurrentUser("id") userId: string) {
    return this.friendService.getBlockedUsers(userId);
  }

  @Post("request")
  @ApiOperation({ summary: "Send friend request" })
  @ApiResponse({ status: 201, description: "Friend request sent" })
  @HttpCode(HttpStatus.CREATED)
  async sendRequest(
    @CurrentUser("id") userId: string,
    @Body() data: z.infer<(typeof Validation)["sendFriendRequest"]>,
  ) {
    return this.friendService.sendFriendRequest(userId, data);
  }

  @Post("action")
  @ApiOperation({
    summary:
      "Perform friend action (accept, decline, cancel, remove, block, unblock)",
  })
  @ApiResponse({ status: 200, description: "Action performed" })
  @HttpCode(HttpStatus.OK)
  async performAction(
    @CurrentUser("id") userId: string,
    @Body() data: z.infer<(typeof Validation)["friendAction"]>,
  ) {
    return this.friendService.performFriendAction(userId, data);
  }

  @Get("search")
  @ApiOperation({ summary: "Search users" })
  @ApiQuery({ name: "query", required: true, type: String })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Search results" })
  async searchUsers(
    @CurrentUser("id") userId: string,
    @Query() data: z.infer<(typeof Validation)["userSearch"]>,
  ) {
    return this.friendService.searchUsers(userId, data);
  }
}

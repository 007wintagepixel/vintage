// ============================================
// User Controller
// ============================================

import {
  Controller,
  Get,
  Post,
  Put,
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
  ApiConsumes,
} from "@nestjs/swagger";

import { UserService } from "./user.service";
import { AchievementService } from "./achievement.service";
import { KYCService } from "./kyc.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";

import type {
  UpdateProfile,
  ChangePassword,
  KYCSubmission,
} from "@ludo-nexus/validation";

@ApiTags("User")
@Controller({ path: "user", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly achievementService: AchievementService,
    private readonly kycService: KYCService,
  ) {}

  @Get("profile")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "User profile" })
  async getProfile(@CurrentUser("id") userId: string) {
    return this.userService.getProfile(userId);
  }

  @Get("profile/:userId")
  @ApiOperation({ summary: "Get public user profile" })
  @ApiResponse({ status: 200, description: "Public profile" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getPublicProfile(
    @CurrentUser("id") viewerId: string,
    @Param("userId") userId: string,
  ) {
    return this.userService.getPublicProfile(userId, viewerId);
  }

  @Put("profile")
  @ApiOperation({ summary: "Update profile" })
  @ApiResponse({ status: 200, description: "Profile updated" })
  async updateProfile(
    @CurrentUser("id") userId: string,
    @Body() data: UpdateProfile,
  ) {
    return this.userService.updateProfile(userId, data);
  }

  @Post("password")
  @ApiOperation({ summary: "Change password" })
  @ApiResponse({ status: 200, description: "Password changed" })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser("id") userId: string,
    @Body() data: ChangePassword,
  ) {
    return this.userService.changePassword(userId, data);
  }

  @Post("avatar")
  @ApiOperation({ summary: "Upload avatar" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({ status: 200, description: "Avatar uploaded" })
  @HttpCode(HttpStatus.OK)
  async uploadAvatar(
    @CurrentUser("id") userId: string,
    @Body() data: { fileUrl: string },
  ) {
    return this.userService.uploadAvatar(userId, data.fileUrl);
  }

  @Get("stats")
  @ApiOperation({ summary: "Get user statistics" })
  @ApiResponse({ status: 200, description: "User statistics" })
  async getStats(@CurrentUser("id") userId: string) {
    return this.userService.getStats(userId);
  }

  @Get("matches")
  @ApiOperation({ summary: "Get match history" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Match history" })
  async getMatchHistory(
    @CurrentUser("id") userId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    return this.userService.getMatchHistory(userId, page, limit);
  }

  // ============================================
  // ACHIEVEMENTS
  // ============================================

  @Get("achievements")
  @ApiOperation({ summary: "Get user achievements" })
  @ApiResponse({ status: 200, description: "User achievements" })
  async getAchievements(@CurrentUser("id") userId: string) {
    return this.achievementService.getUserAchievements(userId);
  }

  @Get("achievements/all")
  @Public()
  @ApiOperation({ summary: "Get all available achievements" })
  @ApiResponse({ status: 200, description: "All achievements" })
  async getAllAchievements() {
    return this.achievementService.getAllAchievements();
  }

  // ============================================
  // KYC
  // ============================================

  @Get("kyc")
  @ApiOperation({ summary: "Get KYC status" })
  @ApiResponse({ status: 200, description: "KYC status" })
  async getKYCStatus(@CurrentUser("id") userId: string) {
    return this.kycService.getKYCStatus(userId);
  }

  @Post("kyc/draft")
  @ApiOperation({ summary: "Save KYC draft" })
  @ApiResponse({ status: 200, description: "KYC draft saved" })
  @HttpCode(HttpStatus.OK)
  async saveKYCDraft(
    @CurrentUser("id") userId: string,
    @Body() data: Partial<KYCSubmission>,
  ) {
    return this.kycService.updateKYCDraft(userId, data);
  }

  @Post("kyc/submit")
  @ApiOperation({ summary: "Submit KYC for review" })
  @ApiResponse({ status: 200, description: "KYC submitted" })
  @HttpCode(HttpStatus.OK)
  async submitKYC(
    @CurrentUser("id") userId: string,
    @Body() data: KYCSubmission,
  ) {
    return this.kycService.submitKYC(userId, data);
  }
}

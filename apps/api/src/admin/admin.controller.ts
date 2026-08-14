// ============================================
// Admin Controller
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
} from "@nestjs/swagger";

import { AdminService } from "./admin.service";
import { AdminAuthGuard } from "./guards/admin-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type {
  UserFilters,
  MatchFilters,
  TournamentFilters,
  TransactionFilters,
  WithdrawalFilters,
  FraudAlertFilters,
  AuditLogFilters,
} from "./admin.service";

@ApiTags("Admin")
@Controller({ path: "admin", version: "1" })
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get admin dashboard stats" })
  @ApiResponse({ status: 200, description: "Dashboard statistics" })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================

  @Get("users")
  @ApiOperation({ summary: "Get all users" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "kycStatus", required: false, type: String })
  @ApiResponse({ status: 200, description: "Users list" })
  async getUsers(
    @Query() filters: UserFilters,
    @Query("page") page = 1,
    @Query("limit") limit = 50,
  ) {
    return this.adminService.getUsers(filters, page, limit);
  }

  @Get("users/:userId")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User details" })
  async getUser(@Param("userId") userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Post("users/:userId/ban")
  @ApiOperation({ summary: "Ban user" })
  @ApiResponse({ status: 200, description: "User banned" })
  @HttpCode(HttpStatus.OK)
  async banUser(
    @CurrentUser("id") adminId: string,
    @Param("userId") userId: string,
    @Body() data: { reason: string },
  ) {
    return this.adminService.banUser(userId, adminId, data.reason);
  }

  @Post("users/:userId/unban")
  @ApiOperation({ summary: "Unban user" })
  @ApiResponse({ status: 200, description: "User unbanned" })
  @HttpCode(HttpStatus.OK)
  async unbanUser(
    @CurrentUser("id") adminId: string,
    @Param("userId") userId: string,
  ) {
    return this.adminService.unbanUser(userId, adminId);
  }

  // ============================================
  // MATCH MANAGEMENT
  // ============================================

  @Get("matches")
  @ApiOperation({ summary: "Get all matches" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "mode", required: false, type: String })
  @ApiResponse({ status: 200, description: "Matches list" })
  async getMatches(
    @Query() filters: MatchFilters,
    @Query("page") page = 1,
    @Query("limit") limit = 50,
  ) {
    return this.adminService.getMatches(filters, page, limit);
  }

  @Get("matches/:matchId/replay")
  @ApiOperation({ summary: "Get match replay" })
  @ApiResponse({ status: 200, description: "Match replay" })
  async getMatchReplay(@Param("matchId") matchId: string) {
    return this.adminService.getMatchReplay(matchId);
  }

  // ============================================
  // TOURNAMENT MANAGEMENT
  // ============================================

  @Get("tournaments")
  @ApiOperation({ summary: "Get all tournaments" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Tournaments list" })
  async getTournaments(
    @Query() filters: TournamentFilters,
    @Query("page") page = 1,
    @Query("limit") limit = 50,
  ) {
    return this.adminService.getTournaments(filters, page, limit);
  }

  @Post("tournaments")
  @ApiOperation({ summary: "Create tournament" })
  @ApiResponse({ status: 201, description: "Tournament created" })
  @HttpCode(HttpStatus.CREATED)
  async createTournament(
    @CurrentUser("id") adminId: string,
    @Body() data: any,
  ) {
    return this.adminService.createTournament(adminId, data);
  }

  // ============================================
  // TRANSACTION MANAGEMENT
  // ============================================

  @Get("transactions")
  @ApiOperation({ summary: "Get all transactions" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "type", required: false, type: String })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Transactions list" })
  async getTransactions(
    @Query() filters: TransactionFilters,
    @Query("page") page = 1,
    @Query("limit") limit = 50,
  ) {
    return this.adminService.getTransactions(filters, page, limit);
  }

  // ============================================
  // WITHDRAWAL MANAGEMENT
  // ============================================

  @Get("withdrawals")
  @ApiOperation({ summary: "Get all withdrawals" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiResponse({ status: 200, description: "Withdrawals list" })
  async getWithdrawals(
    @Query() filters: WithdrawalFilters,
    @Query("page") page = 1,
    @Query("limit") limit = 50,
  ) {
    return this.adminService.getWithdrawals(filters, page, limit);
  }

  @Post("withdrawals/:withdrawalId/approve")
  @ApiOperation({ summary: "Approve withdrawal" })
  @ApiResponse({ status: 200, description: "Withdrawal approved" })
  @HttpCode(HttpStatus.OK)
  async approveWithdrawal(
    @CurrentUser("id") adminId: string,
    @Param("withdrawalId") withdrawalId: string,
  ) {
    return this.adminService.approveWithdrawal(withdrawalId, adminId);
  }

  @Post("withdrawals/:withdrawalId/reject")
  @ApiOperation({ summary: "Reject withdrawal" })
  @ApiResponse({ status: 200, description: "Withdrawal rejected" })
  @HttpCode(HttpStatus.OK)
  async rejectWithdrawal(
    @CurrentUser("id") adminId: string,
    @Param("withdrawalId") withdrawalId: string,
    @Body() data: { reason: string },
  ) {
    return this.adminService.rejectWithdrawal(
      withdrawalId,
      adminId,
      data.reason,
    );
  }

  // ============================================
  // KYC MANAGEMENT
  // ============================================

  @Get("kyc/pending")
  @ApiOperation({ summary: "Get pending KYC reviews" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Pending KYC list" })
  async getPendingKYC(@Query("page") page = 1, @Query("limit") limit = 20) {
    return this.adminService.getPendingKYC(page, limit);
  }

  @Post("kyc/:kycId/review")
  @ApiOperation({ summary: "Review KYC submission" })
  @ApiResponse({ status: 200, description: "KYC reviewed" })
  @HttpCode(HttpStatus.OK)
  async reviewKYC(
    @CurrentUser("id") adminId: string,
    @Param("kycId") kycId: string,
    @Body() data: { action: "approve" | "reject"; rejectionReason?: string },
  ) {
    return this.adminService.reviewKYC(
      kycId,
      adminId,
      data.action,
      data.rejectionReason,
    );
  }

  @Post("kyc/:kycId/additional-info")
  @ApiOperation({ summary: "Request additional KYC info" })
  @ApiResponse({ status: 200, description: "Additional info requested" })
  @HttpCode(HttpStatus.OK)
  async requestAdditionalInfo(
    @CurrentUser("id") adminId: string,
    @Param("kycId") kycId: string,
    @Body() data: { message: string },
  ) {
    return this.adminService.requestAdditionalInfo(
      kycId,
      adminId,
      data.message,
    );
  }

  // ============================================
  // FRAUD ALERTS
  // ============================================

  @Get("fraud-alerts")
  @ApiOperation({ summary: "Get fraud alerts" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({ name: "severity", required: false, type: String })
  @ApiResponse({ status: 200, description: "Fraud alerts list" })
  async getFraudAlerts(
    @Query() filters: FraudAlertFilters,
    @Query("page") page = 1,
    @Query("limit") limit = 50,
  ) {
    return this.adminService.getFraudAlerts(filters, page, limit);
  }

  @Put("fraud-alerts/:alertId")
  @ApiOperation({ summary: "Update fraud alert" })
  @ApiResponse({ status: 200, description: "Fraud alert updated" })
  async updateFraudAlert(
    @CurrentUser("id") adminId: string,
    @Param("alertId") alertId: string,
    @Body() data: { status?: string; assignedToId?: string },
  ) {
    return this.adminService.updateFraudAlert(alertId, adminId, data);
  }

  // ============================================
  // GAME SETTINGS
  // ============================================

  @Get("settings")
  @ApiOperation({ summary: "Get game settings" })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiResponse({ status: 200, description: "Game settings" })
  async getSettings(@Query("category") category?: string) {
    return this.adminService.getGameSettings(category);
  }

  @Put("settings")
  @ApiOperation({ summary: "Update game settings" })
  @ApiResponse({ status: 200, description: "Settings updated" })
  @HttpCode(HttpStatus.OK)
  async updateSettings(
    @CurrentUser("id") adminId: string,
    @Body() data: { settings: Array<{ key: string; value: any }> },
  ) {
    return this.adminService.updateGameSettings(adminId, data.settings);
  }

  // ============================================
  // AUDIT LOGS
  // ============================================

  @Get("audit-logs")
  @ApiOperation({ summary: "Get audit logs" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "adminId", required: false, type: String })
  @ApiQuery({ name: "action", required: false, type: String })
  @ApiResponse({ status: 200, description: "Audit logs" })
  async getAuditLogs(
    @Query() filters: AuditLogFilters,
    @Query("page") page = 1,
    @Query("limit") limit = 100,
  ) {
    return this.adminService.getAuditLogs(filters, page, limit);
  }
}

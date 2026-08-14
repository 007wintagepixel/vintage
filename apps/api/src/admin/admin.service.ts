// ============================================
// Admin Service
// ============================================

import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PrismaService } from "../prisma/prisma.service";
import { KYCService } from "../user/kyc.service";
import { WithdrawalService } from "../wallet/withdrawal.service";

export interface UserFilters {
  search?: string;
  kycStatus?: string;
  isActive?: boolean;
  isBanned?: boolean;
}

export interface MatchFilters {
  status?: string;
  mode?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface TournamentFilters {
  status?: string;
}

export interface TransactionFilters {
  type?: string;
  status?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface WithdrawalFilters {
  status?: string;
}

export interface FraudAlertFilters {
  status?: string;
  severity?: string;
  type?: string;
}

export interface AuditLogFilters {
  adminId?: string;
  userId?: string;
  action?: string;
  resourceType?: string;
  fromDate?: string;
  toDate?: string;
}

export interface GameSettingsUpdate {
  key: string;
  value: any;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly kycService: KYCService,
    private readonly withdrawalService: WithdrawalService,
  ) {}

  // ============================================
  // DASHBOARD
  // ============================================

  async getDashboardStats() {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers24h,
      activeUsers7d,
      activeUsers30d,
      totalMatches,
      matches24h,
      totalTournaments,
      activeTournaments,
      totalDemoCoins,
      pendingWithdrawals,
      pendingKYC,
      openFraudAlerts,
      revenue24h,
      revenue7d,
      revenue30d,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({
        where: { lastLoginAt: { gte: dayAgo }, deletedAt: null },
      }),
      this.prisma.user.count({
        where: { lastLoginAt: { gte: weekAgo }, deletedAt: null },
      }),
      this.prisma.user.count({
        where: { lastLoginAt: { gte: monthAgo }, deletedAt: null },
      }),
      this.prisma.match.count(),
      this.prisma.match.count({ where: { createdAt: { gte: dayAgo } } }),
      this.prisma.tournament.count(),
      this.prisma.tournament.count({ where: { status: "in_progress" } }),
      this.prisma.wallet.aggregate({ _sum: { available: true } }),
      this.prisma.withdrawal.count({
        where: { status: { in: ["requested", "under_review"] } },
      }),
      this.prisma.kYC.count({
        where: { status: { in: ["submitted", "under_review"] } },
      }),
      this.prisma.fraudAlert.count({ where: { status: "open" } }),
      this.calculateRevenue(dayAgo),
      this.calculateRevenue(weekAgo),
      this.calculateRevenue(monthAgo),
    ]);

    return {
      totalUsers,
      activeUsers24h,
      activeUsers7d,
      activeUsers30d,
      totalMatches,
      matches24h,
      totalTournaments,
      activeTournaments,
      totalDemoCoinsInCirculation: Number(totalDemoCoins._sum.available ?? 0),
      pendingWithdrawals,
      pendingKYC,
      openFraudAlerts,
      revenue24h,
      revenue7d,
      revenue30d,
    };
  }

  private async calculateRevenue(since: Date) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: { in: ["deposit", "withdrawal", "match", "tournament"] },
        createdAt: { gte: since },
      },
      select: { amount: true, fee: true },
    });

    let revenue = 0n;
    for (const tx of transactions) {
      revenue += tx.fee;
    }
    return Number(revenue);
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================

  async getUsers(filters: UserFilters = {}, page = 1, limit = 50) {
    const where: any = { deletedAt: null };

    if (filters.search) {
      where.OR = [
        { username: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { fullName: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.kycStatus) where.kycStatus = filters.kycStatus;
    if (filters.isActive !== undefined)
      where.deletedAt = filters.isActive ? null : { not: null };
    if (filters.isBanned) {
      // Would need a banned field
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          wallet: true,
          kyc: true,
          _count: {
            select: { matches: true, friends: true, tournaments: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u: any) => {
        const { passwordHash, sessions, otps, devices, fraudAlerts, ...safe } =
          u;
        // Suppress unused vars
        void passwordHash;
        void sessions;
        void otps;
        void devices;
        void fraudAlerts;
        return safe;
      }),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        wallet: true,
        kyc: { include: { documents: true } },
        sessions: { orderBy: { createdAt: "desc" }, take: 10 },
        devices: { orderBy: { lastUsedAt: "desc" } },
        _count: {
          select: {
            matches: true,
            friends: true,
            tournaments: true,
            achievements: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException("User not found");

    const { passwordHash, ...safe } = user;
    // Suppress unused var
    void passwordHash;
    return safe;
  }

  async banUser(userId: string, adminId: string, reason: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }, // Soft delete as ban
    });

    await this.logAudit(adminId, "user.ban", "user", userId, null, { reason });
    return { success: true };
  }

  async unbanUser(userId: string, adminId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null },
    });

    await this.logAudit(
      adminId,
      "user.unban",
      "user",
      userId,
      { deletedAt: new Date() },
      null,
    );
    return { success: true };
  }

  // ============================================
  // MATCH MANAGEMENT
  // ============================================

  async getMatches(filters: MatchFilters = {}, page = 1, limit = 50) {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.mode) where.mode = filters.mode;
    if (filters.userId) {
      where.players = { some: { userId: filters.userId } };
    }
    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = new Date(filters.fromDate);
      if (filters.toDate) where.createdAt.lte = new Date(filters.toDate);
    }

    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where,
        include: {
          players: {
            select: { userId: true, color: true, isBot: true, finalRank: true },
          },
          room: { select: { code: true } },
          tournament: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.match.count({ where }),
    ]);

    return {
      data: matches,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getMatchReplay(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        players: true,
        events: { orderBy: { sequence: "asc" } },
      },
    });

    if (!match) throw new NotFoundException("Match not found");
    return match;
  }

  // ============================================
  // TOURNAMENT MANAGEMENT
  // ============================================

  async getTournaments(filters: TournamentFilters = {}, page = 1, limit = 50) {
    const where: any = {};
    if (filters.status) where.status = filters.status;

    const [tournaments, total] = await Promise.all([
      this.prisma.tournament.findMany({
        where,
        include: {
          createdBy: { select: { id: true, username: true } },
          _count: { select: { registrations: true, matches: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tournament.count({ where }),
    ]);

    return {
      data: tournaments,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createTournament(adminId: string, data: any) {
    return this.prisma.tournament.create({
      data: {
        ...data,
        prizeBreakdown: data.prizeBreakdown as any,
        rules: data.rules as any,
        registrationOpensAt: new Date(data.registrationOpensAt),
        registrationClosesAt: new Date(data.registrationClosesAt),
        checkInStartsAt: data.checkInStartsAt
          ? new Date(data.checkInStartsAt)
          : null,
        checkInEndsAt: data.checkInEndsAt ? new Date(data.checkInEndsAt) : null,
        createdById: adminId,
      },
    });
  }

  // ============================================
  // TRANSACTION MANAGEMENT
  // ============================================

  async getTransactions(
    filters: TransactionFilters = {},
    page = 1,
    limit = 50,
  ) {
    const where: any = {};

    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.userId = filters.userId;
    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = new Date(filters.fromDate);
      if (filters.toDate) where.createdAt.lte = new Date(filters.toDate);
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions.map((t: any) => ({
        ...t,
        amount: Number(t.amount),
        fee: Number(t.fee),
        netAmount: Number(t.netAmount),
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ============================================
  // WITHDRAWAL MANAGEMENT
  // ============================================

  async getWithdrawals(filters: WithdrawalFilters = {}, page = 1, limit = 50) {
    return this.withdrawalService.getAllWithdrawals(
      filters.status,
      page,
      limit,
    );
  }

  async approveWithdrawal(withdrawalId: string, adminId: string) {
    return this.withdrawalService.approveWithdrawal(withdrawalId, adminId);
  }

  async rejectWithdrawal(
    withdrawalId: string,
    adminId: string,
    reason: string,
  ) {
    return this.withdrawalService.rejectWithdrawal(
      withdrawalId,
      adminId,
      reason,
    );
  }

  // ============================================
  // KYC MANAGEMENT
  // ============================================

  async getPendingKYC(page = 1, limit = 20) {
    return this.kycService.getPendingKYC(page, limit);
  }

  async reviewKYC(
    kycId: string,
    adminId: string,
    action: "approve" | "reject",
    rejectionReason?: string,
  ) {
    return this.kycService.reviewKYC(kycId, adminId, action, rejectionReason);
  }

  async requestAdditionalInfo(kycId: string, adminId: string, message: string) {
    return this.kycService.requestAdditionalInfo(kycId, adminId, message);
  }

  // ============================================
  // FRAUD ALERTS
  // ============================================

  async getFraudAlerts(filters: FraudAlertFilters = {}, page = 1, limit = 50) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.severity) where.severity = filters.severity;
    if (filters.type) where.type = filters.type;

    const [alerts, total] = await Promise.all([
      this.prisma.fraudAlert.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, email: true } },
          assignedTo: { select: { id: true, username: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.fraudAlert.count({ where }),
    ]);

    return {
      data: alerts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateFraudAlert(
    alertId: string,
    adminId: string,
    data: { status?: string; assignedToId?: string },
  ) {
    const alert = await this.prisma.fraudAlert.findUnique({
      where: { id: alertId },
    });
    if (!alert) throw new NotFoundException("Fraud alert not found");

    const updateData: any = { ...data };
    if (data.status === "resolved") {
      updateData.resolvedAt = new Date();
      updateData.resolvedById = adminId;
    }

    return this.prisma.fraudAlert.update({
      where: { id: alertId },
      data: updateData,
    });
  }

  // ============================================
  // GAME SETTINGS
  // ============================================

  async getGameSettings(category?: string, publicOnly = false) {
    const where: any = {};
    if (category) where.category = category;
    if (publicOnly) where.isPublic = true;

    return this.prisma.gameSettings.findMany({
      where,
      orderBy: { category: "asc" },
    });
  }

  async updateGameSettings(adminId: string, settings: GameSettingsUpdate[]) {
    const results = [];
    for (const setting of settings) {
      const updated = await this.prisma.gameSettings.upsert({
        where: { key: setting.key },
        create: {
          key: setting.key,
          value: setting.value,
          description: "",
          category: "gameplay",
          updatedById: adminId,
        },
        update: {
          value: setting.value,
          updatedAt: new Date(),
          updatedById: adminId,
        },
      });
      results.push(updated);
    }
    return results;
  }

  // ============================================
  // AUDIT LOGS
  // ============================================

  async getAuditLogs(filters: AuditLogFilters = {}, page = 1, limit = 100) {
    const where: any = {};
    if (filters.adminId) where.adminId = filters.adminId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.action)
      where.action = { contains: filters.action, mode: "insensitive" };
    if (filters.resourceType) where.resourceType = filters.resourceType;
    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = new Date(filters.fromDate);
      if (filters.toDate) where.createdAt.lte = new Date(filters.toDate);
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          admin: { select: { id: true, username: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private async logAudit(
    adminId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    oldData: any,
    newData: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action,
        resourceType,
        resourceId,
        oldData,
        newData,
      },
    });
  }
}

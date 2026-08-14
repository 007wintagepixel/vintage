// ============================================
// Withdrawal Service
// ============================================

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PaymentMethod } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "./wallet.service";
import { LedgerService } from "./ledger.service";

import type { WithdrawalRequest } from "@ludo-nexus/validation";

@Injectable()
export class WithdrawalService {
  private readonly logger = new Logger(WithdrawalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly walletService: WalletService,
    private readonly ledgerService: LedgerService,
  ) {}

  async requestWithdrawal(userId: string, data: WithdrawalRequest) {
    // Check KYC status
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true, isPhoneVerified: true },
    });

    if (!user) throw new NotFoundException("User not found");
    if (user.kycStatus !== "verified") {
      throw new ForbiddenException("KYC verification required for withdrawals");
    }
    if (!user.isPhoneVerified) {
      throw new ForbiddenException(
        "Phone verification required for withdrawals",
      );
    }

    // Check available balance (only available balance can be withdrawn)
    const balance = await this.walletService.getBalance(userId);
    if (balance.available < data.amount) {
      throw new BadRequestException("Insufficient available balance");
    }

    // Check minimum withdrawal amount
    const minWithdrawal =
      this.configService.get<number>("MIN_WITHDRAWAL_AMOUNT") ?? 100;
    if (data.amount < minWithdrawal) {
      throw new BadRequestException(
        `Minimum withdrawal amount is ${minWithdrawal}`,
      );
    }

    // Calculate fee
    const feePercent =
      this.configService.get<number>("WITHDRAWAL_FEE_PERCENT") ?? 2;
    const fee = Math.floor((data.amount * feePercent) / 100);
    const netAmount = data.amount - fee;

    // Lock funds
    await this.ledgerService.transfer(
      userId,
      data.amount,
      "available",
      "locked",
      `withdrawal-${Date.now()}`,
      "Withdrawal request",
    );

    // Create withdrawal request
    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        userId,
        amount: data.amount,
        fee,
        netAmount,
        destinationMethod: data.destinationMethod,
        destinationDetails: data.destinationDetails as any,
        status: "requested",
      },
    });

    // In production, send OTP via a real OTP provider for confirmation.
    this.logger.log(
      `Withdrawal OTP sent (dev mode) for withdrawal ${withdrawal.id}`,
    );
    // For demo mode, auto-approve
    if (this.configService.get<string>("NODE_ENV") !== "production") {
      return this.processWithdrawal(withdrawal.id, "auto");
    }

    return withdrawal;
  }

  async processWithdrawal(withdrawalId: string, adminId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) throw new NotFoundException("Withdrawal not found");
    if (
      withdrawal.status !== "requested" &&
      withdrawal.status !== "under_review"
    ) {
      throw new BadRequestException("Withdrawal cannot be processed");
    }

    // Update status
    await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: "processing",
        reviewedAt: new Date(),
        reviewedById: adminId,
      },
    });

    // In production, integrate with payment provider
    // For demo, simulate processing
    setTimeout(async () => {
      await this.completeWithdrawal(withdrawalId);
    }, 5000);

    return { success: true, message: "Withdrawal processing started" };
  }

  private async completeWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) return;

    // Release locked funds (they're being sent out)
    await this.ledgerService.debit(
      withdrawal.userId,
      Number(withdrawal.amount),
      "locked",
      "withdrawal",
      withdrawalId,
      `Withdrawal to ${withdrawal.destinationMethod}`,
    );

    // Create transaction record
    await this.prisma.transaction.create({
      data: {
        userId: withdrawal.userId,
        walletId: (await this.prisma.wallet.findUnique({
          where: { userId: withdrawal.userId },
        }))!.id,
        type: "withdrawal",
        status: "completed",
        amount: -withdrawal.amount,
        fee: withdrawal.fee,
        netAmount: -withdrawal.netAmount,
        balanceType: "available",
        paymentMethod:
          (withdrawal.destinationMethod as PaymentMethod) ??
          PaymentMethod.internal,
        paymentReference: withdrawalId,
        description: `Withdrawal to ${withdrawal.destinationMethod}`,
        idempotencyKey: `txn-${withdrawalId}`,
        processedAt: new Date(),
      },
    });

    // Update withdrawal status
    await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: "completed",
        processedAt: new Date(),
      },
    });

    this.logger.log(
      `Withdrawal ${withdrawalId} completed for user ${withdrawal.userId}`,
    );
  }

  async getWithdrawals(userId: string, page = 1, limit = 20) {
    const [withdrawals, total] = await Promise.all([
      this.prisma.withdrawal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.withdrawal.count({ where: { userId } }),
    ]);

    return {
      data: withdrawals.map((w: any) => ({
        ...w,
        amount: Number(w.amount),
        fee: Number(w.fee),
        netAmount: Number(w.netAmount),
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getWithdrawalById(userId: string, withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal || withdrawal.userId !== userId) {
      throw new NotFoundException("Withdrawal not found");
    }

    return {
      ...withdrawal,
      amount: Number(withdrawal.amount),
      fee: Number(withdrawal.fee),
      netAmount: Number(withdrawal.netAmount),
    };
  }

  // Admin methods
  async getAllWithdrawals(status?: string, page = 1, limit = 50) {
    const where: any = {};
    if (status) where.status = status;

    const [withdrawals, total] = await Promise.all([
      this.prisma.withdrawal.findMany({
        where,
        include: {
          user: {
            select: { id: true, username: true, email: true, kycStatus: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.withdrawal.count({ where }),
    ]);

    return {
      data: withdrawals,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async approveWithdrawal(withdrawalId: string, adminId: string) {
    return this.processWithdrawal(withdrawalId, adminId);
  }

  async rejectWithdrawal(
    withdrawalId: string,
    adminId: string,
    reason: string,
  ) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) throw new NotFoundException("Withdrawal not found");

    // Release locked funds back to available
    await this.ledgerService.transfer(
      withdrawal.userId,
      Number(withdrawal.amount),
      "locked",
      "available",
      withdrawalId,
      `Withdrawal rejected: ${reason}`,
    );

    await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
        reviewedById: adminId,
        rejectionReason: reason,
      },
    });

    return { success: true };
  }
}

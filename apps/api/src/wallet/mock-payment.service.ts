// ============================================
// Mock Payment Service (Development Only)
// ============================================

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";

import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "./wallet.service";
import { LedgerService } from "./ledger.service";
import { TransactionService } from "./transaction.service";

@Injectable()
export class MockPaymentService {
  private readonly logger = new Logger(MockPaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly ledgerService: LedgerService,
    private readonly transactionService: TransactionService,
  ) {}

  // Simulate payment outcomes
  async processDeposit(
    userId: string,
    amount: number,
    paymentMethod: string,
    idempotencyKey: string,
  ) {
    // Check if demo mode
    const isDemo = this.configService.get<string>("NODE_ENV") !== "production";

    if (!isDemo) {
      throw new Error("Mock payment only available in development");
    }

    // Simulate different outcomes based on amount or idempotency key
    let outcome: "success" | "failed" | "pending" = "success";

    if (idempotencyKey.includes("fail")) outcome = "failed";
    else if (idempotencyKey.includes("pending")) outcome = "pending";

    // Create transaction record
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error("Wallet not found");

    const transaction = await this.transactionService.createTransaction({
      userId,
      walletId: wallet.id,
      type: "deposit",
      amount,
      fee: 0,
      balanceType: "available",
      paymentMethod: paymentMethod as any,
      paymentProvider: "mock",
      paymentReference: `mock-${uuidv4()}`,
      description: `Demo deposit via ${paymentMethod}`,
      metadata: { mock: true, outcome },
      idempotencyKey,
    });

    if (outcome === "success") {
      // Credit the wallet
      await this.ledgerService.credit(
        userId,
        amount,
        "available",
        "deposit",
        transaction.id,
        `Demo deposit via ${paymentMethod}`,
      );

      await this.transactionService.updateTransactionStatus(
        transaction.id,
        "completed",
      );

      return {
        success: true,
        transactionId: transaction.id,
        status: "completed",
      };
    } else if (outcome === "pending") {
      // Simulate async processing
      setTimeout(async () => {
        await this.ledgerService.credit(
          userId,
          amount,
          "available",
          "deposit",
          transaction.id,
          `Demo deposit via ${paymentMethod}`,
        );
        await this.transactionService.updateTransactionStatus(
          transaction.id,
          "completed",
        );
      }, 3000);

      return {
        success: true,
        transactionId: transaction.id,
        status: "pending",
      };
    } else {
      await this.transactionService.updateTransactionStatus(
        transaction.id,
        "failed",
      );
      return {
        success: false,
        transactionId: transaction.id,
        status: "failed",
        error: "Mock payment failed",
      };
    }
  }

  // Simulate webhook callback
  async handleWebhook(data: {
    transactionId: string;
    status: "success" | "failed" | "pending";
    paymentReference: string;
    signature: string;
  }) {
    // Verify signature (mock)
    const expectedSignature = this.generateMockSignature(
      data.transactionId,
      data.status,
    );
    if (data.signature !== expectedSignature) {
      throw new Error("Invalid webhook signature");
    }

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: data.transactionId },
    });

    if (!transaction) throw new Error("Transaction not found");

    if (data.status === "success") {
      await this.ledgerService.credit(
        transaction.userId,
        Number(transaction.amount),
        "available",
        "deposit",
        transaction.id,
        `Webhook: ${transaction.description}`,
      );
    }

    await this.transactionService.updateTransactionStatus(
      transaction.id,
      data.status,
    );

    return { success: true };
  }

  private generateMockSignature(transactionId: string, status: string): string {
    // Simple mock signature
    const crypto = require("crypto");
    return crypto
      .createHmac("sha256", "mock-secret")
      .update(`${transactionId}:${status}`)
      .digest("hex");
  }

  // Generate test payment URL
  async generatePaymentUrl(
    userId: string,
    amount: number,
    paymentMethod: string,
    returnUrl?: string,
  ) {
    const transactionId = uuidv4();
    const paymentReference = `mock-${transactionId}`;

    // Pre-create transaction
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new Error("Wallet not found");

    await this.transactionService.createTransaction({
      userId,
      walletId: wallet.id,
      type: "deposit",
      amount,
      fee: 0,
      balanceType: "pending",
      paymentMethod: paymentMethod as any,
      paymentProvider: "mock",
      paymentReference,
      description: `Pending deposit via ${paymentMethod}`,
      metadata: { mock: true },
      idempotencyKey: `pending-${transactionId}`,
    });

    // Return mock payment URL
    const baseUrl =
      this.configService.get<string>("APP_URL") ?? "http://localhost:3000";
    const mockUrl = `${baseUrl}/mock-payment?transactionId=${transactionId}&amount=${amount}&method=${paymentMethod}&ref=${paymentReference}`;

    return { paymentUrl: mockUrl, transactionId, paymentReference };
  }

  // Mock payment page handler (called from frontend)
  async completeMockPayment(
    transactionId: string,
    outcome: "success" | "failed",
  ) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new Error("Transaction not found");

    if (outcome === "success") {
      await this.ledgerService.credit(
        transaction.userId,
        Number(transaction.amount),
        "available",
        "deposit",
        transaction.id,
        `Mock payment completed`,
      );
      await this.transactionService.updateTransactionStatus(
        transaction.id,
        "completed",
      );
    } else {
      await this.transactionService.updateTransactionStatus(
        transaction.id,
        "failed",
      );
    }

    return { success: outcome === "success", transactionId };
  }
}

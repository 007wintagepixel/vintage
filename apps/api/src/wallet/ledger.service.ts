// ============================================
// Ledger Service (Double-entry bookkeeping)
// ============================================

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';

import type { BalanceType, LedgerReferenceType } from '@ludo-nexus/shared-types';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async credit(
    userId: string,
    amount: number,
    balanceType: BalanceType,
    referenceType: LedgerReferenceType,
    referenceId: string | null,
    description: string,
    idempotencyKey?: string
  ) {
    return this.createEntry(userId, 'credit', amount, balanceType, referenceType, referenceId, description, idempotencyKey);
  }

  async debit(
    userId: string,
    amount: number,
    balanceType: BalanceType,
    referenceType: LedgerReferenceType,
    referenceId: string | null,
    description: string,
    idempotencyKey?: string
  ) {
    return this.createEntry(userId, 'debit', -amount, balanceType, referenceType, referenceId, description, idempotencyKey);
  }

  async transfer(
    userId: string,
    amount: number,
    fromBalanceType: BalanceType,
    toBalanceType: BalanceType,
    referenceId: string,
    description: string
  ) {
    const idempotencyKey = `transfer-${referenceId}-${Date.now()}`;
    
    await this.createEntry(userId, 'debit', -amount, fromBalanceType, 'adjustment', referenceId, `${description} (from ${fromBalanceType})`, `${idempotencyKey}-debit`);
    await this.createEntry(userId, 'credit', amount, toBalanceType, 'adjustment', referenceId, `${description} (to ${toBalanceType})`, `${idempotencyKey}-credit`);
    
    return { success: true };
  }

  private async createEntry(
    userId: string,
    type: 'credit' | 'debit',
    amount: number, // positive for credit, negative for debit
    balanceType: BalanceType,
    referenceType: LedgerReferenceType,
    referenceId: string | null,
    description: string,
    idempotencyKey?: string
  ) {
    // Check idempotency
    if (idempotencyKey) {
      const existing = await this.prisma.ledgerEntry.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        this.logger.warn(`Idempotent entry already exists: ${idempotencyKey}`);
        return existing;
      }
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    // Get current balance for this type
    let currentBalance: bigint;
    switch (balanceType) {
      case 'available':
        currentBalance = wallet.available;
        break;
      case 'bonus':
        currentBalance = wallet.bonus;
        break;
      case 'locked':
        currentBalance = wallet.locked;
        break;
      case 'pending':
        currentBalance = wallet.pending;
        break;
      default:
        throw new BadRequestException('Invalid balance type');
    }

    const newBalance = currentBalance + BigInt(amount);

    // Prevent negative balances
    if (newBalance < 0) {
      throw new BadRequestException(`Insufficient ${balanceType} balance`);
    }

    // Use transaction for atomicity
    const entry = await this.prisma.$transaction(async (tx) => {
      // Update wallet balance
      const updateData: any = {};
      updateData[balanceType] = newBalance;
      await tx.wallet.update({
        where: { userId },
        data: updateData,
      });

      // Create ledger entry
      return tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          userId,
          type,
          amount: BigInt(amount),
          balanceType,
          referenceType,
          referenceId,
          description,
          runningBalance: newBalance,
          idempotencyKey: idempotencyKey ?? `entry-${uuidv4()}`,
        },
      });
    });

    return entry;
  }

  async getLedgerEntries(userId: string, page = 1, limit = 50) {
    const [entries, total] = await Promise.all([
      this.prisma.ledgerEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ledgerEntry.count({ where: { userId } }),
    ]);

    return {
      data: entries.map(e => ({
        ...e,
        amount: Number(e.amount),
        runningBalance: Number(e.runningBalance),
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async verifyLedgerIntegrity(userId: string) {
    const entries = await this.prisma.ledgerEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const balances = {
      available: 0n,
      bonus: 0n,
      locked: 0n,
      pending: 0n,
    };

    const errors: string[] = [];

    for (const entry of entries) {
      const amount = entry.amount;
      const balanceType = entry.balanceType as keyof typeof balances;
      
      balances[balanceType] += amount;
      
      if (balances[balanceType] !== entry.runningBalance) {
        errors.push(`Balance mismatch at entry ${entry.id}: expected ${balances[balanceType]}, got ${entry.runningBalance}`);
      }
    }

    // Compare with wallet
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (wallet) {
      if (wallet.available !== balances.available) {
        errors.push(`Wallet available mismatch: ${wallet.available} vs ${balances.available}`);
      }
      if (wallet.bonus !== balances.bonus) {
        errors.push(`Wallet bonus mismatch: ${wallet.bonus} vs ${balances.bonus}`);
      }
      if (wallet.locked !== balances.locked) {
        errors.push(`Wallet locked mismatch: ${wallet.locked} vs ${balances.locked}`);
      }
      if (wallet.pending !== balances.pending) {
        errors.push(`Wallet pending mismatch: ${wallet.pending} vs ${balances.pending}`);
      }
    }

    return { valid: errors.length === 0, errors, balances: Object.fromEntries(
      Object.entries(balances).map(([k, v]) => [k, Number(v)])
    )};
  }
}
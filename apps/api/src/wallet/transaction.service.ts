// ============================================
// Transaction Service
// ============================================

import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getTransactions(userId: string, filters: any = {}, page = 1, limit = 20) {
    const where: any = { userId };

    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = new Date(filters.fromDate);
      if (filters.toDate) where.createdAt.lte = new Date(filters.toDate);
    }
    if (filters.minAmount || filters.maxAmount) {
      where.amount = {};
      if (filters.minAmount) where.amount.gte = filters.minAmount;
      if (filters.maxAmount) where.amount.lte = filters.maxAmount;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions.map(t => ({
        ...t,
        amount: Number(t.amount),
        fee: Number(t.fee),
        netAmount: Number(t.netAmount),
      })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createTransaction(data: {
    userId: string;
    walletId: string;
    type: string;
    amount: number;
    fee?: number;
    balanceType: string;
    paymentMethod?: string;
    paymentProvider?: string;
    paymentReference?: string;
    description: string;
    metadata?: any;
    idempotencyKey: string;
  }) {
    // Check idempotency
    const existing = await this.prisma.transaction.findUnique({
      where: { idempotencyKey: data.idempotencyKey },
    });
    if (existing) return existing;

    return this.prisma.transaction.create({
      data: {
        ...data,
        amount: BigInt(data.amount),
        fee: BigInt(data.fee ?? 0),
        netAmount: BigInt(data.amount - (data.fee ?? 0)),
      },
    });
  }

  async updateTransactionStatus(transactionId: string, status: string, processedAt?: Date) {
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: status as any,
        processedAt: processedAt ?? new Date(),
      },
    });
  }
}
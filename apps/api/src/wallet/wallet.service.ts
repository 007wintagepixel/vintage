// ============================================
// Wallet Service
// ============================================

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { LedgerService } from './ledger.service';
import { TransactionService } from './transaction.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ledgerService: LedgerService,
    private readonly transactionService: TransactionService,
  ) {}

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      // Create wallet if doesn't exist
      return this.prisma.wallet.create({
        data: { userId },
      });
    }

    return {
      available: Number(wallet.available),
      bonus: Number(wallet.bonus),
      locked: Number(wallet.locked),
      pending: Number(wallet.pending),
      total: Number(wallet.available) + Number(wallet.bonus) + Number(wallet.locked) + Number(wallet.pending),
    };
  }

  async getDemoBalance(userId: string) {
    // Demo coins are just the available balance in demo mode
    const balance = await this.getBalance(userId);
    return {
      demoCoins: balance.available,
      bonusCoins: balance.bonus,
      lockedCoins: balance.locked,
      pendingCoins: balance.pending,
    };
  }

  async addDemoCoins(userId: string, amount: number, description: string, referenceId?: string) {
    return this.ledgerService.credit(userId, amount, 'available', 'bonus', referenceId, description);
  }

  async deductDemoCoins(userId: string, amount: number, description: string, referenceId?: string) {
    return this.ledgerService.debit(userId, amount, 'available', 'bonus', referenceId, description);
  }

  async lockFunds(userId: string, amount: number, referenceId: string, description: string) {
    return this.ledgerService.transfer(userId, amount, 'available', 'locked', referenceId, description);
  }

  async unlockFunds(userId: string, amount: number, referenceId: string, description: string) {
    return this.ledgerService.transfer(userId, amount, 'locked', 'available', referenceId, description);
  }

  async settleWin(userId: string, amount: number, referenceId: string, description: string) {
    // Move from locked to available with winnings
    await this.ledgerService.debit(userId, amount, 'locked', 'match_entry', referenceId, `Match entry refund`);
    return this.ledgerService.credit(userId, amount * 2, 'available', 'match_win', referenceId, description);
  }

  async getTransactions(userId: string, filters: any = {}, page = 1, limit = 20) {
    return this.transactionService.getTransactions(userId, filters, page, limit);
  }

  async getTransactionById(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.userId !== userId) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
// ============================================
// Wallet Controller
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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { WalletService } from './wallet.service';
import { WithdrawalService } from './withdrawal.service';
import { MockPaymentService } from './mock-payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

import type { TransactionFilter, Deposit, WithdrawalRequest } from '@ludo-nexus/validation';

@ApiTags('Wallet')
@Controller({ path: 'wallet', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly withdrawalService: WithdrawalService,
    private readonly mockPaymentService: MockPaymentService,
  ) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Wallet balance' })
  async getBalance(@CurrentUser('id') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Get('demo-balance')
  @ApiOperation({ summary: 'Get demo wallet balance' })
  @ApiResponse({ status: 200, description: 'Demo wallet balance' })
  async getDemoBalance(@CurrentUser('id') userId: string) {
    return this.walletService.getDemoBalance(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Transaction history' })
  async getTransactions(
    @CurrentUser('id') userId: string,
    @Query() filters: TransactionFilter,
  ) {
    return this.walletService.getTransactions(userId, filters, filters.page, filters.limit);
  }

  @Get('transactions/:transactionId')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction details' })
  async getTransaction(
    @CurrentUser('id') userId: string,
    @Param('transactionId') transactionId: string,
  ) {
    return this.walletService.getTransactionById(userId, transactionId);
  }

  @Get('ledger')
  @ApiOperation({ summary: 'Get ledger entries' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Ledger entries' })
  async getLedger(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    // This would be in LedgerService, for now return from wallet service
    return { data: [], meta: { page, limit, total: 0, totalPages: 0 } };
  }

  // ============================================
  // DEPOSIT
  // ============================================

  @Post('deposit')
  @ApiOperation({ summary: 'Create deposit request' })
  @ApiResponse({ status: 201, description: 'Deposit initiated' })
  @HttpCode(HttpStatus.CREATED)
  async deposit(
    @CurrentUser('id') userId: string,
    @Body() data: Deposit,
  ) {
    const idempotencyKey = `deposit-${userId}-${Date.now()}`;
    
    // Generate payment URL
    const { paymentUrl, transactionId, paymentReference } = await this.mockPaymentService.generatePaymentUrl(
      userId,
      data.amount,
      data.paymentMethod,
      data.returnUrl,
    );

    return {
      transactionId,
      paymentReference,
      paymentUrl,
      amount: data.amount,
      method: data.paymentMethod,
    };
  }

  @Post('deposit/mock-complete')
  @Public() // For demo callback
  @ApiOperation({ summary: 'Complete mock deposit (demo only)' })
  @ApiResponse({ status: 200, description: 'Mock deposit completed' })
  @HttpCode(HttpStatus.OK)
  async completeMockDeposit(
    @Body() data: { transactionId: string; outcome: 'success' | 'failed' },
  ) {
    return this.mockPaymentService.completeMockPayment(data.transactionId, data.outcome);
  }

  // ============================================
  // WITHDRAWAL
  // ============================================

  @Post('withdraw')
  @ApiOperation({ summary: 'Request withdrawal' })
  @ApiResponse({ status: 201, description: 'Withdrawal requested' })
  @HttpCode(HttpStatus.CREATED)
  async withdraw(
    @CurrentUser('id') userId: string,
    @Body() data: WithdrawalRequest,
  ) {
    return this.withdrawalService.requestWithdrawal(userId, data);
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'Get withdrawal history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Withdrawal history' })
  async getWithdrawals(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.withdrawalService.getWithdrawals(userId, page, limit);
  }

  @Get('withdrawals/:withdrawalId')
  @ApiOperation({ summary: 'Get withdrawal by ID' })
  @ApiResponse({ status: 200, description: 'Withdrawal details' })
  async getWithdrawal(
    @CurrentUser('id') userId: string,
    @Param('withdrawalId') withdrawalId: string,
  ) {
    return this.withdrawalService.getWithdrawalById(userId, withdrawalId);
  }
}
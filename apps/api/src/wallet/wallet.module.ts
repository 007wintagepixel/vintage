// ============================================
// Wallet Module
// ============================================

import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { TransactionService } from "./transaction.service";
import { LedgerService } from "./ledger.service";
import { WithdrawalService } from "./withdrawal.service";
import { MockPaymentService } from "./mock-payment.service";

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    TransactionService,
    LedgerService,
    WithdrawalService,
    MockPaymentService,
  ],
  exports: [
    WalletService,
    TransactionService,
    LedgerService,
    WithdrawalService,
    MockPaymentService,
  ],
})
export class WalletModule {}

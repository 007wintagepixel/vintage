import { z } from 'zod';
import { UUIDSchema, TimestampSchema, PaginationSchema } from '../game/types';

// ============================================
// WALLET TYPES
// ============================================

export const BalanceTypeSchema = z.enum(['available', 'bonus', 'locked', 'pending']);
export type BalanceType = z.infer<typeof BalanceTypeSchema>;

export const WalletBalanceSchema = z.object({
  userId: UUIDSchema,
  available: z.number().int().nonnegative().default(0),
  bonus: z.number().int().nonnegative().default(0),
  locked: z.number().int().nonnegative().default(0),
  pending: z.number().int().nonnegative().default(0),
  updatedAt: TimestampSchema,
});
export type WalletBalance = z.infer<typeof WalletBalanceSchema>;

export const LedgerEntrySchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  type: z.enum(['credit', 'debit']),
  amount: z.number().int(), // positive for credit, negative for debit
  balanceType: BalanceTypeSchema,
  referenceType: z.enum([
    'match_entry',
    'match_win',
    'match_loss',
    'match_refund',
    'deposit',
    'withdrawal',
    'bonus',
    'promotion',
    'referral',
    'tournament_prize',
    'platform_fee',
    'adjustment',
  ]),
  referenceId: UUIDSchema.nullable(),
  description: z.string().max(500),
  runningBalance: z.number().int(),
  idempotencyKey: z.string().max(100),
  createdAt: TimestampSchema,
});
export type LedgerEntry = z.infer<typeof LedgerEntrySchema>;

export const TransactionSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  type: z.enum(['deposit', 'withdrawal', 'match', 'tournament', 'bonus', 'refund', 'transfer']),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed']),
  amount: z.number().int(), // positive for credit, negative for debit
  fee: z.number().int().nonnegative().default(0),
  netAmount: z.number().int(),
  balanceType: BalanceTypeSchema,
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'wallet', 'demo', 'internal']).nullable(),
  paymentProvider: z.string().max(50).nullable(),
  paymentReference: z.string().max(100).nullable(),
  description: z.string().max(500),
  metadata: z.record(z.unknown()).optional(),
  idempotencyKey: z.string().max(100),
  processedAt: TimestampSchema.nullable(),
  createdAt: TimestampSchema,
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const DepositRequestSchema = z.object({
  amount: z.number().int().positive(),
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'wallet']),
  paymentProvider: z.string().max(50).optional(),
  returnUrl: z.string().url().optional(),
});
export type DepositRequest = z.infer<typeof DepositRequestSchema>;

export const WithdrawalRequestSchema = z.object({
  amount: z.number().int().positive(),
  destinationMethod: z.enum(['upi', 'bank_transfer']),
  destinationDetails: z.object({
    upiId: z.string().max(100).optional(),
    accountNumber: z.string().max(50).optional(),
    ifsc: z.string().max(20).optional(),
    accountHolderName: z.string().max(100).optional(),
  }),
  otp: z.string().length(6).regex(/^\d{6}$/),
});
export type WithdrawalRequest = z.infer<typeof WithdrawalRequestSchema>;

export const WithdrawalSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  amount: z.number().int().positive(),
  fee: z.number().int().nonnegative(),
  netAmount: z.number().int().positive(),
  destinationMethod: z.enum(['upi', 'bank_transfer']),
  destinationDetails: z.record(z.string()),
  status: z.enum(['requested', 'under_review', 'approved', 'processing', 'completed', 'rejected', 'reversed', 'cancelled']),
  reviewedAt: TimestampSchema.nullable(),
  reviewedBy: UUIDSchema.nullable(),
  processedAt: TimestampSchema.nullable(),
  rejectionReason: z.string().nullable(),
  createdAt: TimestampSchema,
});
export type Withdrawal = z.infer<typeof WithdrawalSchema>;

// ============================================
// GAME ECONOMICS
// ============================================

export const GameEconomicsSchema = z.object({
  matchId: UUIDSchema,
  playerCount: z.number().int().min(2).max(4),
  entryFee: z.number().int().nonnegative(),
  totalPool: z.number().int().nonnegative(),
  platformFee: z.number().int().nonnegative(),
  winnerReward: z.number().int().nonnegative(),
  cancellationRule: z.string(),
  refundRule: z.string(),
  isDemo: z.boolean().default(true),
});
export type GameEconomics = z.infer<typeof GameEconomicsSchema>;

export const MatchEconomicsConfigSchema = z.object({
  entryFees: z.record(z.string(), z.number().int().nonnegative()), // mode -> fee
  platformFeePercent: z.number().min(0).max(100).default(10),
  minPlayers: z.number().int().min(2).max(4).default(4),
  maxPlayers: z.number().int().min(2).max(4).default(4),
  demoMode: z.boolean().default(true),
});
export type MatchEconomicsConfig = z.infer<typeof MatchEconomicsConfigSchema>;

// ============================================
// EXPORTS
// ============================================

export const WalletSchemas = {
  WalletBalance: WalletBalanceSchema,
  LedgerEntry: LedgerEntrySchema,
  Transaction: TransactionSchema,
  DepositRequest: DepositRequestSchema,
  WithdrawalRequest: WithdrawalRequestSchema,
  Withdrawal: WithdrawalSchema,
  GameEconomics: GameEconomicsSchema,
  MatchEconomicsConfig: MatchEconomicsConfigSchema,
};
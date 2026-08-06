"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSchemas = exports.MatchEconomicsConfigSchema = exports.GameEconomicsSchema = exports.WithdrawalSchema = exports.WithdrawalRequestSchema = exports.DepositRequestSchema = exports.TransactionSchema = exports.LedgerEntrySchema = exports.WalletBalanceSchema = exports.LedgerReferenceTypeSchema = exports.BalanceTypeSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../game/types");
// ============================================
// WALLET TYPES
// ============================================
exports.BalanceTypeSchema = zod_1.z.enum(['available', 'bonus', 'locked', 'pending']);
exports.LedgerReferenceTypeSchema = zod_1.z.enum([
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
]);
exports.WalletBalanceSchema = zod_1.z.object({
    userId: types_1.UUIDSchema,
    available: zod_1.z.number().int().nonnegative().default(0),
    bonus: zod_1.z.number().int().nonnegative().default(0),
    locked: zod_1.z.number().int().nonnegative().default(0),
    pending: zod_1.z.number().int().nonnegative().default(0),
    updatedAt: types_1.TimestampSchema,
});
exports.LedgerEntrySchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    userId: types_1.UUIDSchema,
    type: zod_1.z.enum(['credit', 'debit']),
    amount: zod_1.z.number().int(), // positive for credit, negative for debit
    balanceType: exports.BalanceTypeSchema,
    referenceType: exports.LedgerReferenceTypeSchema,
    referenceId: types_1.UUIDSchema.nullable(),
    description: zod_1.z.string().max(500),
    runningBalance: zod_1.z.number().int(),
    idempotencyKey: zod_1.z.string().max(100),
    createdAt: types_1.TimestampSchema,
});
exports.TransactionSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    userId: types_1.UUIDSchema,
    type: zod_1.z.enum(['deposit', 'withdrawal', 'match', 'tournament', 'bonus', 'refund', 'transfer']),
    status: zod_1.z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed']),
    amount: zod_1.z.number().int(), // positive for credit, negative for debit
    fee: zod_1.z.number().int().nonnegative().default(0),
    netAmount: zod_1.z.number().int(),
    balanceType: exports.BalanceTypeSchema,
    paymentMethod: zod_1.z.enum(['upi', 'card', 'netbanking', 'wallet', 'demo', 'internal']).nullable(),
    paymentProvider: zod_1.z.string().max(50).nullable(),
    paymentReference: zod_1.z.string().max(100).nullable(),
    description: zod_1.z.string().max(500),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
    idempotencyKey: zod_1.z.string().max(100),
    processedAt: types_1.TimestampSchema.nullable(),
    createdAt: types_1.TimestampSchema,
});
exports.DepositRequestSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive(),
    paymentMethod: zod_1.z.enum(['upi', 'card', 'netbanking', 'wallet']),
    paymentProvider: zod_1.z.string().max(50).optional(),
    returnUrl: zod_1.z.string().url().optional(),
});
exports.WithdrawalRequestSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive(),
    destinationMethod: zod_1.z.enum(['upi', 'bank_transfer']),
    destinationDetails: zod_1.z.object({
        upiId: zod_1.z.string().max(100).optional(),
        accountNumber: zod_1.z.string().max(50).optional(),
        ifsc: zod_1.z.string().max(20).optional(),
        accountHolderName: zod_1.z.string().max(100).optional(),
    }),
    otp: zod_1.z.string().length(6).regex(/^\d{6}$/),
});
exports.WithdrawalSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    userId: types_1.UUIDSchema,
    amount: zod_1.z.number().int().positive(),
    fee: zod_1.z.number().int().nonnegative(),
    netAmount: zod_1.z.number().int().positive(),
    destinationMethod: zod_1.z.enum(['upi', 'bank_transfer']),
    destinationDetails: zod_1.z.record(zod_1.z.string()),
    status: zod_1.z.enum(['requested', 'under_review', 'approved', 'processing', 'completed', 'rejected', 'reversed', 'cancelled']),
    reviewedAt: types_1.TimestampSchema.nullable(),
    reviewedBy: types_1.UUIDSchema.nullable(),
    processedAt: types_1.TimestampSchema.nullable(),
    rejectionReason: zod_1.z.string().nullable(),
    createdAt: types_1.TimestampSchema,
});
// ============================================
// GAME ECONOMICS
// ============================================
exports.GameEconomicsSchema = zod_1.z.object({
    matchId: types_1.UUIDSchema,
    playerCount: zod_1.z.number().int().min(2).max(4),
    entryFee: zod_1.z.number().int().nonnegative(),
    totalPool: zod_1.z.number().int().nonnegative(),
    platformFee: zod_1.z.number().int().nonnegative(),
    winnerReward: zod_1.z.number().int().nonnegative(),
    cancellationRule: zod_1.z.string(),
    refundRule: zod_1.z.string(),
    isDemo: zod_1.z.boolean().default(true),
});
exports.MatchEconomicsConfigSchema = zod_1.z.object({
    entryFees: zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().nonnegative()), // mode -> fee
    platformFeePercent: zod_1.z.number().min(0).max(100).default(10),
    minPlayers: zod_1.z.number().int().min(2).max(4).default(4),
    maxPlayers: zod_1.z.number().int().min(2).max(4).default(4),
    demoMode: zod_1.z.boolean().default(true),
});
// ============================================
// EXPORTS
// ============================================
exports.WalletSchemas = {
    WalletBalance: exports.WalletBalanceSchema,
    LedgerEntry: exports.LedgerEntrySchema,
    Transaction: exports.TransactionSchema,
    DepositRequest: exports.DepositRequestSchema,
    WithdrawalRequest: exports.WithdrawalRequestSchema,
    Withdrawal: exports.WithdrawalSchema,
    GameEconomics: exports.GameEconomicsSchema,
    MatchEconomicsConfig: exports.MatchEconomicsConfigSchema,
};

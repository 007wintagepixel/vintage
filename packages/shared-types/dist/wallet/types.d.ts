import { z } from 'zod';
export declare const BalanceTypeSchema: z.ZodEnum<["available", "bonus", "locked", "pending"]>;
export type BalanceType = z.infer<typeof BalanceTypeSchema>;
export declare const LedgerReferenceTypeSchema: z.ZodEnum<["match_entry", "match_win", "match_loss", "match_refund", "deposit", "withdrawal", "bonus", "promotion", "referral", "tournament_prize", "platform_fee", "adjustment"]>;
export type LedgerReferenceType = z.infer<typeof LedgerReferenceTypeSchema>;
export declare const WalletBalanceSchema: z.ZodObject<{
    userId: z.ZodString;
    available: z.ZodDefault<z.ZodNumber>;
    bonus: z.ZodDefault<z.ZodNumber>;
    locked: z.ZodDefault<z.ZodNumber>;
    pending: z.ZodDefault<z.ZodNumber>;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    pending: number;
    available: number;
    bonus: number;
    locked: number;
    updatedAt: string;
}, {
    userId: string;
    updatedAt: string;
    pending?: number | undefined;
    available?: number | undefined;
    bonus?: number | undefined;
    locked?: number | undefined;
}>;
export type WalletBalance = z.infer<typeof WalletBalanceSchema>;
export declare const LedgerEntrySchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<["credit", "debit"]>;
    amount: z.ZodNumber;
    balanceType: z.ZodEnum<["available", "bonus", "locked", "pending"]>;
    referenceType: z.ZodEnum<["match_entry", "match_win", "match_loss", "match_refund", "deposit", "withdrawal", "bonus", "promotion", "referral", "tournament_prize", "platform_fee", "adjustment"]>;
    referenceId: z.ZodNullable<z.ZodString>;
    description: z.ZodString;
    runningBalance: z.ZodNumber;
    idempotencyKey: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "credit" | "debit";
    id: string;
    userId: string;
    createdAt: string;
    description: string;
    amount: number;
    balanceType: "pending" | "available" | "bonus" | "locked";
    referenceType: "bonus" | "match_entry" | "match_win" | "match_loss" | "match_refund" | "deposit" | "withdrawal" | "promotion" | "referral" | "tournament_prize" | "platform_fee" | "adjustment";
    referenceId: string | null;
    runningBalance: number;
    idempotencyKey: string;
}, {
    type: "credit" | "debit";
    id: string;
    userId: string;
    createdAt: string;
    description: string;
    amount: number;
    balanceType: "pending" | "available" | "bonus" | "locked";
    referenceType: "bonus" | "match_entry" | "match_win" | "match_loss" | "match_refund" | "deposit" | "withdrawal" | "promotion" | "referral" | "tournament_prize" | "platform_fee" | "adjustment";
    referenceId: string | null;
    runningBalance: number;
    idempotencyKey: string;
}>;
export type LedgerEntry = z.infer<typeof LedgerEntrySchema>;
export declare const TransactionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<["deposit", "withdrawal", "match", "tournament", "bonus", "refund", "transfer"]>;
    status: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "reversed"]>;
    amount: z.ZodNumber;
    fee: z.ZodDefault<z.ZodNumber>;
    netAmount: z.ZodNumber;
    balanceType: z.ZodEnum<["available", "bonus", "locked", "pending"]>;
    paymentMethod: z.ZodNullable<z.ZodEnum<["upi", "card", "netbanking", "wallet", "demo", "internal"]>>;
    paymentProvider: z.ZodNullable<z.ZodString>;
    paymentReference: z.ZodNullable<z.ZodString>;
    description: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    idempotencyKey: z.ZodString;
    processedAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "tournament" | "bonus" | "deposit" | "withdrawal" | "match" | "refund" | "transfer";
    status: "completed" | "cancelled" | "pending" | "processing" | "failed" | "reversed";
    id: string;
    userId: string;
    createdAt: string;
    description: string;
    amount: number;
    balanceType: "pending" | "available" | "bonus" | "locked";
    idempotencyKey: string;
    fee: number;
    netAmount: number;
    paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "demo" | "internal" | null;
    paymentProvider: string | null;
    paymentReference: string | null;
    processedAt: string | null;
    metadata?: Record<string, unknown> | undefined;
}, {
    type: "tournament" | "bonus" | "deposit" | "withdrawal" | "match" | "refund" | "transfer";
    status: "completed" | "cancelled" | "pending" | "processing" | "failed" | "reversed";
    id: string;
    userId: string;
    createdAt: string;
    description: string;
    amount: number;
    balanceType: "pending" | "available" | "bonus" | "locked";
    idempotencyKey: string;
    netAmount: number;
    paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "demo" | "internal" | null;
    paymentProvider: string | null;
    paymentReference: string | null;
    processedAt: string | null;
    metadata?: Record<string, unknown> | undefined;
    fee?: number | undefined;
}>;
export type Transaction = z.infer<typeof TransactionSchema>;
export declare const DepositRequestSchema: z.ZodObject<{
    amount: z.ZodNumber;
    paymentMethod: z.ZodEnum<["upi", "card", "netbanking", "wallet"]>;
    paymentProvider: z.ZodOptional<z.ZodString>;
    returnUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    paymentMethod: "upi" | "card" | "netbanking" | "wallet";
    paymentProvider?: string | undefined;
    returnUrl?: string | undefined;
}, {
    amount: number;
    paymentMethod: "upi" | "card" | "netbanking" | "wallet";
    paymentProvider?: string | undefined;
    returnUrl?: string | undefined;
}>;
export type DepositRequest = z.infer<typeof DepositRequestSchema>;
export declare const WithdrawalRequestSchema: z.ZodObject<{
    amount: z.ZodNumber;
    destinationMethod: z.ZodEnum<["upi", "bank_transfer"]>;
    destinationDetails: z.ZodObject<{
        upiId: z.ZodOptional<z.ZodString>;
        accountNumber: z.ZodOptional<z.ZodString>;
        ifsc: z.ZodOptional<z.ZodString>;
        accountHolderName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        upiId?: string | undefined;
        accountNumber?: string | undefined;
        ifsc?: string | undefined;
        accountHolderName?: string | undefined;
    }, {
        upiId?: string | undefined;
        accountNumber?: string | undefined;
        ifsc?: string | undefined;
        accountHolderName?: string | undefined;
    }>;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: number;
    destinationMethod: "upi" | "bank_transfer";
    destinationDetails: {
        upiId?: string | undefined;
        accountNumber?: string | undefined;
        ifsc?: string | undefined;
        accountHolderName?: string | undefined;
    };
    otp: string;
}, {
    amount: number;
    destinationMethod: "upi" | "bank_transfer";
    destinationDetails: {
        upiId?: string | undefined;
        accountNumber?: string | undefined;
        ifsc?: string | undefined;
        accountHolderName?: string | undefined;
    };
    otp: string;
}>;
export type WithdrawalRequest = z.infer<typeof WithdrawalRequestSchema>;
export declare const WithdrawalSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    amount: z.ZodNumber;
    fee: z.ZodNumber;
    netAmount: z.ZodNumber;
    destinationMethod: z.ZodEnum<["upi", "bank_transfer"]>;
    destinationDetails: z.ZodRecord<z.ZodString, z.ZodString>;
    status: z.ZodEnum<["requested", "under_review", "approved", "processing", "completed", "rejected", "reversed", "cancelled"]>;
    reviewedAt: z.ZodNullable<z.ZodString>;
    reviewedBy: z.ZodNullable<z.ZodString>;
    processedAt: z.ZodNullable<z.ZodString>;
    rejectionReason: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "completed" | "cancelled" | "under_review" | "rejected" | "approved" | "processing" | "reversed" | "requested";
    id: string;
    userId: string;
    createdAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason: string | null;
    amount: number;
    fee: number;
    netAmount: number;
    processedAt: string | null;
    destinationMethod: "upi" | "bank_transfer";
    destinationDetails: Record<string, string>;
}, {
    status: "completed" | "cancelled" | "under_review" | "rejected" | "approved" | "processing" | "reversed" | "requested";
    id: string;
    userId: string;
    createdAt: string;
    reviewedAt: string | null;
    reviewedBy: string | null;
    rejectionReason: string | null;
    amount: number;
    fee: number;
    netAmount: number;
    processedAt: string | null;
    destinationMethod: "upi" | "bank_transfer";
    destinationDetails: Record<string, string>;
}>;
export type Withdrawal = z.infer<typeof WithdrawalSchema>;
export declare const GameEconomicsSchema: z.ZodObject<{
    matchId: z.ZodString;
    playerCount: z.ZodNumber;
    entryFee: z.ZodNumber;
    totalPool: z.ZodNumber;
    platformFee: z.ZodNumber;
    winnerReward: z.ZodNumber;
    cancellationRule: z.ZodString;
    refundRule: z.ZodString;
    isDemo: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    matchId: string;
    entryFee: number;
    platformFee: number;
    playerCount: number;
    totalPool: number;
    winnerReward: number;
    cancellationRule: string;
    refundRule: string;
    isDemo: boolean;
}, {
    matchId: string;
    entryFee: number;
    platformFee: number;
    playerCount: number;
    totalPool: number;
    winnerReward: number;
    cancellationRule: string;
    refundRule: string;
    isDemo?: boolean | undefined;
}>;
export type GameEconomics = z.infer<typeof GameEconomicsSchema>;
export declare const MatchEconomicsConfigSchema: z.ZodObject<{
    entryFees: z.ZodRecord<z.ZodString, z.ZodNumber>;
    platformFeePercent: z.ZodDefault<z.ZodNumber>;
    minPlayers: z.ZodDefault<z.ZodNumber>;
    maxPlayers: z.ZodDefault<z.ZodNumber>;
    demoMode: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    maxPlayers: number;
    entryFees: Record<string, number>;
    platformFeePercent: number;
    minPlayers: number;
    demoMode: boolean;
}, {
    entryFees: Record<string, number>;
    maxPlayers?: number | undefined;
    platformFeePercent?: number | undefined;
    minPlayers?: number | undefined;
    demoMode?: boolean | undefined;
}>;
export type MatchEconomicsConfig = z.infer<typeof MatchEconomicsConfigSchema>;
export declare const WalletSchemas: {
    WalletBalance: z.ZodObject<{
        userId: z.ZodString;
        available: z.ZodDefault<z.ZodNumber>;
        bonus: z.ZodDefault<z.ZodNumber>;
        locked: z.ZodDefault<z.ZodNumber>;
        pending: z.ZodDefault<z.ZodNumber>;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        pending: number;
        available: number;
        bonus: number;
        locked: number;
        updatedAt: string;
    }, {
        userId: string;
        updatedAt: string;
        pending?: number | undefined;
        available?: number | undefined;
        bonus?: number | undefined;
        locked?: number | undefined;
    }>;
    LedgerEntry: z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        type: z.ZodEnum<["credit", "debit"]>;
        amount: z.ZodNumber;
        balanceType: z.ZodEnum<["available", "bonus", "locked", "pending"]>;
        referenceType: z.ZodEnum<["match_entry", "match_win", "match_loss", "match_refund", "deposit", "withdrawal", "bonus", "promotion", "referral", "tournament_prize", "platform_fee", "adjustment"]>;
        referenceId: z.ZodNullable<z.ZodString>;
        description: z.ZodString;
        runningBalance: z.ZodNumber;
        idempotencyKey: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "credit" | "debit";
        id: string;
        userId: string;
        createdAt: string;
        description: string;
        amount: number;
        balanceType: "pending" | "available" | "bonus" | "locked";
        referenceType: "bonus" | "match_entry" | "match_win" | "match_loss" | "match_refund" | "deposit" | "withdrawal" | "promotion" | "referral" | "tournament_prize" | "platform_fee" | "adjustment";
        referenceId: string | null;
        runningBalance: number;
        idempotencyKey: string;
    }, {
        type: "credit" | "debit";
        id: string;
        userId: string;
        createdAt: string;
        description: string;
        amount: number;
        balanceType: "pending" | "available" | "bonus" | "locked";
        referenceType: "bonus" | "match_entry" | "match_win" | "match_loss" | "match_refund" | "deposit" | "withdrawal" | "promotion" | "referral" | "tournament_prize" | "platform_fee" | "adjustment";
        referenceId: string | null;
        runningBalance: number;
        idempotencyKey: string;
    }>;
    Transaction: z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        type: z.ZodEnum<["deposit", "withdrawal", "match", "tournament", "bonus", "refund", "transfer"]>;
        status: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "reversed"]>;
        amount: z.ZodNumber;
        fee: z.ZodDefault<z.ZodNumber>;
        netAmount: z.ZodNumber;
        balanceType: z.ZodEnum<["available", "bonus", "locked", "pending"]>;
        paymentMethod: z.ZodNullable<z.ZodEnum<["upi", "card", "netbanking", "wallet", "demo", "internal"]>>;
        paymentProvider: z.ZodNullable<z.ZodString>;
        paymentReference: z.ZodNullable<z.ZodString>;
        description: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        idempotencyKey: z.ZodString;
        processedAt: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "tournament" | "bonus" | "deposit" | "withdrawal" | "match" | "refund" | "transfer";
        status: "completed" | "cancelled" | "pending" | "processing" | "failed" | "reversed";
        id: string;
        userId: string;
        createdAt: string;
        description: string;
        amount: number;
        balanceType: "pending" | "available" | "bonus" | "locked";
        idempotencyKey: string;
        fee: number;
        netAmount: number;
        paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "demo" | "internal" | null;
        paymentProvider: string | null;
        paymentReference: string | null;
        processedAt: string | null;
        metadata?: Record<string, unknown> | undefined;
    }, {
        type: "tournament" | "bonus" | "deposit" | "withdrawal" | "match" | "refund" | "transfer";
        status: "completed" | "cancelled" | "pending" | "processing" | "failed" | "reversed";
        id: string;
        userId: string;
        createdAt: string;
        description: string;
        amount: number;
        balanceType: "pending" | "available" | "bonus" | "locked";
        idempotencyKey: string;
        netAmount: number;
        paymentMethod: "upi" | "card" | "netbanking" | "wallet" | "demo" | "internal" | null;
        paymentProvider: string | null;
        paymentReference: string | null;
        processedAt: string | null;
        metadata?: Record<string, unknown> | undefined;
        fee?: number | undefined;
    }>;
    DepositRequest: z.ZodObject<{
        amount: z.ZodNumber;
        paymentMethod: z.ZodEnum<["upi", "card", "netbanking", "wallet"]>;
        paymentProvider: z.ZodOptional<z.ZodString>;
        returnUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        paymentMethod: "upi" | "card" | "netbanking" | "wallet";
        paymentProvider?: string | undefined;
        returnUrl?: string | undefined;
    }, {
        amount: number;
        paymentMethod: "upi" | "card" | "netbanking" | "wallet";
        paymentProvider?: string | undefined;
        returnUrl?: string | undefined;
    }>;
    WithdrawalRequest: z.ZodObject<{
        amount: z.ZodNumber;
        destinationMethod: z.ZodEnum<["upi", "bank_transfer"]>;
        destinationDetails: z.ZodObject<{
            upiId: z.ZodOptional<z.ZodString>;
            accountNumber: z.ZodOptional<z.ZodString>;
            ifsc: z.ZodOptional<z.ZodString>;
            accountHolderName: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            upiId?: string | undefined;
            accountNumber?: string | undefined;
            ifsc?: string | undefined;
            accountHolderName?: string | undefined;
        }, {
            upiId?: string | undefined;
            accountNumber?: string | undefined;
            ifsc?: string | undefined;
            accountHolderName?: string | undefined;
        }>;
        otp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        destinationMethod: "upi" | "bank_transfer";
        destinationDetails: {
            upiId?: string | undefined;
            accountNumber?: string | undefined;
            ifsc?: string | undefined;
            accountHolderName?: string | undefined;
        };
        otp: string;
    }, {
        amount: number;
        destinationMethod: "upi" | "bank_transfer";
        destinationDetails: {
            upiId?: string | undefined;
            accountNumber?: string | undefined;
            ifsc?: string | undefined;
            accountHolderName?: string | undefined;
        };
        otp: string;
    }>;
    Withdrawal: z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        amount: z.ZodNumber;
        fee: z.ZodNumber;
        netAmount: z.ZodNumber;
        destinationMethod: z.ZodEnum<["upi", "bank_transfer"]>;
        destinationDetails: z.ZodRecord<z.ZodString, z.ZodString>;
        status: z.ZodEnum<["requested", "under_review", "approved", "processing", "completed", "rejected", "reversed", "cancelled"]>;
        reviewedAt: z.ZodNullable<z.ZodString>;
        reviewedBy: z.ZodNullable<z.ZodString>;
        processedAt: z.ZodNullable<z.ZodString>;
        rejectionReason: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "completed" | "cancelled" | "under_review" | "rejected" | "approved" | "processing" | "reversed" | "requested";
        id: string;
        userId: string;
        createdAt: string;
        reviewedAt: string | null;
        reviewedBy: string | null;
        rejectionReason: string | null;
        amount: number;
        fee: number;
        netAmount: number;
        processedAt: string | null;
        destinationMethod: "upi" | "bank_transfer";
        destinationDetails: Record<string, string>;
    }, {
        status: "completed" | "cancelled" | "under_review" | "rejected" | "approved" | "processing" | "reversed" | "requested";
        id: string;
        userId: string;
        createdAt: string;
        reviewedAt: string | null;
        reviewedBy: string | null;
        rejectionReason: string | null;
        amount: number;
        fee: number;
        netAmount: number;
        processedAt: string | null;
        destinationMethod: "upi" | "bank_transfer";
        destinationDetails: Record<string, string>;
    }>;
    GameEconomics: z.ZodObject<{
        matchId: z.ZodString;
        playerCount: z.ZodNumber;
        entryFee: z.ZodNumber;
        totalPool: z.ZodNumber;
        platformFee: z.ZodNumber;
        winnerReward: z.ZodNumber;
        cancellationRule: z.ZodString;
        refundRule: z.ZodString;
        isDemo: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        matchId: string;
        entryFee: number;
        platformFee: number;
        playerCount: number;
        totalPool: number;
        winnerReward: number;
        cancellationRule: string;
        refundRule: string;
        isDemo: boolean;
    }, {
        matchId: string;
        entryFee: number;
        platformFee: number;
        playerCount: number;
        totalPool: number;
        winnerReward: number;
        cancellationRule: string;
        refundRule: string;
        isDemo?: boolean | undefined;
    }>;
    MatchEconomicsConfig: z.ZodObject<{
        entryFees: z.ZodRecord<z.ZodString, z.ZodNumber>;
        platformFeePercent: z.ZodDefault<z.ZodNumber>;
        minPlayers: z.ZodDefault<z.ZodNumber>;
        maxPlayers: z.ZodDefault<z.ZodNumber>;
        demoMode: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        maxPlayers: number;
        entryFees: Record<string, number>;
        platformFeePercent: number;
        minPlayers: number;
        demoMode: boolean;
    }, {
        entryFees: Record<string, number>;
        maxPlayers?: number | undefined;
        platformFeePercent?: number | undefined;
        minPlayers?: number | undefined;
        demoMode?: boolean | undefined;
    }>;
};
//# sourceMappingURL=types.d.ts.map
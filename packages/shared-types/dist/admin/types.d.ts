import { z } from 'zod';
export declare const AdminUserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    username: z.ZodString;
    fullName: z.ZodString;
    role: z.ZodEnum<["super_admin", "admin", "moderator", "support"]>;
    permissions: z.ZodArray<z.ZodString, "many">;
    isActive: z.ZodDefault<z.ZodBoolean>;
    lastLoginAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    isActive: boolean;
    createdAt: string;
    username: string;
    fullName: string;
    email: string;
    lastLoginAt: string | null;
    role: "support" | "super_admin" | "admin" | "moderator";
    permissions: string[];
}, {
    id: string;
    createdAt: string;
    username: string;
    fullName: string;
    email: string;
    lastLoginAt: string | null;
    role: "support" | "super_admin" | "admin" | "moderator";
    permissions: string[];
    isActive?: boolean | undefined;
}>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export declare const CreateAdminSchema: z.ZodObject<{
    email: z.ZodString;
    username: z.ZodString;
    fullName: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["admin", "moderator", "support"]>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    username: string;
    fullName: string;
    email: string;
    password: string;
    role: "support" | "admin" | "moderator";
    permissions?: string[] | undefined;
}, {
    username: string;
    fullName: string;
    email: string;
    password: string;
    role: "support" | "admin" | "moderator";
    permissions?: string[] | undefined;
}>;
export type CreateAdmin = z.infer<typeof CreateAdminSchema>;
export declare const AuditLogSchema: z.ZodObject<{
    id: z.ZodString;
    adminId: z.ZodNullable<z.ZodString>;
    userId: z.ZodNullable<z.ZodString>;
    action: z.ZodString;
    resourceType: z.ZodString;
    resourceId: z.ZodNullable<z.ZodString>;
    oldData: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    newData: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    ipAddress: z.ZodNullable<z.ZodString>;
    userAgent: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string | null;
    createdAt: string;
    ipAddress: string | null;
    userAgent: string | null;
    action: string;
    adminId: string | null;
    resourceType: string;
    resourceId: string | null;
    oldData: Record<string, unknown> | null;
    newData: Record<string, unknown> | null;
}, {
    id: string;
    userId: string | null;
    createdAt: string;
    ipAddress: string | null;
    userAgent: string | null;
    action: string;
    adminId: string | null;
    resourceType: string;
    resourceId: string | null;
    oldData: Record<string, unknown> | null;
    newData: Record<string, unknown> | null;
}>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export declare const FraudAlertSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodEnum<["multiple_accounts", "suspicious_gameplay", "wallet_manipulation", "bot_usage", "collusion", "other"]>;
    severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
    description: z.ZodString;
    evidence: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    status: z.ZodEnum<["open", "investigating", "resolved", "dismissed"]>;
    assignedTo: z.ZodNullable<z.ZodString>;
    resolvedAt: z.ZodNullable<z.ZodString>;
    resolvedBy: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "multiple_accounts" | "suspicious_gameplay" | "wallet_manipulation" | "bot_usage" | "collusion" | "other";
    status: "open" | "investigating" | "resolved" | "dismissed";
    id: string;
    userId: string;
    createdAt: string;
    description: string;
    severity: "medium" | "low" | "high" | "critical";
    evidence: Record<string, unknown>;
    assignedTo: string | null;
    resolvedAt: string | null;
    resolvedBy: string | null;
}, {
    type: "multiple_accounts" | "suspicious_gameplay" | "wallet_manipulation" | "bot_usage" | "collusion" | "other";
    status: "open" | "investigating" | "resolved" | "dismissed";
    id: string;
    userId: string;
    createdAt: string;
    description: string;
    severity: "medium" | "low" | "high" | "critical";
    evidence: Record<string, unknown>;
    assignedTo: string | null;
    resolvedAt: string | null;
    resolvedBy: string | null;
}>;
export type FraudAlert = z.infer<typeof FraudAlertSchema>;
export declare const GameSettingsSchema: z.ZodObject<{
    id: z.ZodString;
    key: z.ZodString;
    value: z.ZodUnknown;
    description: z.ZodString;
    category: z.ZodEnum<["gameplay", "economics", "matchmaking", "tournament", "security", "ui"]>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    updatedAt: z.ZodString;
    updatedBy: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    isPublic: boolean;
    description: string;
    category: "tournament" | "gameplay" | "economics" | "matchmaking" | "security" | "ui";
    updatedAt: string;
    key: string;
    updatedBy: string;
    value?: unknown;
}, {
    id: string;
    description: string;
    category: "tournament" | "gameplay" | "economics" | "matchmaking" | "security" | "ui";
    updatedAt: string;
    key: string;
    updatedBy: string;
    value?: unknown;
    isPublic?: boolean | undefined;
}>;
export type GameSettings = z.infer<typeof GameSettingsSchema>;
export declare const UpdateGameSettingsSchema: z.ZodObject<{
    settings: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodUnknown;
    }, "strip", z.ZodTypeAny, {
        key: string;
        value?: unknown;
    }, {
        key: string;
        value?: unknown;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    settings: {
        key: string;
        value?: unknown;
    }[];
}, {
    settings: {
        key: string;
        value?: unknown;
    }[];
}>;
export type UpdateGameSettings = z.infer<typeof UpdateGameSettingsSchema>;
export declare const AdminDashboardStatsSchema: z.ZodObject<{
    totalUsers: z.ZodNumber;
    activeUsers24h: z.ZodNumber;
    activeUsers7d: z.ZodNumber;
    activeUsers30d: z.ZodNumber;
    totalMatches: z.ZodNumber;
    matches24h: z.ZodNumber;
    totalTournaments: z.ZodNumber;
    activeTournaments: z.ZodNumber;
    totalDemoCoinsInCirculation: z.ZodNumber;
    pendingWithdrawals: z.ZodNumber;
    pendingKYC: z.ZodNumber;
    openFraudAlerts: z.ZodNumber;
    revenue24h: z.ZodNumber;
    revenue7d: z.ZodNumber;
    revenue30d: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalMatches: number;
    totalUsers: number;
    activeUsers24h: number;
    activeUsers7d: number;
    activeUsers30d: number;
    matches24h: number;
    totalTournaments: number;
    activeTournaments: number;
    totalDemoCoinsInCirculation: number;
    pendingWithdrawals: number;
    pendingKYC: number;
    openFraudAlerts: number;
    revenue24h: number;
    revenue7d: number;
    revenue30d: number;
}, {
    totalMatches: number;
    totalUsers: number;
    activeUsers24h: number;
    activeUsers7d: number;
    activeUsers30d: number;
    matches24h: number;
    totalTournaments: number;
    activeTournaments: number;
    totalDemoCoinsInCirculation: number;
    pendingWithdrawals: number;
    pendingKYC: number;
    openFraudAlerts: number;
    revenue24h: number;
    revenue7d: number;
    revenue30d: number;
}>;
export type AdminDashboardStats = z.infer<typeof AdminDashboardStatsSchema>;
export declare const AdminSchemas: {
    AdminUser: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        role: z.ZodEnum<["super_admin", "admin", "moderator", "support"]>;
        permissions: z.ZodArray<z.ZodString, "many">;
        isActive: z.ZodDefault<z.ZodBoolean>;
        lastLoginAt: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        isActive: boolean;
        createdAt: string;
        username: string;
        fullName: string;
        email: string;
        lastLoginAt: string | null;
        role: "support" | "super_admin" | "admin" | "moderator";
        permissions: string[];
    }, {
        id: string;
        createdAt: string;
        username: string;
        fullName: string;
        email: string;
        lastLoginAt: string | null;
        role: "support" | "super_admin" | "admin" | "moderator";
        permissions: string[];
        isActive?: boolean | undefined;
    }>;
    CreateAdmin: z.ZodObject<{
        email: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        password: z.ZodString;
        role: z.ZodEnum<["admin", "moderator", "support"]>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        fullName: string;
        email: string;
        password: string;
        role: "support" | "admin" | "moderator";
        permissions?: string[] | undefined;
    }, {
        username: string;
        fullName: string;
        email: string;
        password: string;
        role: "support" | "admin" | "moderator";
        permissions?: string[] | undefined;
    }>;
    AuditLog: z.ZodObject<{
        id: z.ZodString;
        adminId: z.ZodNullable<z.ZodString>;
        userId: z.ZodNullable<z.ZodString>;
        action: z.ZodString;
        resourceType: z.ZodString;
        resourceId: z.ZodNullable<z.ZodString>;
        oldData: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        newData: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        ipAddress: z.ZodNullable<z.ZodString>;
        userAgent: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        userId: string | null;
        createdAt: string;
        ipAddress: string | null;
        userAgent: string | null;
        action: string;
        adminId: string | null;
        resourceType: string;
        resourceId: string | null;
        oldData: Record<string, unknown> | null;
        newData: Record<string, unknown> | null;
    }, {
        id: string;
        userId: string | null;
        createdAt: string;
        ipAddress: string | null;
        userAgent: string | null;
        action: string;
        adminId: string | null;
        resourceType: string;
        resourceId: string | null;
        oldData: Record<string, unknown> | null;
        newData: Record<string, unknown> | null;
    }>;
    FraudAlert: z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        type: z.ZodEnum<["multiple_accounts", "suspicious_gameplay", "wallet_manipulation", "bot_usage", "collusion", "other"]>;
        severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
        description: z.ZodString;
        evidence: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        status: z.ZodEnum<["open", "investigating", "resolved", "dismissed"]>;
        assignedTo: z.ZodNullable<z.ZodString>;
        resolvedAt: z.ZodNullable<z.ZodString>;
        resolvedBy: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "multiple_accounts" | "suspicious_gameplay" | "wallet_manipulation" | "bot_usage" | "collusion" | "other";
        status: "open" | "investigating" | "resolved" | "dismissed";
        id: string;
        userId: string;
        createdAt: string;
        description: string;
        severity: "medium" | "low" | "high" | "critical";
        evidence: Record<string, unknown>;
        assignedTo: string | null;
        resolvedAt: string | null;
        resolvedBy: string | null;
    }, {
        type: "multiple_accounts" | "suspicious_gameplay" | "wallet_manipulation" | "bot_usage" | "collusion" | "other";
        status: "open" | "investigating" | "resolved" | "dismissed";
        id: string;
        userId: string;
        createdAt: string;
        description: string;
        severity: "medium" | "low" | "high" | "critical";
        evidence: Record<string, unknown>;
        assignedTo: string | null;
        resolvedAt: string | null;
        resolvedBy: string | null;
    }>;
    GameSettings: z.ZodObject<{
        id: z.ZodString;
        key: z.ZodString;
        value: z.ZodUnknown;
        description: z.ZodString;
        category: z.ZodEnum<["gameplay", "economics", "matchmaking", "tournament", "security", "ui"]>;
        isPublic: z.ZodDefault<z.ZodBoolean>;
        updatedAt: z.ZodString;
        updatedBy: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        isPublic: boolean;
        description: string;
        category: "tournament" | "gameplay" | "economics" | "matchmaking" | "security" | "ui";
        updatedAt: string;
        key: string;
        updatedBy: string;
        value?: unknown;
    }, {
        id: string;
        description: string;
        category: "tournament" | "gameplay" | "economics" | "matchmaking" | "security" | "ui";
        updatedAt: string;
        key: string;
        updatedBy: string;
        value?: unknown;
        isPublic?: boolean | undefined;
    }>;
    UpdateGameSettings: z.ZodObject<{
        settings: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            value: z.ZodUnknown;
        }, "strip", z.ZodTypeAny, {
            key: string;
            value?: unknown;
        }, {
            key: string;
            value?: unknown;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        settings: {
            key: string;
            value?: unknown;
        }[];
    }, {
        settings: {
            key: string;
            value?: unknown;
        }[];
    }>;
    AdminDashboardStats: z.ZodObject<{
        totalUsers: z.ZodNumber;
        activeUsers24h: z.ZodNumber;
        activeUsers7d: z.ZodNumber;
        activeUsers30d: z.ZodNumber;
        totalMatches: z.ZodNumber;
        matches24h: z.ZodNumber;
        totalTournaments: z.ZodNumber;
        activeTournaments: z.ZodNumber;
        totalDemoCoinsInCirculation: z.ZodNumber;
        pendingWithdrawals: z.ZodNumber;
        pendingKYC: z.ZodNumber;
        openFraudAlerts: z.ZodNumber;
        revenue24h: z.ZodNumber;
        revenue7d: z.ZodNumber;
        revenue30d: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalMatches: number;
        totalUsers: number;
        activeUsers24h: number;
        activeUsers7d: number;
        activeUsers30d: number;
        matches24h: number;
        totalTournaments: number;
        activeTournaments: number;
        totalDemoCoinsInCirculation: number;
        pendingWithdrawals: number;
        pendingKYC: number;
        openFraudAlerts: number;
        revenue24h: number;
        revenue7d: number;
        revenue30d: number;
    }, {
        totalMatches: number;
        totalUsers: number;
        activeUsers24h: number;
        activeUsers7d: number;
        activeUsers30d: number;
        matches24h: number;
        totalTournaments: number;
        activeTournaments: number;
        totalDemoCoinsInCirculation: number;
        pendingWithdrawals: number;
        pendingKYC: number;
        openFraudAlerts: number;
        revenue24h: number;
        revenue7d: number;
        revenue30d: number;
    }>;
};
//# sourceMappingURL=types.d.ts.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSchemas = exports.AdminDashboardStatsSchema = exports.UpdateGameSettingsSchema = exports.GameSettingsSchema = exports.FraudAlertSchema = exports.AuditLogSchema = exports.CreateAdminSchema = exports.AdminUserSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../game/types");
// ============================================
// ADMIN TYPES
// ============================================
exports.AdminUserSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3).max(50),
    fullName: zod_1.z.string().max(100),
    role: zod_1.z.enum(['super_admin', 'admin', 'moderator', 'support']),
    permissions: zod_1.z.array(zod_1.z.string()),
    isActive: zod_1.z.boolean().default(true),
    lastLoginAt: types_1.TimestampSchema.nullable(),
    createdAt: types_1.TimestampSchema,
});
exports.CreateAdminSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3).max(50),
    fullName: zod_1.z.string().max(100),
    password: zod_1.z.string().min(8).max(128),
    role: zod_1.z.enum(['admin', 'moderator', 'support']),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.AuditLogSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    adminId: types_1.UUIDSchema.nullable(),
    userId: types_1.UUIDSchema.nullable(),
    action: zod_1.z.string().max(100),
    resourceType: zod_1.z.string().max(50),
    resourceId: zod_1.z.string().max(100).nullable(),
    oldData: zod_1.z.record(zod_1.z.unknown()).nullable(),
    newData: zod_1.z.record(zod_1.z.unknown()).nullable(),
    ipAddress: zod_1.z.string().ip().nullable(),
    userAgent: zod_1.z.string().nullable(),
    createdAt: types_1.TimestampSchema,
});
exports.FraudAlertSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    userId: types_1.UUIDSchema,
    type: zod_1.z.enum(['multiple_accounts', 'suspicious_gameplay', 'wallet_manipulation', 'bot_usage', 'collusion', 'other']),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    description: zod_1.z.string().max(1000),
    evidence: zod_1.z.record(zod_1.z.unknown()),
    status: zod_1.z.enum(['open', 'investigating', 'resolved', 'dismissed']),
    assignedTo: types_1.UUIDSchema.nullable(),
    resolvedAt: types_1.TimestampSchema.nullable(),
    resolvedBy: types_1.UUIDSchema.nullable(),
    createdAt: types_1.TimestampSchema,
});
exports.GameSettingsSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    key: zod_1.z.string().max(100),
    value: zod_1.z.unknown(),
    description: zod_1.z.string().max(500),
    category: zod_1.z.enum(['gameplay', 'economics', 'matchmaking', 'tournament', 'security', 'ui']),
    isPublic: zod_1.z.boolean().default(false),
    updatedAt: types_1.TimestampSchema,
    updatedBy: types_1.UUIDSchema,
});
exports.UpdateGameSettingsSchema = zod_1.z.object({
    settings: zod_1.z.array(zod_1.z.object({
        key: zod_1.z.string().max(100),
        value: zod_1.z.unknown(),
    })).min(1),
});
exports.AdminDashboardStatsSchema = zod_1.z.object({
    totalUsers: zod_1.z.number().int().nonnegative(),
    activeUsers24h: zod_1.z.number().int().nonnegative(),
    activeUsers7d: zod_1.z.number().int().nonnegative(),
    activeUsers30d: zod_1.z.number().int().nonnegative(),
    totalMatches: zod_1.z.number().int().nonnegative(),
    matches24h: zod_1.z.number().int().nonnegative(),
    totalTournaments: zod_1.z.number().int().nonnegative(),
    activeTournaments: zod_1.z.number().int().nonnegative(),
    totalDemoCoinsInCirculation: zod_1.z.number().int().nonnegative(),
    pendingWithdrawals: zod_1.z.number().int().nonnegative(),
    pendingKYC: zod_1.z.number().int().nonnegative(),
    openFraudAlerts: zod_1.z.number().int().nonnegative(),
    revenue24h: zod_1.z.number().int().nonnegative(),
    revenue7d: zod_1.z.number().int().nonnegative(),
    revenue30d: zod_1.z.number().int().nonnegative(),
});
// ============================================
// EXPORTS
// ============================================
exports.AdminSchemas = {
    AdminUser: exports.AdminUserSchema,
    CreateAdmin: exports.CreateAdminSchema,
    AuditLog: exports.AuditLogSchema,
    FraudAlert: exports.FraudAlertSchema,
    GameSettings: exports.GameSettingsSchema,
    UpdateGameSettings: exports.UpdateGameSettingsSchema,
    AdminDashboardStats: exports.AdminDashboardStatsSchema,
};

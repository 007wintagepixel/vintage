import { z } from 'zod';
import { UUIDSchema, TimestampSchema, PaginationSchema } from '../game/types';

// ============================================
// ADMIN TYPES
// ============================================

export const AdminUserSchema = z.object({
  id: UUIDSchema,
  email: z.string().email(),
  username: z.string().min(3).max(50),
  fullName: z.string().max(100),
  role: z.enum(['super_admin', 'admin', 'moderator', 'support']),
  permissions: z.array(z.string()),
  isActive: z.boolean().default(true),
  lastLoginAt: TimestampSchema.nullable(),
  createdAt: TimestampSchema,
});
export type AdminUser = z.infer<typeof AdminUserSchema>;

export const CreateAdminSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  fullName: z.string().max(100),
  password: z.string().min(8).max(128),
  role: z.enum(['admin', 'moderator', 'support']),
  permissions: z.array(z.string()).optional(),
});
export type CreateAdmin = z.infer<typeof CreateAdminSchema>;

export const AuditLogSchema = z.object({
  id: UUIDSchema,
  adminId: UUIDSchema.nullable(),
  userId: UUIDSchema.nullable(),
  action: z.string().max(100),
  resourceType: z.string().max(50),
  resourceId: z.string().max(100).nullable(),
  oldData: z.record(z.unknown()).nullable(),
  newData: z.record(z.unknown()).nullable(),
  ipAddress: z.string().ip().nullable(),
  userAgent: z.string().nullable(),
  createdAt: TimestampSchema,
});
export type AuditLog = z.infer<typeof AuditLogSchema>;

export const FraudAlertSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  type: z.enum(['multiple_accounts', 'suspicious_gameplay', 'wallet_manipulation', 'bot_usage', 'collusion', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().max(1000),
  evidence: z.record(z.unknown()),
  status: z.enum(['open', 'investigating', 'resolved', 'dismissed']),
  assignedTo: UUIDSchema.nullable(),
  resolvedAt: TimestampSchema.nullable(),
  resolvedBy: UUIDSchema.nullable(),
  createdAt: TimestampSchema,
});
export type FraudAlert = z.infer<typeof FraudAlertSchema>;

export const GameSettingsSchema = z.object({
  id: UUIDSchema,
  key: z.string().max(100),
  value: z.unknown(),
  description: z.string().max(500),
  category: z.enum(['gameplay', 'economics', 'matchmaking', 'tournament', 'security', 'ui']),
  isPublic: z.boolean().default(false),
  updatedAt: TimestampSchema,
  updatedBy: UUIDSchema,
});
export type GameSettings = z.infer<typeof GameSettingsSchema>;

export const UpdateGameSettingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string().max(100),
    value: z.unknown(),
  })).min(1),
});
export type UpdateGameSettings = z.infer<typeof UpdateGameSettingsSchema>;

export const AdminDashboardStatsSchema = z.object({
  totalUsers: z.number().int().nonnegative(),
  activeUsers24h: z.number().int().nonnegative(),
  activeUsers7d: z.number().int().nonnegative(),
  activeUsers30d: z.number().int().nonnegative(),
  totalMatches: z.number().int().nonnegative(),
  matches24h: z.number().int().nonnegative(),
  totalTournaments: z.number().int().nonnegative(),
  activeTournaments: z.number().int().nonnegative(),
  totalDemoCoinsInCirculation: z.number().int().nonnegative(),
  pendingWithdrawals: z.number().int().nonnegative(),
  pendingKYC: z.number().int().nonnegative(),
  openFraudAlerts: z.number().int().nonnegative(),
  revenue24h: z.number().int().nonnegative(),
  revenue7d: z.number().int().nonnegative(),
  revenue30d: z.number().int().nonnegative(),
});
export type AdminDashboardStats = z.infer<typeof AdminDashboardStatsSchema>;

// ============================================
// EXPORTS
// ============================================

export const AdminSchemas = {
  AdminUser: AdminUserSchema,
  CreateAdmin: CreateAdminSchema,
  AuditLog: AuditLogSchema,
  FraudAlert: FraudAlertSchema,
  GameSettings: GameSettingsSchema,
  UpdateGameSettings: UpdateGameSettingsSchema,
  AdminDashboardStats: AdminDashboardStatsSchema,
};
import { z } from 'zod';
import { UUIDSchema, TimestampSchema, PaginationSchema } from '../game/types';

// ============================================
// AUTH TYPES
// ============================================

export const RegisterRequestSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  fullName: z.string().min(1).max(100),
  email: z.string().email(),
  country: z.string().length(2).toUpperCase(), // ISO 3166-1 alpha-2
  mobileNumber: z.string().regex(/^\+[1-9]\d{1,14}$/), // E.164 format
  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  confirmPassword: z.string(),
  referralCode: z.string().max(20).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  acceptTerms: z.literal(true),
  acceptPrivacy: z.literal(true),
  acceptResponsibleGaming: z.literal(true),
  confirmAge: z.literal(true),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  identifier: z.string().min(1), // email or username
  password: z.string().min(1),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const OTPRequestSchema = z.object({
  identifier: z.string().min(1), // email or phone
  type: z.enum(['register', 'login', 'reset_password', 'verify_phone', 'verify_email']),
});
export type OTPRequest = z.infer<typeof OTPRequestSchema>;

export const OTPVerifySchema = z.object({
  identifier: z.string().min(1),
  code: z.string().length(6).regex(/^\d{6}$/),
  type: z.enum(['register', 'login', 'reset_password', 'verify_phone', 'verify_email']),
});
export type OTPVerify = z.infer<typeof OTPVerifySchema>;

export const ForgotPasswordSchema = z.object({
  identifier: z.string().email(),
});
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1), // email or phone (identifier)
  code: z.string().length(6).regex(/^\d{6}$/), // 6-digit OTP code
  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int().positive(),
  tokenType: z.literal('Bearer'),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export const SessionSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  isCurrent: z.boolean().default(false),
  createdAt: TimestampSchema,
  lastActiveAt: TimestampSchema,
  expiresAt: TimestampSchema,
});
export type Session = z.infer<typeof SessionSchema>;

// ============================================
// OAUTH TYPES
// ============================================

export const OAuthProviderSchema = z.enum(['google', 'apple']);
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;

export const OAuthLoginSchema = z.object({
  provider: OAuthProviderSchema,
  idToken: z.string(), // ID token from provider
  accessToken: z.string().optional(),
  deviceId: z.string().optional(),
  deviceName: z.string().optional(),
});
export type OAuthLogin = z.infer<typeof OAuthLoginSchema>;

// ============================================
// EXPORTS
// ============================================

export const AuthSchemas = {
  RegisterRequest: RegisterRequestSchema,
  LoginRequest: LoginRequestSchema,
  OTPRequest: OTPRequestSchema,
  OTPVerify: OTPVerifySchema,
  ForgotPassword: ForgotPasswordSchema,
  ResetPassword: ResetPasswordSchema,
  RefreshToken: RefreshTokenSchema,
  AuthTokens: AuthTokensSchema,
  Session: SessionSchema,
  OAuthLogin: OAuthLoginSchema,
};
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchemas = exports.OAuthLoginSchema = exports.OAuthProviderSchema = exports.SessionSchema = exports.AuthTokensSchema = exports.RefreshTokenSchema = exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.OTPVerifySchema = exports.OTPRequestSchema = exports.LoginRequestSchema = exports.RegisterRequestSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../game/types");
// ============================================
// AUTH TYPES
// ============================================
exports.RegisterRequestSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    fullName: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email(),
    country: zod_1.z.string().length(2).toUpperCase(), // ISO 3166-1 alpha-2
    mobileNumber: zod_1.z.string().regex(/^\+[1-9]\d{1,14}$/), // E.164 format
    password: zod_1.z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    confirmPassword: zod_1.z.string(),
    referralCode: zod_1.z.string().max(20).optional(),
    dateOfBirth: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    acceptTerms: zod_1.z.literal(true),
    acceptPrivacy: zod_1.z.literal(true),
    acceptResponsibleGaming: zod_1.z.literal(true),
    confirmAge: zod_1.z.literal(true),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
exports.LoginRequestSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1), // email or username
    password: zod_1.z.string().min(1),
    deviceId: zod_1.z.string().optional(),
    deviceName: zod_1.z.string().optional(),
});
exports.OTPRequestSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1), // email or phone
    type: zod_1.z.enum(['register', 'login', 'reset_password', 'verify_phone', 'verify_email']),
});
exports.OTPVerifySchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1),
    code: zod_1.z.string().length(6).regex(/^\d{6}$/),
    type: zod_1.z.enum(['register', 'login', 'reset_password', 'verify_phone', 'verify_email']),
});
exports.ForgotPasswordSchema = zod_1.z.object({
    identifier: zod_1.z.string().email(),
});
exports.ResetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1), // email or phone (identifier)
    code: zod_1.z.string().length(6).regex(/^\d{6}$/), // 6-digit OTP code
    password: zod_1.z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    confirmPassword: zod_1.z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.AuthTokensSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    expiresIn: zod_1.z.number().int().positive(),
    tokenType: zod_1.z.literal('Bearer'),
});
exports.SessionSchema = zod_1.z.object({
    id: types_1.UUIDSchema,
    userId: types_1.UUIDSchema,
    deviceId: zod_1.z.string().optional(),
    deviceName: zod_1.z.string().optional(),
    ipAddress: zod_1.z.string().ip().optional(),
    userAgent: zod_1.z.string().optional(),
    isCurrent: zod_1.z.boolean().default(false),
    createdAt: types_1.TimestampSchema,
    lastActiveAt: types_1.TimestampSchema,
    expiresAt: types_1.TimestampSchema,
});
// ============================================
// OAUTH TYPES
// ============================================
exports.OAuthProviderSchema = zod_1.z.enum(['google', 'apple']);
exports.OAuthLoginSchema = zod_1.z.object({
    provider: exports.OAuthProviderSchema,
    idToken: zod_1.z.string(), // ID token from provider
    accessToken: zod_1.z.string().optional(),
    deviceId: zod_1.z.string().optional(),
    deviceName: zod_1.z.string().optional(),
});
// ============================================
// EXPORTS
// ============================================
exports.AuthSchemas = {
    RegisterRequest: exports.RegisterRequestSchema,
    LoginRequest: exports.LoginRequestSchema,
    OTPRequest: exports.OTPRequestSchema,
    OTPVerify: exports.OTPVerifySchema,
    ForgotPassword: exports.ForgotPasswordSchema,
    ResetPassword: exports.ResetPasswordSchema,
    RefreshToken: exports.RefreshTokenSchema,
    AuthTokens: exports.AuthTokensSchema,
    Session: exports.SessionSchema,
    OAuthLogin: exports.OAuthLoginSchema,
};

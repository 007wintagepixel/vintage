import { z } from 'zod';
export declare const RegisterRequestSchema: z.ZodEffects<z.ZodObject<{
    username: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    country: z.ZodString;
    mobileNumber: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    referralCode: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodString;
    acceptTerms: z.ZodLiteral<true>;
    acceptPrivacy: z.ZodLiteral<true>;
    acceptResponsibleGaming: z.ZodLiteral<true>;
    confirmAge: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    username: string;
    fullName: string;
    email: string;
    country: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    acceptTerms: true;
    acceptPrivacy: true;
    acceptResponsibleGaming: true;
    confirmAge: true;
    referralCode?: string | undefined;
}, {
    username: string;
    fullName: string;
    email: string;
    country: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    acceptTerms: true;
    acceptPrivacy: true;
    acceptResponsibleGaming: true;
    confirmAge: true;
    referralCode?: string | undefined;
}>, {
    username: string;
    fullName: string;
    email: string;
    country: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    acceptTerms: true;
    acceptPrivacy: true;
    acceptResponsibleGaming: true;
    confirmAge: true;
    referralCode?: string | undefined;
}, {
    username: string;
    fullName: string;
    email: string;
    country: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    acceptTerms: true;
    acceptPrivacy: true;
    acceptResponsibleGaming: true;
    confirmAge: true;
    referralCode?: string | undefined;
}>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    identifier: z.ZodString;
    password: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
    deviceName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    identifier: string;
    deviceId?: string | undefined;
    deviceName?: string | undefined;
}, {
    password: string;
    identifier: string;
    deviceId?: string | undefined;
    deviceName?: string | undefined;
}>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export declare const OTPRequestSchema: z.ZodObject<{
    identifier: z.ZodString;
    type: z.ZodEnum<["register", "login", "reset_password", "verify_phone", "verify_email"]>;
}, "strip", z.ZodTypeAny, {
    type: "register" | "login" | "reset_password" | "verify_phone" | "verify_email";
    identifier: string;
}, {
    type: "register" | "login" | "reset_password" | "verify_phone" | "verify_email";
    identifier: string;
}>;
export type OTPRequest = z.infer<typeof OTPRequestSchema>;
export declare const OTPVerifySchema: z.ZodObject<{
    identifier: z.ZodString;
    code: z.ZodString;
    type: z.ZodEnum<["register", "login", "reset_password", "verify_phone", "verify_email"]>;
}, "strip", z.ZodTypeAny, {
    code: string;
    type: "register" | "login" | "reset_password" | "verify_phone" | "verify_email";
    identifier: string;
}, {
    code: string;
    type: "register" | "login" | "reset_password" | "verify_phone" | "verify_email";
    identifier: string;
}>;
export type OTPVerify = z.infer<typeof OTPVerifySchema>;
export declare const ForgotPasswordSchema: z.ZodObject<{
    identifier: z.ZodString;
}, "strip", z.ZodTypeAny, {
    identifier: string;
}, {
    identifier: string;
}>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export declare const ResetPasswordSchema: z.ZodEffects<z.ZodObject<{
    token: z.ZodString;
    code: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    password: string;
    confirmPassword: string;
    token: string;
}, {
    code: string;
    password: string;
    confirmPassword: string;
    token: string;
}>, {
    code: string;
    password: string;
    confirmPassword: string;
    token: string;
}, {
    code: string;
    password: string;
    confirmPassword: string;
    token: string;
}>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export declare const AuthTokensSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    expiresIn: z.ZodNumber;
    tokenType: z.ZodLiteral<"Bearer">;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
    tokenType: "Bearer";
}, {
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
    tokenType: "Bearer";
}>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export declare const SessionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
    deviceName: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    isCurrent: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
    lastActiveAt: z.ZodString;
    expiresAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
    lastActiveAt: string;
    deviceId?: string | undefined;
    deviceName?: string | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}, {
    id: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
    lastActiveAt: string;
    deviceId?: string | undefined;
    deviceName?: string | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    isCurrent?: boolean | undefined;
}>;
export type Session = z.infer<typeof SessionSchema>;
export declare const OAuthProviderSchema: z.ZodEnum<["google", "apple"]>;
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>;
export declare const OAuthLoginSchema: z.ZodObject<{
    provider: z.ZodEnum<["google", "apple"]>;
    idToken: z.ZodString;
    accessToken: z.ZodOptional<z.ZodString>;
    deviceId: z.ZodOptional<z.ZodString>;
    deviceName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    provider: "google" | "apple";
    idToken: string;
    deviceId?: string | undefined;
    deviceName?: string | undefined;
    accessToken?: string | undefined;
}, {
    provider: "google" | "apple";
    idToken: string;
    deviceId?: string | undefined;
    deviceName?: string | undefined;
    accessToken?: string | undefined;
}>;
export type OAuthLogin = z.infer<typeof OAuthLoginSchema>;
export declare const AuthSchemas: {
    RegisterRequest: z.ZodEffects<z.ZodObject<{
        username: z.ZodString;
        fullName: z.ZodString;
        email: z.ZodString;
        country: z.ZodString;
        mobileNumber: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
        referralCode: z.ZodOptional<z.ZodString>;
        dateOfBirth: z.ZodString;
        acceptTerms: z.ZodLiteral<true>;
        acceptPrivacy: z.ZodLiteral<true>;
        acceptResponsibleGaming: z.ZodLiteral<true>;
        confirmAge: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        fullName: string;
        email: string;
        country: string;
        mobileNumber: string;
        password: string;
        confirmPassword: string;
        dateOfBirth: string;
        acceptTerms: true;
        acceptPrivacy: true;
        acceptResponsibleGaming: true;
        confirmAge: true;
        referralCode?: string | undefined;
    }, {
        username: string;
        fullName: string;
        email: string;
        country: string;
        mobileNumber: string;
        password: string;
        confirmPassword: string;
        dateOfBirth: string;
        acceptTerms: true;
        acceptPrivacy: true;
        acceptResponsibleGaming: true;
        confirmAge: true;
        referralCode?: string | undefined;
    }>, {
        username: string;
        fullName: string;
        email: string;
        country: string;
        mobileNumber: string;
        password: string;
        confirmPassword: string;
        dateOfBirth: string;
        acceptTerms: true;
        acceptPrivacy: true;
        acceptResponsibleGaming: true;
        confirmAge: true;
        referralCode?: string | undefined;
    }, {
        username: string;
        fullName: string;
        email: string;
        country: string;
        mobileNumber: string;
        password: string;
        confirmPassword: string;
        dateOfBirth: string;
        acceptTerms: true;
        acceptPrivacy: true;
        acceptResponsibleGaming: true;
        confirmAge: true;
        referralCode?: string | undefined;
    }>;
    LoginRequest: z.ZodObject<{
        identifier: z.ZodString;
        password: z.ZodString;
        deviceId: z.ZodOptional<z.ZodString>;
        deviceName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        password: string;
        identifier: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
    }, {
        password: string;
        identifier: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
    }>;
    OTPRequest: z.ZodObject<{
        identifier: z.ZodString;
        type: z.ZodEnum<["register", "login", "reset_password", "verify_phone", "verify_email"]>;
    }, "strip", z.ZodTypeAny, {
        type: "register" | "login" | "reset_password" | "verify_phone" | "verify_email";
        identifier: string;
    }, {
        type: "register" | "login" | "reset_password" | "verify_phone" | "verify_email";
        identifier: string;
    }>;
    OTPVerify: z.ZodObject<{
        identifier: z.ZodString;
        code: z.ZodString;
        type: z.ZodEnum<["register", "login", "reset_password", "verify_phone", "verify_email"]>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        type: "register" | "login" | "reset_password" | "verify_phone" | "verify_email";
        identifier: string;
    }, {
        code: string;
        type: "register" | "login" | "reset_password" | "verify_phone" | "verify_email";
        identifier: string;
    }>;
    ForgotPassword: z.ZodObject<{
        identifier: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        identifier: string;
    }, {
        identifier: string;
    }>;
    ResetPassword: z.ZodEffects<z.ZodObject<{
        token: z.ZodString;
        code: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
        password: string;
        confirmPassword: string;
        token: string;
    }, {
        code: string;
        password: string;
        confirmPassword: string;
        token: string;
    }>, {
        code: string;
        password: string;
        confirmPassword: string;
        token: string;
    }, {
        code: string;
        password: string;
        confirmPassword: string;
        token: string;
    }>;
    RefreshToken: z.ZodObject<{
        refreshToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        refreshToken: string;
    }, {
        refreshToken: string;
    }>;
    AuthTokens: z.ZodObject<{
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        expiresIn: z.ZodNumber;
        tokenType: z.ZodLiteral<"Bearer">;
    }, "strip", z.ZodTypeAny, {
        refreshToken: string;
        accessToken: string;
        expiresIn: number;
        tokenType: "Bearer";
    }, {
        refreshToken: string;
        accessToken: string;
        expiresIn: number;
        tokenType: "Bearer";
    }>;
    Session: z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        deviceId: z.ZodOptional<z.ZodString>;
        deviceName: z.ZodOptional<z.ZodString>;
        ipAddress: z.ZodOptional<z.ZodString>;
        userAgent: z.ZodOptional<z.ZodString>;
        isCurrent: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        lastActiveAt: z.ZodString;
        expiresAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        userId: string;
        createdAt: string;
        expiresAt: string;
        isCurrent: boolean;
        lastActiveAt: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
    }, {
        id: string;
        userId: string;
        createdAt: string;
        expiresAt: string;
        lastActiveAt: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
        ipAddress?: string | undefined;
        userAgent?: string | undefined;
        isCurrent?: boolean | undefined;
    }>;
    OAuthLogin: z.ZodObject<{
        provider: z.ZodEnum<["google", "apple"]>;
        idToken: z.ZodString;
        accessToken: z.ZodOptional<z.ZodString>;
        deviceId: z.ZodOptional<z.ZodString>;
        deviceName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        provider: "google" | "apple";
        idToken: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
        accessToken?: string | undefined;
    }, {
        provider: "google" | "apple";
        idToken: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
        accessToken?: string | undefined;
    }>;
};
//# sourceMappingURL=types.d.ts.map
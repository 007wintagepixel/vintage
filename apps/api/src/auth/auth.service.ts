// ============================================
// Auth Service
// ============================================

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';
import { SessionService } from './session.service';
import { PasswordService } from './password.service';
import { RateLimitService } from './rate-limit.service';

import type { RegisterRequest, LoginRequest, OTPVerify, ForgotPassword, ResetPassword, RefreshToken } from '@ludo-nexus/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly sessionService: SessionService,
    private readonly passwordService: PasswordService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  // ============================================
  // REGISTRATION
  // ============================================

  async register(data: RegisterRequest, deviceId?: string, deviceName?: string) {
    // Check rate limiting
    await this.rateLimitService.checkRegistrationLimit(data.email, data.mobileNumber);

    // Check if username exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    // Check if email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if phone exists
    const existingPhone = await this.prisma.user.findFirst({
      where: { mobileNumber: data.mobileNumber },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }

    // Validate age (must be 18+)
    const dob = new Date(data.dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) {
      throw new ForbiddenException('You must be at least 18 years old to register');
    }

    // Hash password
    const passwordHash = await this.passwordService.hash(data.password);

    // Generate referral code
    const referralCode = await this.generateUniqueReferralCode();

    // Create user (unverified)
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        country: data.country,
        mobileNumber: data.mobileNumber,
        referralCode,
        referredById: data.referralCode ? (await this.getUserByReferralCode(data.referralCode))?.id : null,
      },
    });

    // Create wallet
    await this.prisma.wallet.create({
      data: { userId: user.id },
    });

    // Create profile
    await this.prisma.profile.create({
      data: { userId: user.id },
    });

    // Send OTP for email verification
    await this.otpService.sendOTP(user.id, data.email, 'register');
    
    // Send OTP for phone verification
    await this.otpService.sendOTP(user.id, data.mobileNumber, 'verify_phone');

    // Create session
    const { accessToken, refreshToken } = await this.sessionService.createSession(
      user.id,
      deviceId,
      deviceName,
    );

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      requiresEmailVerification: true,
      requiresPhoneVerification: true,
    };
  }

  // ============================================
  // LOGIN
  // ============================================

  async login(data: LoginRequest, deviceId?: string, deviceName?: string) {
    // Check rate limiting
    await this.rateLimitService.checkLoginLimit(data.identifier);

    // Find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.identifier },
          { username: data.identifier },
        ],
      },
    });

    if (!user) {
      await this.rateLimitService.recordFailedLogin(data.identifier);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValid = await this.passwordService.verify(user.passwordHash, data.password);
    if (!isValid) {
      await this.rateLimitService.recordFailedLogin(data.identifier);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is banned/deleted
    if (user.deletedAt) {
      throw new ForbiddenException('Account has been deactivated');
    }

    // Reset failed login attempts
    await this.rateLimitService.resetFailedLogins(data.identifier);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session
    const { accessToken, refreshToken } = await this.sessionService.createSession(
      user.id,
      deviceId,
      deviceName,
    );

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      requiresEmailVerification: !user.isEmailVerified,
      requiresPhoneVerification: !user.isPhoneVerified,
    };
  }

  // ============================================
  // OTP VERIFICATION
  // ============================================

  async verifyOTP(data: OTPVerify) {
    const result = await this.otpService.verifyOTP(data.identifier, data.code, data.type);
    
    if (!result.valid) {
      throw new BadRequestException(result.error ?? 'Invalid or expired OTP');
    }

    // Update user verification status based on type
    if (data.type === 'register' || data.type === 'verify_email') {
      await this.prisma.user.update({
        where: { email: data.identifier },
        data: { isEmailVerified: true, isVerified: true },
      });
    } else if (data.type === 'verify_phone') {
      const user = await this.prisma.user.findFirst({ where: { mobileNumber: data.identifier } });
      if (!user) throw new NotFoundException('User not found');
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isPhoneVerified: true },
      });
    }

    return { success: true, message: 'Verification successful' };
  }

  async resendOTP(identifier: string, type: 'register' | 'login' | 'reset_password' | 'verify_phone' | 'verify_email') {
    await this.rateLimitService.checkResendOTPLimit(identifier);
    
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { mobileNumber: identifier }],
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.otpService.sendOTP(user.id, identifier, type);
    await this.rateLimitService.recordResendOTP(identifier);

    return { success: true, message: 'OTP sent' };
  }

  // ============================================
  // PASSWORD RESET
  // ============================================

  async forgotPassword(data: ForgotPassword) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.identifier },
    });

    if (!user) {
      // Don't reveal if email exists
      return { success: true, message: 'If the email exists, a reset link will be sent' };
    }

    await this.otpService.sendOTP(user.id, user.email, 'reset_password');
    
    return { success: true, message: 'If the email exists, a reset link will be sent' };
  }

  async resetPassword(data: ResetPassword) {
    const result = await this.otpService.verifyOTP(data.token, data.code, 'reset_password');
    
    if (!result.valid) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: result.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = await this.passwordService.hash(data.password);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Invalidate all sessions
    await this.sessionService.invalidateAllUserSessions(user.id);

    return { success: true, message: 'Password reset successful' };
  }

  // ============================================
  // TOKEN REFRESH
  // ============================================

  async refreshTokens(data: RefreshToken) {
    const session = await this.sessionService.validateRefreshToken(data.refreshToken);
    
    if (!session) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate refresh token
    const { accessToken, refreshToken } = await this.sessionService.rotateSession(session.id);

    return { accessToken, refreshToken };
  }

  // ============================================
  // LOGOUT
  // ============================================

  async logout(userId: string, sessionId?: string, allDevices = false) {
    if (allDevices) {
      await this.sessionService.invalidateAllUserSessions(userId);
    } else if (sessionId) {
      await this.sessionService.invalidateSession(sessionId);
    }

    return { success: true, message: 'Logged out successfully' };
  }

  // ============================================
  // OAUTH
  // ============================================

  async oauthLogin(provider: 'google' | 'apple', idToken: string, deviceId?: string, deviceName?: string) {
    // OAuth not yet configured. Set GOOGLE_CLIENT_ID / APPLE_CLIENT_ID in env.
    throw new Error('OAuth not yet configured. Set GOOGLE_CLIENT_ID / APPLE_CLIENT_ID in env.');
  }

  // ============================================
  // HELPERS
  // ============================================

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  private async generateUniqueReferralCode(): Promise<string> {
    let code: string;
    let exists = true;
    
    while (exists) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await this.prisma.user.findUnique({
        where: { referralCode: code },
      });
      exists = !!existing;
    }
    
    return code!;
  }

  private async getUserByReferralCode(code: string) {
    return this.prisma.user.findUnique({
      where: { referralCode: code },
    });
  }

  // Validate user credentials (for local strategy)
  async validateUser(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return null;
    }

    const isValid = await this.passwordService.verify(user.passwordHash, password);
    if (!isValid) {
      return null;
    }

    if (user.deletedAt) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      kycStatus: user.kycStatus,
    };
  }
}
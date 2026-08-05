// ============================================
// OTP Service
// ============================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../../prisma/prisma.service';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  // OTP expiry times (in minutes)
  private readonly OTP_EXPIRY = {
    register: 10,
    login: 5,
    reset_password: 15,
    verify_phone: 10,
    verify_email: 10,
  };

  async sendOTP(userId: string, identifier: string, type: string) {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + (this.OTP_EXPIRY[type as keyof typeof this.OTP_EXPIRY] ?? 10) * 60 * 1000);

    // Store OTP
    await this.prisma.otp.create({
      data: {
        userId,
        identifier,
        code,
        type,
        expiresAt,
      },
    });

    // TODO: Send via email/SMS provider
    // For development, log the OTP
    this.logger.log(`OTP for ${identifier} (${type}): ${code}`);

    // In production, integrate with:
    // - Email: SendGrid, Mailgun, AWS SES, Nodemailer
    // - SMS: Twilio, Vonage, Plivo

    return { sent: true, expiresAt };
  }

  async verifyOTP(identifier: string, code: string, type: string): Promise<{ valid: boolean; error?: string; email?: string }> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        identifier,
        code,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return { valid: false, error: 'Invalid or expired OTP' };
    }

    // Mark as used
    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    });

    return { valid: true, email: otp.identifier };
  }

  async cleanupExpiredOTPs() {
    const result = await this.prisma.otp.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { usedAt: { not: null } },
        ],
      },
    });
    this.logger.log(`Cleaned up ${result.count} expired/used OTPs`);
    return result.count;
  }
}
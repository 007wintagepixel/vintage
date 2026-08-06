// ============================================
// Rate Limit Service
// ============================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // Rate limit windows (in milliseconds)
  private readonly WINDOWS = {
    registration: 60 * 60 * 1000, // 1 hour
    login: 15 * 60 * 1000, // 15 minutes
    resendOTP: 60 * 1000, // 1 minute
    registrationIP: 60 * 60 * 1000, // 1 hour
  };

  // Max attempts per window
  private readonly LIMITS = {
    registration: 3,
    login: 5,
    resendOTP: 3,
    registrationIP: 10,
  };

  // In-memory store for development (use Redis in production)
  private readonly memoryStore = new Map<string, { count: number; resetAt: number }>();

  async checkRegistrationLimit(email: string, phone: string) {
    const emailKey = `reg:${email}`;
    const phoneKey = `reg:${phone}`;

    await this.checkLimit(emailKey, this.LIMITS.registration, this.WINDOWS.registration);
    await this.checkLimit(phoneKey, this.LIMITS.registration, this.WINDOWS.registration);
  }

  async checkLoginLimit(identifier: string) {
    const key = `login:${identifier}`;
    await this.checkLimit(key, this.LIMITS.login, this.WINDOWS.login);
  }

  async checkResendOTPLimit(identifier: string) {
    const key = `resend:${identifier}`;
    await this.checkLimit(key, this.LIMITS.resendOTP, this.WINDOWS.resendOTP);
  }

  async checkRegistrationIpLimit(ip: string) {
    const key = `regip:${ip}`;
    await this.checkLimit(key, this.LIMITS.registrationIP, this.WINDOWS.registrationIP);
  }

  async recordFailedLogin(identifier: string) {
    const key = `login:${identifier}`;
    await this.increment(key, this.WINDOWS.login);
  }

  async resetFailedLogins(identifier: string) {
    const key = `login:${identifier}`;
    this.memoryStore.delete(key);
  }

  async recordResendOTP(identifier: string) {
    const key = `resend:${identifier}`;
    await this.increment(key, this.WINDOWS.resendOTP);
  }

  private async checkLimit(key: string, limit: number, window: number) {
    const now = Date.now();
    const entry = this.memoryStore.get(key);

    if (!entry || entry.resetAt < now) {
      // New window
      this.memoryStore.set(key, { count: 1, resetAt: now + window });
      return;
    }

    if (entry.count >= limit) {
      const resetIn = Math.ceil((entry.resetAt - now) / 1000);
      throw new Error(`Rate limit exceeded. Try again in ${resetIn} seconds.`);
    }

    entry.count++;
  }

  private async increment(key: string, window: number) {
    const now = Date.now();
    const entry = this.memoryStore.get(key);

    if (!entry || entry.resetAt < now) {
      this.memoryStore.set(key, { count: 1, resetAt: now + window });
    } else {
      entry.count++;
    }
  }

  // Cleanup old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.memoryStore.entries()) {
      if (entry.resetAt < now) {
        this.memoryStore.delete(key);
      }
    }
  }
}
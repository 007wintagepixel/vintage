// ============================================
// Session Service
// ============================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(
    userId: string,
    deviceId?: string,
    deviceName?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
    const sessionId = uuidv4();
    const refreshToken = uuidv4();
    
    // Calculate expiry times
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '30d';
    
    const accessToken = this.jwtService.sign(
      { sub: userId, sid: sessionId },
      { expiresIn: accessExpiresIn },
    );

    const refreshTokenExpiresAt = new Date(Date.now() + this.parseExpiry(refreshExpiresIn));

    // Store session
    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId,
        deviceId,
        deviceName,
        ipAddress,
        userAgent,
        refreshToken: await this.hashToken(refreshToken),
        isCurrent: true,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    // Mark other sessions as not current
    await this.prisma.session.updateMany({
      where: { userId, id: { not: sessionId } },
      data: { isCurrent: false },
    });

    return { accessToken, refreshToken, sessionId };
  }

  async validateSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) return null;

    // Update last active
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    });

    return session;
  }

  async validateRefreshToken(refreshToken: string) {
    const hashedToken = await this.hashToken(refreshToken);
    
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: hashedToken },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) return null;

    return session;
  }

  async rotateSession(sessionId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    const newRefreshToken = uuidv4();
    const newRefreshTokenExpiresAt = new Date(
      Date.now() + this.parseExpiry(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '30d')
    );

    const accessToken = this.jwtService.sign(
      { sub: session.userId, sid: sessionId },
      { expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m' },
    );

    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        refreshToken: await this.hashToken(newRefreshToken),
        expiresAt: newRefreshTokenExpiresAt,
        lastActiveAt: new Date(),
      },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async invalidateSession(sessionId: string) {
    await this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  async invalidateAllUserSessions(userId: string) {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async getUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { lastActiveAt: 'desc' },
      select: {
        id: true,
        deviceId: true,
        deviceName: true,
        ipAddress: true,
        userAgent: true,
        isCurrent: true,
        createdAt: true,
        lastActiveAt: true,
        expiresAt: true,
      },
    });
  }

  private async hashToken(token: string): Promise<string> {
    // In production, use argon2 or bcrypt
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000; // 30 days default

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 30 * 24 * 60 * 60 * 1000;
    }
  }
}
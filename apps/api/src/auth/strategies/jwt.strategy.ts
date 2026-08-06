// ============================================
// JWT Strategy
// ============================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { PrismaService } from '../../prisma/prisma.service';
import { SessionService } from '../session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req?.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      issuer: 'ludo-nexus',
      audience: 'ludo-nexus-api',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    // Verify session exists and is valid
    const sessionId = payload.sid;
    if (sessionId) {
      const session = await this.sessionService.validateSession(sessionId);
      if (!session) {
        throw new UnauthorizedException('Session expired or invalid');
      }
    }

    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        kycStatus: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    // Attach session ID to request for later use
    (req as any).sessionId = sessionId;

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
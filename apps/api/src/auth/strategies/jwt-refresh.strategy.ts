// ============================================
// JWT Refresh Strategy
// ============================================

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import { SessionService } from "../session.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.body?.refreshToken,
        (req: Request) => req?.cookies?.refresh_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_REFRESH_SECRET"),
      issuer: "ludo-nexus",
      audience: "ludo-nexus-api",
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.body?.refreshToken ?? req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not provided");
    }

    const session =
      await this.sessionService.validateRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    return {
      id: payload.sub,
      sessionId: session.id,
      refreshToken,
    };
  }
}

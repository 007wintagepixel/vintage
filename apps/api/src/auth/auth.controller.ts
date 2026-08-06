// ============================================
// Auth Controller
// ============================================

import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Ip,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RateLimitService } from './rate-limit.service';

import type { RegisterRequest, LoginRequest, OTPVerify, ForgotPassword, ResetPassword, RefreshToken } from '@ludo-nexus/shared-types';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Username/email/phone already exists' })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() data: RegisterRequest,
    @Headers('x-device-id') deviceId: string,
    @Headers('x-device-name') deviceName: string,
    @Ip() ip: string,
  ) {
    await this.rateLimitService.checkRegistrationIpLimit(ip);
    return this.authService.register(data, deviceId, deviceName);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email/username and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: LoginRequest,
    @Headers('x-device-id') deviceId: string,
    @Headers('x-device-name') deviceName: string,
  ) {
    return this.authService.login(data, deviceId, deviceName);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for registration, login, or password reset' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() data: OTPVerify) {
    return this.authService.verifyOTP(data);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @HttpCode(HttpStatus.OK)
  async resendOTP(
    @Body() data: { identifier: string; type: 'register' | 'login' | 'reset_password' | 'verify_phone' | 'verify_email' },
  ) {
    return this.authService.resendOTP(data.identifier, data.type);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset email sent if account exists' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() data: ForgotPassword) {
    return this.authService.forgotPassword(data);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() data: ResetPassword) {
    return this.authService.resetPassword(data);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() data: RefreshToken) {
    return this.authService.refreshTokens(data);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from current or all devices' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request & { user: { id: string } },
    @Body() data: { allDevices?: boolean; sessionId?: string },
  ) {
    const userId = req.user.id;
    return this.authService.logout(userId, data.sessionId, data.allDevices ?? false);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active sessions' })
  @ApiResponse({ status: 200, description: 'List of active sessions' })
  async getSessions(@Req() req: Request) {
    // Session listing will be implemented with session service
    return { data: [] };
  }

  @Post('oauth/google')
  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body() data: { idToken: string; deviceId?: string; deviceName?: string },
    @Headers('x-device-id') deviceId: string,
    @Headers('x-device-name') deviceName: string,
  ) {
    return this.authService.oauthLogin('google', data.idToken, data.deviceId ?? deviceId, data.deviceName ?? deviceName);
  }

  @Post('oauth/apple')
  @ApiOperation({ summary: 'Login with Apple' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @HttpCode(HttpStatus.OK)
  async appleLogin(
    @Body() data: { idToken: string; deviceId?: string; deviceName?: string },
    @Headers('x-device-id') deviceId: string,
    @Headers('x-device-name') deviceName: string,
  ) {
    return this.authService.oauthLogin('apple', data.idToken, data.deviceId ?? deviceId, data.deviceName ?? deviceName);
  }
}
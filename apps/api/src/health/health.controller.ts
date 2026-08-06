// ============================================
// Health Controller
// ============================================

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => ({
        database: await this.checkDatabase(),
      } as HealthIndicatorResult),
      async (): Promise<HealthIndicatorResult> => ({
        memory: this.checkMemory(),
      } as HealthIndicatorResult),
    ]);
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @HealthCheck()
  async ready(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => ({
        database: await this.checkDatabase(),
      } as HealthIndicatorResult),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  @HealthCheck()
  async live(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => ({
        memory: this.checkMemory(),
      } as HealthIndicatorResult),
    ]);
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up' as const };
    } catch {
      return { status: 'down' as const };
    }
  }

  private checkMemory() {
    const used = process.memoryUsage().heapUsed;
    const limit = 1024 * 1024 * 1024; // 1GB
    return {
      status: used < limit ? ('up' as const) : ('down' as const),
      used: `${Math.round(used / 1024 / 1024)} MB`,
      limit: `${Math.round(limit / 1024 / 1024)} MB`,
    };
  }
}
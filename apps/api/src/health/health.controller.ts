// ============================================
// Health Controller
// ============================================

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
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
      async () => ({
        database: await this.checkDatabase(),
      }),
      async () => ({
        memory: this.checkMemory(),
      }),
    ]);
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @HealthCheck()
  async ready(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => ({
        database: await this.checkDatabase(),
      }),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  @HealthCheck()
  async live(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => ({
        memory: this.checkMemory(),
      }),
    ]);
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up' };
    } catch {
      return { status: 'down' };
    }
  }

  private checkMemory() {
    const used = process.memoryUsage().heapUsed;
    const limit = 1024 * 1024 * 1024; // 1GB
    return {
      status: used < limit ? 'up' : 'down',
      used: `${Math.round(used / 1024 / 1024)} MB`,
      limit: `${Math.round(limit / 1024 / 1024)} MB`,
    };
  }
}
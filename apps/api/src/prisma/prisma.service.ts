// ============================================
// Prisma Service
// ============================================

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
    
    // Log queries in development
    if (process.env.NODE_ENV !== 'production') {
      (this as any).$on('query', (e: any) => {
        this.logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
      });
    }
    
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  // Clean database for testing
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }
    
    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$'),
    ) as string[];
    
    for (const model of models) {
      if (typeof (this as any)[model] === 'object' && (this as any)[model] !== null && 'deleteMany' in (this as any)[model]) {
        await (this as any)[model].deleteMany();
      }
    }
  }
}
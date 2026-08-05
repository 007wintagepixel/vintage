// ============================================
// Logging Interceptor
// ============================================

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] ?? '';
    const requestId = (headers['x-request-id'] as string) ?? crypto.randomUUID();
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(
      `→ ${method} ${url} | IP: ${ip} | UA: ${userAgent.slice(0, 100)}`,
      { requestId, method, url, ip, userAgent },
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          
          this.logger.log(
            `← ${method} ${url} | ${statusCode} | ${duration}ms`,
            { requestId, method, url, statusCode, duration },
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status ?? 500;
          
          this.logger.error(
            `✗ ${method} ${url} | ${statusCode} | ${duration}ms | ${error.message}`,
            { requestId, method, url, statusCode, duration, error: error.message },
          );
        },
      }),
    );
  }
}
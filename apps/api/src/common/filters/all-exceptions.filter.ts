// ============================================
// All Exceptions Filter
// ============================================

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError as ClassValidationError } from 'class-validator';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers['x-request-id'] as string) ?? crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const path = request.url;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) ?? exception.message;
        errorCode = (resp.errorCode as string) ?? exception.name;
        details = resp.details as Record<string, unknown> | undefined;
      } else {
        message = exception.message;
        errorCode = exception.name;
      }
    } else if (exception instanceof ZodError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      errorCode = 'VALIDATION_ERROR';
      message = 'Validation failed';
      details = {
        errors: exception.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      };
    } else if (Array.isArray(exception) && exception[0] instanceof ClassValidationError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      errorCode = 'VALIDATION_ERROR';
      message = 'Validation failed';
      details = {
        errors: exception.flatMap(e => this.formatValidationErrors(e)),
      };
    } else if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.CONFLICT;
      errorCode = 'DATABASE_ERROR';
      message = this.handlePrismaError(exception);
    } else if (exception instanceof PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      errorCode = 'DATABASE_VALIDATION_ERROR';
      message = 'Invalid database operation';
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = exception.name;
      this.logger.error(`${exception.name}: ${exception.message}`, exception.stack);
    } else {
      this.logger.error('Unknown exception', exception);
    }

    // Log error
    this.logger.error(
      `${request.method} ${path} - ${status} - ${errorCode} - ${message}`,
      { requestId, path, method: request.method, status, errorCode, details },
    );

    // Send response
    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details,
      },
      meta: {
        requestId,
        timestamp,
        path,
      },
    });
  }

  private formatValidationErrors(error: ClassValidationError): Array<{ field: string; message: string }> {
    const errors: Array<{ field: string; message: string }> = [];
    
    if (error.constraints) {
      Object.entries(error.constraints).forEach(([_, message]) => {
        errors.push({ field: error.property, message });
      });
    }
    
    if (error.children && error.children.length > 0) {
      error.children.forEach(child => {
        errors.push(...this.formatValidationErrors(child));
      });
    }
    
    return errors;
  }

  private handlePrismaError(error: PrismaClientKnownRequestError): string {
    switch (error.code) {
      case 'P2002':
        const target = error.meta?.target as string[] | undefined;
        return `A record with this ${target?.join(', ') ?? 'field'} already exists`;
      case 'P2003':
        return 'Foreign key constraint failed - referenced record does not exist';
      case 'P2025':
        return 'Record not found';
      default:
        return 'Database operation failed';
    }
  }
}
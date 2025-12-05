import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<any>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: string[] = [];
    let stack: string | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      stack = exception.stack;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const res = exceptionResponse as { message: unknown };

        if (Array.isArray(res.message)) {
          message = 'Bad Request';
          errors = res.message.filter((m) => typeof m === 'string') as string[];
        } else if (typeof res.message === 'string') {
          message = res.message;
        } else {
          message = 'Request Failed';
        }
      }
    } else {
      this.logger.error(
        `[FATAL] ${request.method} ${request.url}: ${message}`,
        (exception as Error).stack,
        'ExceptionFilter',
      );
    }

    if (status >= 500) {
      this.logger.error(`[${status}] ${request.method} ${request.url}: ${message}`, stack);
    } else if (status >= 400) {
      this.logger.warn(`[${status}] ${request.method} ${request.url}: ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      ...(errors.length > 0 && { errors: errors }),
    });
  }
}

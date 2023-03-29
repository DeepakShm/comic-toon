import { LoggerMiddlewareOptions } from '../interfaces';

import { Prisma } from '@prisma/client';

export function loggerMiddleware(
  { logger, logLevel, logMessage }: LoggerMiddlewareOptions = {
    logger: console,
    logLevel: 'debug',
  }
): Prisma.Middleware {
  return async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    const duration = after - before;
    if (logMessage) {
      logger[logLevel](
        logMessage({
          model: params.model,
          action: params.action,
          before,
          after,
          duration,
        })
      );
    } else {
      logger[logLevel](`Prima:Log - model: ${params.model}  |  action: ${params.action}  |   duration: ${duration}ms`);
    }
    return result;
  };
}

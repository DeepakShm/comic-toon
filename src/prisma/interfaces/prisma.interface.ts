import { Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

export interface PrismaModuleOptions {
  isGlobal?: boolean;
  prismaServiceOptions?: PrismaServiceOptions;
}

export interface PrismaServiceOptions {
  prismaOptions?: Prisma.PrismaClientOptions;

  explicitConnect?: boolean;

  middlewares?: Array<Prisma.Middleware>;
}

export interface LoggerMiddlewareOptions {
  logger: Console | Logger;
  logLevel: 'log' | 'warn' | 'error' | 'debug';

  logMessage?: (query: QueryInfo) => string;
}

export interface QueryInfo {
  model: string;
  action: string;
  before: number;
  after: number;
  duration: number;
}

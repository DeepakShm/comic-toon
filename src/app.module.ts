import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loggerMiddleware } from './prisma/middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggerMiddleware()],
        prismaOptions: { log: ['error', 'query', 'info', 'warn'] },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

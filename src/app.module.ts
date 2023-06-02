import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loggerMiddleware } from './prisma/middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './app/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './app/user/user.module';
import { PublisherModule } from './app/publisher/publisher.module';
import { CloudinaryModule } from './app/cloudinary/cloudinary.module';
import { ComicModule } from './app/comic/comic.module';
import { ComicChapterModule } from './app/comic-chapter/comic-chapter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggerMiddleware()],
        prismaOptions: { log: ['error', 'query', 'info', 'warn'] },
      },
    }),
    AuthModule,
    UserModule,
    PublisherModule,
    CloudinaryModule,
    ComicModule,
    ComicChapterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

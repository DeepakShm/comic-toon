import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma/exceptionFIlter/prisma-client-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const message = errors.map((error) => {
          for (const property in error.constraints) {
            return {
              message: error.constraints[property],
              property: error.property,
              value: error.value,
            };
          }
        });
        return new BadRequestException(message);
      },
    })
  );
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();

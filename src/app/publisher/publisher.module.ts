import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { TestController } from './test.controller';
import { ValidationService } from './validation.service';

@Module({
  controllers: [PublisherController, TestController],
  providers: [PublisherService, ValidationService],
  exports: [PublisherService],
})
export class PublisherModule {}

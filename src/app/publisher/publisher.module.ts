import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TestController } from './test.controller';
import { ValidationService } from './validation.service';

@Module({
  controllers: [PublisherController, TestController],
  providers: [PublisherService, ValidationService],
  imports: [CloudinaryModule],
})
export class PublisherModule {}

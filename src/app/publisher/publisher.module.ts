import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TestController } from './test.controller';

@Module({
  controllers: [PublisherController, TestController],
  providers: [PublisherService],
  imports: [CloudinaryModule],
})
export class PublisherModule {}

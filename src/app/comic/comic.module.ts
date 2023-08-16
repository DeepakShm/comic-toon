import { Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';
import { PublisherService } from '../publisher/publisher.service';
import { ComicActionService } from './comic-action/comic-action.service';

@Module({
  controllers: [ComicController],
  providers: [ComicService, PublisherService, ComicActionService],
})
export class ComicModule {}

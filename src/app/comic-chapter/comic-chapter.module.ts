import { Module } from '@nestjs/common';
import { ComicChapterService } from './comic-chapter.service';
import { ComicChapterController } from './comic-chapter.controller';
import { ChapterActionService } from './chapter-action/chapter-action.service';

@Module({
  controllers: [ComicChapterController],
  providers: [ComicChapterService, ChapterActionService],
})
export class ComicChapterModule {}

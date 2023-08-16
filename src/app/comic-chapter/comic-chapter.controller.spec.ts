import { Test, TestingModule } from '@nestjs/testing';
import { ComicChapterController } from './comic-chapter.controller';
import { ComicChapterService } from './comic-chapter.service';

describe('ComicChapterController', () => {
  let controller: ComicChapterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComicChapterController],
      providers: [ComicChapterService],
    }).compile();

    controller = module.get<ComicChapterController>(ComicChapterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

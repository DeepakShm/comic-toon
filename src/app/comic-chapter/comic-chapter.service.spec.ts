import { Test, TestingModule } from '@nestjs/testing';
import { ComicChapterService } from './comic-chapter.service';

describe('ComicChapterService', () => {
  let service: ComicChapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComicChapterService],
    }).compile();

    service = module.get<ComicChapterService>(ComicChapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

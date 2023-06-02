import { Test, TestingModule } from '@nestjs/testing';
import { ChapterActionService } from './chapter-action.service';

describe('ChapterActionService', () => {
  let service: ChapterActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChapterActionService],
    }).compile();

    service = module.get<ChapterActionService>(ChapterActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

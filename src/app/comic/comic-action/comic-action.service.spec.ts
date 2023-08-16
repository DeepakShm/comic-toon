import { Test, TestingModule } from '@nestjs/testing';
import { ComicActionService } from './comic-action.service';

describe('ComicActionService', () => {
  let service: ComicActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComicActionService],
    }).compile();

    service = module.get<ComicActionService>(ComicActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

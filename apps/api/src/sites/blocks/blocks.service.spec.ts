import { Test, TestingModule } from '@nestjs/testing';
import { SiteBlocksService } from './blocks.service';
import { createMockRepositoryProvider } from '../../../test/test-utils';
import { SiteBlockEntity } from '../entities/site-block.entity';
import { ReorderService } from 'src/shared/services/reorder.service';

describe('BlocksService', () => {
  let service: SiteBlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteBlocksService,
        createMockRepositoryProvider(SiteBlockEntity),
        {
          provide: ReorderService,
          useValue: {
            reorderWithinScope: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SiteBlocksService>(SiteBlocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

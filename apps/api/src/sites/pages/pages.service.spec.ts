import { Test, TestingModule } from '@nestjs/testing';
import { SitePagesService } from './pages.service';
import { createMockRepositoryProvider } from '../../../test/test-utils';
import { SitePageEntity } from '../entities/site-page.entity';
import { ReorderService } from 'src/shared/services/reorder.service';
import { SiteBlocksService } from '../blocks/blocks.service';

describe('PagesService', () => {
  let service: SitePagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitePagesService,
        createMockRepositoryProvider(SitePageEntity),
        {
          provide: SiteBlocksService,
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: ReorderService,
          useValue: {
            reorderWithinScope: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SitePagesService>(SitePagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

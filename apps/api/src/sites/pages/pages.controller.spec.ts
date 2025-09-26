import { Test, TestingModule } from '@nestjs/testing';
import { SitePagesController } from './pages.controller';
import { SitePagesService } from './pages.service';
import { createMockRepositoryProvider } from '../../../test/test-utils';
import { SitePageEntity } from '../entities/site-page.entity';
import { ReorderService } from 'src/shared/services/reorder.service';
import { SiteBlocksService } from '../blocks/blocks.service';

describe('PagesController', () => {
  let controller: SitePagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitePagesController],
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

    controller = module.get<SitePagesController>(SitePagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

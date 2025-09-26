import { Test, TestingModule } from '@nestjs/testing';
import { SiteBlocksController } from './blocks.controller';
import { SiteBlocksService } from './blocks.service';
import { createMockRepositoryProvider } from '../../../test/test-utils';
import { SiteBlockEntity } from '../entities/site-block.entity';
import { ReorderService } from 'src/shared/services/reorder.service';

describe('BlocksController', () => {
  let controller: SiteBlocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteBlocksController],
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

    controller = module.get<SiteBlocksController>(SiteBlocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

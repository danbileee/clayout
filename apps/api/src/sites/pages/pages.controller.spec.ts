import { Test, TestingModule } from '@nestjs/testing';
import { SitePagesController } from './pages.controller';
import { SitePagesService } from './pages.service';
import { createMockRepositoryProvider } from '../../../test/test-utils';
import { SitePageEntity } from '../entities/site-page.entity';

describe('PagesController', () => {
  let controller: SitePagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitePagesController],
      providers: [
        SitePagesService,
        createMockRepositoryProvider(SitePageEntity),
      ],
    }).compile();

    controller = module.get<SitePagesController>(SitePagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

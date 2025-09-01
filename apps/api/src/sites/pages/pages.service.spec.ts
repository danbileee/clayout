import { Test, TestingModule } from '@nestjs/testing';
import { SitePagesService } from './pages.service';
import { createMockRepositoryProvider } from '../../../test/test-utils';
import { SitePageEntity } from '../entities/site-page.entity';

describe('PagesService', () => {
  let service: SitePagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitePagesService,
        createMockRepositoryProvider(SitePageEntity),
      ],
    }).compile();

    service = module.get<SitePagesService>(SitePagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

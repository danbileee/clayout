import { Test, TestingModule } from '@nestjs/testing';
import { SitesService } from './sites.service';
import { createMockRepositoryProvider } from '../../test/test-utils';
import { SiteEntity } from './entities/site.entity';
import { SitePageEntity } from './entities/site-page.entity';
import { SiteBlockEntity } from './entities/site-block.entity';
import { SiteReleaseEntity } from './entities/site-release.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationService } from '../shared/services/pagination.service';
import { UploaderService } from '../shared/services/uploader.service';
import { ConfigService } from '@nestjs/config';

describe('SitesService', () => {
  let service: SitesService;
  let sitesRepository: jest.Mocked<Repository<SiteEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        createMockRepositoryProvider(SiteEntity),
        createMockRepositoryProvider(SitePageEntity),
        createMockRepositoryProvider(SiteBlockEntity),
        createMockRepositoryProvider(SiteReleaseEntity),
        {
          provide: PaginationService,
          useValue: {
            paginate: jest.fn(),
          },
        },
        {
          provide: UploaderService,
          useValue: {
            getSignedUrl: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
    sitesRepository = module.get(getRepositoryToken(SiteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

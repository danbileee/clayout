import { Test, TestingModule } from '@nestjs/testing';
import { SitesService } from './sites.service';
import { createMockRepositoryProvider } from '../../test/test-utils';
import { SiteEntity } from './entities/site.entity';
import { SitePageEntity } from './entities/site-page.entity';
import { SiteBlockEntity } from './entities/site-block.entity';
import { SiteReleaseEntity } from './entities/site-release.entity';
import { SiteDomainEntity } from './entities/site-domain.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationService } from '../shared/services/pagination.service';
import { UploaderService } from '../shared/services/uploader.service';
import { ConfigService } from '@nestjs/config';
import { AssetsService } from '../assets/assets.service';
import { SitePagesService } from './pages/pages.service';
import { SiteBlocksService } from './blocks/blocks.service';

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
        createMockRepositoryProvider(SiteDomainEntity),
        {
          provide: SitePagesService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            reorder: jest.fn(),
            getById: jest.fn(),
          },
        },
        {
          provide: SiteBlocksService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            duplicate: jest.fn(),
            reorder: jest.fn(),
            getById: jest.fn(),
          },
        },
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
        {
          provide: AssetsService,
          useValue: {
            getById: jest.fn(),
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

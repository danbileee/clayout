import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { createMockRepositoryProvider } from '../test/test-utils';
import { UserEntity } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, createMockRepositoryProvider(UserEntity)],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CounterEntity } from '../src/counters/entities/counter.entity';
import { faker } from '@faker-js/faker';

// Common mock repository factory
export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  increment: jest.fn(),
  count: jest.fn(),
  findAndCount: jest.fn(),
  exists: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
  })),
});

// Type-safe mock repository provider factory
export const createMockRepositoryProvider = <T>(entity: new () => T) => ({
  provide: getRepositoryToken(entity),
  useValue: createMockRepository(),
});

// Common test module builder
export const createTestingModule = async (options: {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
}) => {
  return Test.createTestingModule({
    controllers: options.controllers || [],
    providers: options.providers || [],
    imports: options.imports || [],
  });
};

// Helper to get typed mock repository
export const getMockRepository = <T>(
  module: TestingModule,
  entity: new () => T,
): ReturnType<typeof createMockRepository> => {
  return module.get<ReturnType<typeof createMockRepository>>(
    getRepositoryToken(entity),
  );
};

// Common test data factories
export const createMockCounter = (
  overrides: Partial<CounterEntity> = {},
): Partial<CounterEntity> => ({
  id: overrides.id ?? faker.number.int({ min: 1, max: 10000 }),
  value: overrides.value ?? faker.word.words(2),
  count: overrides.count ?? faker.number.int({ min: 0, max: 100 }),
  createdAt: overrides.createdAt ?? faker.date.past(),
  updatedAt: overrides.updatedAt ?? faker.date.recent(),
  ...overrides,
});

export const createMockCounters = (
  count: number = 1,
): Partial<CounterEntity>[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockCounter({ id: index + 1, value: `counter-${index + 1}` }),
  );
};

export { faker };

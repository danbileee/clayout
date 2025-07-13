// Example Integration Test (for future reference)
// This shows how to test with a real database connection

describe('Integration Example', () => {
  it('should be a placeholder for future integration tests', () => {
    expect(true).toBe(true);
  });
});

/*
// Example of how to test with a real database connection:

describe('CountersService Integration', () => {
  let service: CountersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [CounterEntity],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([CounterEntity]),
      ],
      providers: [CountersService],
    }).compile();

    service = module.get<CountersService>(CountersService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    const repository = module.get(getRepositoryToken(CounterEntity));
    await repository.clear();
  });

  describe('createCounters', () => {
    it('should create and retrieve a counter', async () => {
      const dto = { value: 'test-counter', count: 0 };
      
      const created = await service.createCounters(dto);
      expect(created.value).toBe(dto.value);
      expect(created.count).toBe(dto.count);
      expect(created.id).toBeDefined();
      
      const retrieved = await service.getCounters('any-param');
      expect(retrieved).toContain(JSON.stringify(created));
    });
  });
});
*/

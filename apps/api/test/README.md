# Testing Strategy Guide

This guide explains the testing approach for the NestJS API application.

## Testing Types

### 1. Unit Tests (Current Implementation)

- **Purpose**: Test individual components in isolation
- **Database**: Mocked repositories
- **Speed**: Fast execution
- **Coverage**: Individual method behavior

**When to use**: Testing business logic, edge cases, error handling

### 2. Integration Tests (Recommended Addition)

- **Purpose**: Test component interactions with real database
- **Database**: Test database (SQLite in memory or test PostgreSQL)
- **Speed**: Medium execution
- **Coverage**: Component integration

**When to use**: Testing repository methods, complex business flows

### 3. E2E Tests (Existing)

- **Purpose**: Test complete application flow
- **Database**: Real database
- **Speed**: Slow execution
- **Coverage**: Full application behavior

**When to use**: Testing API endpoints, authentication flows

## Centralized Testing Utilities

### Repository Mocking

```typescript
// Before (manual setup)
const mockRepositoryProvider = {
  provide: getRepositoryToken(CounterEntity),
  useValue: {
    find: jest.fn(),
    save: jest.fn(),
    // ... more methods
  },
};

// After (centralized)
import { createMockRepositoryProvider } from '../test/test-utils';

const module = await Test.createTestingModule({
  providers: [
    CountersService,
    createMockRepositoryProvider(CounterEntity), // ✅ Clean and reusable
  ],
}).compile();
```

### Test Data Factories

```typescript
// Before (manual data creation)
const mockCounter = {
  id: 1,
  value: 'test',
  count: 0,
  created_at: new Date(),
  updated_at: new Date(),
};

// After (centralized factories)
import { createMockCounter, createMockCounters } from '../test/test-utils';

const mockCounter = createMockCounter({ value: 'custom-value' }); // ✅ Consistent data
const mockCounters = createMockCounters(5); // ✅ Generate multiple records
```

### Service Mocking

```typescript
// Before (manual service mock)
const mockService = {
  method1: jest.fn(),
  method2: jest.fn(),
};

// After (centralized)
import { createMockService } from '../test/jest-setup';

const mockService = createMockService<MyService>({
  method1: jest.fn(),
  method2: jest.fn(),
});
```

## Best Practices

### 1. Test Structure

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let mockRepository: MockRepository;

  beforeEach(async () => {
    // Setup with centralized utilities
  });

  describe('methodName', () => {
    it('should do something when condition', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 2. Mock Naming

- Use descriptive mock names
- Group related mocks together
- Use factory functions for complex mocks

### 3. Test Data

- Use factories for consistent test data
- Override only necessary fields
- Keep test data realistic

### 4. Assertions

- Test one thing per test
- Use descriptive test names
- Verify both return values and side effects

## Integration Testing Setup (Future Enhancement)

For integration tests, you can create a separate configuration:

```typescript
// test/integration/jest-integration.json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.integration\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  "setupFilesAfterEnv": ["<rootDir>/test/jest-integration-setup.ts"]
}
```

## Running Tests

```bash
# Unit tests (current)
pnpm test

# Integration tests (future)
pnpm test:integration

# E2E tests (existing)
pnpm test:e2e

# All tests with coverage
pnpm test:cov
```

## Benefits of This Approach

1. **Consistency**: All tests follow the same patterns
2. **Maintainability**: Changes to mocks happen in one place
3. **Reusability**: Common utilities can be shared across tests
4. **Type Safety**: TypeScript ensures mock compatibility
5. **Performance**: Fast unit tests for quick feedback
6. **Scalability**: Easy to add new test utilities as needed

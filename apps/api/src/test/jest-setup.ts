// Global test setup
import 'reflect-metadata';

// Global test utilities
global.beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

// Helper to create a mock service
export const createMockService = <T>(methods: Partial<T> = {}): Partial<T> => {
  return {
    ...methods,
  };
};

// Helper to create a mock controller
export const createMockController = <T>(
  methods: Partial<T> = {},
): Partial<T> => {
  return {
    ...methods,
  };
};

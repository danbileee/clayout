import { QueryFailedError } from 'typeorm';

export const PostgresErrorCode = {
  UniqueViolation: '23505',
} as const;

export function isPostgresError(error: unknown): error is QueryFailedError & {
  driverError: { code?: string; constraint?: string };
} {
  return error instanceof QueryFailedError;
}

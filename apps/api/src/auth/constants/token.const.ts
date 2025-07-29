export const TokenTypes = {
  refresh: 'refresh',
  access: 'access',
  basic: 'basic',
} as const;

export type TokenType = keyof typeof TokenTypes;

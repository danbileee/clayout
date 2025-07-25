export const TokenTypes = {
  refresh: 'refresh',
  access: 'access',
  email_confirm: 'email_confirm',
} as const;

export type TokenType = keyof typeof TokenTypes;

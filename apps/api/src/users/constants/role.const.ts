export const USER_ROLES_KEY = 'user_roles';

export const UserRoles = {
  User: 'User',
  Admin: 'Admin',
} as const;

export type UserRole = keyof typeof UserRoles;

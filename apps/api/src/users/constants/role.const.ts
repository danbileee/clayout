export const USER_ROLES_KEY = 'user_roles';

export const UserRoles = {
  None: 'None',
  Guest: 'Guest',
  Registrant: 'Registrant',
  User: 'User',
  Admin: 'Admin',
} as const;

export type UserRole = keyof typeof UserRoles;

export const UserRoleWeights: Record<UserRole, number> = {
  None: 0,
  Guest: 1,
  Registrant: 2,
  User: 3,
  Admin: 9999,
} as const;

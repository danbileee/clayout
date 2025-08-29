export const UserRoles = {
  None: "None",
  Guest: "Guest",
  Registrant: "Registrant",
  User: "User",
  Admin: "Admin",
} as const;

export type UserRole = keyof typeof UserRoles;

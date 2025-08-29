import { UserRole } from '@clayout/interface';

export interface RolesDecoratorOptions {
  requiredRole?: UserRole;
  minWeight?: number;
}

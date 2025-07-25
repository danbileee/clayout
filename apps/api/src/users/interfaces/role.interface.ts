import { UserRole } from '../constants/role.const';

export interface RolesDecoratorOptions {
  requiredRole?: UserRole;
  minWeight?: number;
}

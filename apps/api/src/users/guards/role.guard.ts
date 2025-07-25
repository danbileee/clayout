import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  USER_ROLES_KEY,
  UserRole,
  UserRoles,
  UserRoleWeights,
} from '../constants/role.const';
import { RolesDecoratorOptions } from '../interfaces/role.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleOptions = this.reflector.getAllAndOverride(USER_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roleOptions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const { requiredRole, minWeight } = roleOptions as RolesDecoratorOptions;

    if (requiredRole && user?.role !== requiredRole) {
      throw new ForbiddenException(
        `NO PERMISSION: You don't have access to this feature. Ask an admin to grant you the required role: ${requiredRole}`,
      );
    }

    const userRoleWeight = user
      ? UserRoleWeights[user.role as UserRole]
      : UserRoleWeights.None;

    if (minWeight && userRoleWeight < minWeight) {
      const minRequiredRole = Object.entries(UserRoleWeights)
        .filter(([, value]) => value === minWeight)
        .reduce((acc, [key]) => key as UserRole, UserRoles.Admin);

      throw new ForbiddenException(
        `NO PERMISSION: You don't have access to this feature. Ask an admin to grant you the minimum required role: ${minRequiredRole}`,
      );
    }

    return true;
  }
}

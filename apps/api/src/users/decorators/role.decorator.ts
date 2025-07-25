import { SetMetadata } from '@nestjs/common';
import { USER_ROLES_KEY } from '../constants/role.const';
import { RolesDecoratorOptions } from '../interfaces/role.interface';

export const Roles = (options: RolesDecoratorOptions) =>
  SetMetadata(USER_ROLES_KEY, options);

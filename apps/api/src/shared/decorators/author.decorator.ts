import { UserRole } from '@clayout/interface';
import { SetMetadata, Type } from '@nestjs/common';

export const AUTHOR_SERVICE_KEY = 'author_service';
export const BYPASS_ROLE_KEY = 'bypass_role';

export const Author =
  ({
    service,
    bypassRoles,
  }: {
    service: Type<any>;
    bypassRoles?: UserRole[];
  }) =>
  (target: any, key?: any, descriptor?: any) => {
    SetMetadata(AUTHOR_SERVICE_KEY, service)(target, key, descriptor);

    if (bypassRoles) {
      SetMetadata(BYPASS_ROLE_KEY, bypassRoles)(target, key, descriptor);
    }
  };

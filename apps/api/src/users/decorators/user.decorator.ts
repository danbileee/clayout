import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

export const User = createParamDecorator(
  (property: keyof UserEntity | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UserEntity;

    if (!user) {
      throw new InternalServerErrorException(
        'User property not found. Please check if access token guard is provided.',
      );
    }

    if (property) {
      return user[property];
    }

    return user;
  },
);

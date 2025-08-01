import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_KEY } from 'src/shared/decorators/public-route.decorator';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const basicToken = req.cookies['basicToken'];

    if (!basicToken) {
      throw new UnauthorizedException('Basic token not found in cookies.');
    }

    const credentials = this.authService.decodeBasicToken(basicToken);
    const user = await this.authService.authenticate(credentials);

    req.user = user;

    return true;
  }
}

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();

    if (isPublicRoute) {
      req.isPublicRoute = true;

      return true;
    }

    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    let token: string | undefined;
    let expectedType: 'access' | 'refresh';

    // Determine which token to use based on the guard type
    if (this.constructor.name === 'AccessTokenGuard') {
      token = accessToken;
      expectedType = 'access';
    } else if (this.constructor.name === 'RefreshTokenGuard') {
      token = refreshToken;
      expectedType = 'refresh';
    } else {
      throw new UnauthorizedException('Unknown token type.');
    }

    if (!token) {
      throw new UnauthorizedException('Token not found in cookies.');
    }

    const result = await this.authService.verifyToken(token);

    if (result.type !== expectedType) {
      throw new UnauthorizedException(`Expected ${expectedType} token.`);
    }

    const user = await this.usersService.getUser({ email: result.email });

    req.token = token;
    req.tokenType = result.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.isPublicRoute) {
      return true;
    }

    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('Access token not found.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.isPublicRoute) {
      return true;
    }

    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('Refresh token not found.');
    }

    return true;
  }
}

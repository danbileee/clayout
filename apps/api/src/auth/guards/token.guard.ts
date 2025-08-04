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
import { TokenTypes } from '../constants/token.const';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const basicToken = req.cookies['basicToken'];

    if (!basicToken) {
      throw new UnauthorizedException('Basic token not found in cookies.');
    }

    const result = await this.authService.verifyToken(basicToken);

    if (result.type !== TokenTypes.basic) {
      throw new UnauthorizedException('Expected basic token.');
    }

    const user = await this.usersService.getUser({ email: result.email });

    req.token = basicToken;
    req.tokenType = result.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
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

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found in cookies.');
    }

    const result = await this.authService.verifyToken(accessToken);

    if (result.type !== TokenTypes.access) {
      throw new UnauthorizedException('Expected access token.');
    }

    const user = await this.usersService.getUser({ email: result.email });

    req.token = accessToken;
    req.tokenType = result.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies.');
    }

    const result = await this.authService.verifyToken(refreshToken);

    if (result.type !== TokenTypes.refresh) {
      throw new UnauthorizedException('Expected refresh token.');
    }

    const user = await this.usersService.getUser({ email: result.email });

    req.token = refreshToken;
    req.tokenType = result.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class CsrfTokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Skip CSRF for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    // Check if route is marked as public
    const isPublicRoute = this.reflector.getAllAndOverride(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublicRoute) {
      return true;
    }

    // Validate CSRF token for protected routes
    const csrfCookie = request.cookies['csrfToken'];
    const csrfHeader = request.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      throw new UnauthorizedException('Invalid CSRF token');
    }

    return true;
  }
}

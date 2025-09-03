import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  Req,
  Patch,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/shared/decorators/public-route.decorator';
import { BasicTokenGuard, RefreshTokenGuard } from './guards/token.guard';
import { Request, Response } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { randomBytes } from 'crypto';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import {
  LoginDto,
  LoginSchema,
  RegisterDto,
  RegisterSchema,
} from '@clayout/interface';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/shared/constants/env.const';

@Controller('auth')
export class AuthController {
  cookieDomain: string;
  hasCookieDomain: boolean;
  isProduction: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.cookieDomain = this.configService.get(EnvKeys.COOKIE_DOMAIN);
    this.hasCookieDomain = Boolean(this.cookieDomain);
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  @Get('user')
  @PublicRoute()
  async getUser(
    @Req() req: Request & { user: UserEntity },
  ): Promise<{ user: UserEntity | null }> {
    const user = await this.authService.getUser(req);

    return { user };
  }

  @Get('token/csrf')
  @PublicRoute()
  getCsrfToken(@Res({ passthrough: true }) res: Response) {
    const csrfToken = randomBytes(32).toString('hex');

    // Clear any previous variants to avoid duplicates (host-only and domain-scoped)
    res.clearCookie('csrfToken');

    if (this.hasCookieDomain && this.isProduction) {
      res.clearCookie('csrfToken', {
        domain: this.cookieDomain,
        path: '/',
      });
    }

    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      // Ensure the cookie is readable across app subdomains in production
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });

    return { csrfToken };
  }

  @Post('token/refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request & { user: UserEntity },
  ) {
    // The RefreshTokenGuard has already validated the refresh token and set req.user
    const accessToken = this.authService.generateAccessToken(req.user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });

    return { message: 'Access token refreshed' };
  }

  @Post('login')
  @PublicRoute()
  async postLogin(
    @Body(new ZodValidationPipe(LoginSchema)) loginUserDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginUserDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  @PublicRoute()
  async postLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('basicToken');
    res.clearCookie('csrfToken');
    if (this.hasCookieDomain && this.isProduction) {
      res.clearCookie('csrfToken', {
        domain: this.cookieDomain,
        path: '/',
      });
    }

    return { message: 'Logout successful' };
  }

  @Post('register')
  @PublicRoute()
  async postRegiter(
    @Body(new ZodValidationPipe(RegisterSchema)) registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { basicToken } = await this.authService.register(registerDto);

    res.cookie('basicToken', basicToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });

    return { message: 'Waiting for email confirmation' };
  }

  @Patch('register')
  @PublicRoute()
  async patchRegister(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.confirm(token);

    res.clearCookie('basicToken');

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });

    return { message: 'Register confirmed' };
  }

  @Post('forgot-password')
  @PublicRoute()
  async postForgotPassword(
    @Body() { email }: Pick<UserEntity, 'email'>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { basicToken } = await this.authService.forgotPassword({ email });

    res.cookie('basicToken', basicToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
    });

    return {
      message: `We've sent you a password reset link. Please check your inbox!`,
    };
  }

  @Post('reset-password')
  @PublicRoute()
  @UseGuards(BasicTokenGuard)
  async postResetPassword(
    @Body('token') token: string,
    @Body() { password: newPassword }: Pick<UserEntity, 'password'>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = res.req as Request & { user: UserEntity };
    const { accessToken, refreshToken } = await this.authService.resetPassword(
      token,
      user,
      newPassword,
    );

    res.clearCookie('basicToken');

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      domain:
        this.hasCookieDomain && this.isProduction
          ? this.cookieDomain
          : undefined,
      path: '/',
    });

    return {
      message: `Your password has been reset successfully! Redirecting to home...`,
    };
  }
}

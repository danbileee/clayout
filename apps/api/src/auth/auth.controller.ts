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
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { PublicRoute } from 'src/shared/decorators/public-route.decorator';
import { BasicTokenGuard, RefreshTokenGuard } from './guards/token.guard';
import { Request, Response } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { randomBytes } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user')
  @PublicRoute()
  async getUser(
    @Req() req: Request & { user: UserEntity },
  ): Promise<{ user: UserEntity }> {
    const user = await this.authService.getUser(req);

    return { user };
  }

  @Get('token/csrf')
  @PublicRoute()
  getCsrfToken(@Res({ passthrough: true }) res: Response) {
    const csrfToken = randomBytes(32).toString('hex');

    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
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
    const { accessToken, refreshToken } = this.authService.generateTokens(
      req.user,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Tokens refreshed' };
  }

  @Post('login')
  @PublicRoute()
  async postLogin(
    @Body() loginUserDto: Pick<CreateUserDto, 'email' | 'password'>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.authenticate(loginUserDto);
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  async postLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('basicToken');
    res.clearCookie('csrfToken');

    return { message: 'Logout successful' };
  }

  @Post('register')
  @PublicRoute()
  async postRegiter(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { basicToken } = await this.authService.register(createUserDto);

    res.cookie('basicToken', basicToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
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
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Waiting for resetting password' };
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
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Password reset successful' };
  }
}

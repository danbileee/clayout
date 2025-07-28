import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  Req,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { PublicRoute } from 'src/shared/decorators/public-route.decorator';
import { BasicTokenGuard, RefreshTokenGuard } from './guards/token.guard';
import { Request, Response } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { EnvKeys } from 'src/shared/constants/env.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Res({ passthrough: true }) res: Response, @Req() req: any) {
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
  @UseGuards(BasicTokenGuard)
  async postLogin(@Res({ passthrough: true }) res: Response) {
    const { user } = res.req as Request & { user: UserEntity };
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

  @Post('register')
  @PublicRoute()
  postRegiter(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('register/confirm')
  @PublicRoute()
  async getRegisterConfirm(
    @Query('token') token: string,
    @Query('emailId', ParseIntPipe) emailId: number,
    @Query('link') link: string,
    @Query('button_text') button_text: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.confirm(
      token,
      {
        email: { id: emailId },
        link,
        button_text,
      },
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

    const defaultLink =
      process.env.NODE_ENV === 'production'
        ? process.env[EnvKeys.CORS_ENABLE_ORIGIN_ROOT]
        : process.env[EnvKeys.CORS_ENABLE_ORIGIN_LOCAL];

    res.redirect(link || defaultLink);
  }
}

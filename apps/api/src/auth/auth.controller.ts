import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  Req,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { PublicRoute } from 'src/shared/decorators/public-route.decorator';
import { BasicTokenGuard, RefreshTokenGuard } from './guards/token.guard';
import { Request, Response } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

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
}

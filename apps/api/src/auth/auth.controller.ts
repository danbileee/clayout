import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  loginWithEmail(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login({ email, password });
  }

  @Post('register/email')
  regiterWithEmail(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register({ nickname, email, password });
  }
}

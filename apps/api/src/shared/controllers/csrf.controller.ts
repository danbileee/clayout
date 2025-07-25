import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { randomBytes } from 'crypto';

@Controller('csrf')
export class CsrfController {
  @Get()
  getCsrfToken(@Res({ passthrough: true }) res: Response) {
    const csrfToken = randomBytes(32).toString('hex');

    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });

    return { csrfToken };
  }
}

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { EmailsService } from './emails.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/shared/constants/env.const';

@Controller('emails')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':id/track-open')
  async trackOpen(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.emailsService.recordOpen({ id });

    // Return a 1x1 transparent gif
    const buffer = Buffer.from(
      'R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64',
    );
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(buffer);
  }

  @Get(':id/track-click')
  async trackClick(
    @Param('id', ParseIntPipe) id: number,
    @Query('link') link: string,
    @Query('button_text') button_text: string,
    @Res() res: Response,
  ) {
    await this.emailsService.recordClick({
      email: { id },
      link,
      button_text,
    });

    const defaultLink =
      process.env.NODE_ENV === 'production'
        ? process.env[EnvKeys.CORS_ENABLE_ORIGIN_ROOT]
        : process.env[EnvKeys.CORS_ENABLE_ORIGIN_LOCAL];

    res.redirect(link || defaultLink);
  }
}

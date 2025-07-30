import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { EmailsService } from './emails.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RecordEmailClickDto } from './dtos/email.dto';
import { PublicRoute } from 'src/shared/decorators/public-route.decorator';

@Controller('emails')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':id/track-open')
  @PublicRoute()
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

  @Post(':id/track-click')
  @PublicRoute()
  async trackClick(
    @Param('id', ParseIntPipe) id: number,
    @Body() recordEmailClickDto: RecordEmailClickDto,
  ) {
    await this.emailsService.recordClick(recordEmailClickDto, id);

    return true;
  }
}

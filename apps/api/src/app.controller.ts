import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello/:param')
  getHello(@Param('param') param: string): string {
    return this.appService.getHello(param);
  }
}

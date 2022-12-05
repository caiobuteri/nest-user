import { Controller, Get, Req, Res, Query, Param } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';

interface ParamsProps {
  id: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello/:id')
  getHello(@Req() request: Request, @Param() params: ParamsProps): string {
    return this.appService.getHello(params.id);
  }
}

import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from './interceptor/app.interceptor';
import { TimeService } from './app.service';

@Controller()
@UseInterceptors(ResponseTimeInterceptor)
export class AppController {
  constructor(private timeService: TimeService) { }

  @Get()
  @Render('layouts/index.hbs')
  root() {
    const APP_URL = process.env.CUR_URL;

    const user = {
      name: null,
      session: false
    };

    const modalArray = [
      { className: 'modal_builder', type: 'builder' },
      { className: 'modal_destructor', type: 'destructor' },
      { className: 'modal_mutator', type: 'mutator' },
      { className: 'modal_authorizer modal_security', type: ['authorizer', 'security'] },
      { className: 'modal_registrar modal_security', type: ['registrar', 'security'] },
      { className: 'modal_restorer modal_security', type: ['restorer', 'security'] },
      { className: 'modal_installer modal_security', type: ['installer', 'security'] }
    ];

    const arr = [
      { className: 'modal_builder', modType: 'builder' },
      { className: 'modal_destructor', modType: 'destructor' },
    ];

    return { APP_URL, modalArray, user, arr };
  }
}

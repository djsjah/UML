import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TimeService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { ClientModule } from './domain/client/client.module';
import { UserModule } from './domain/user/user.module';
import { AllExceptionsFilter } from './exception/all.exception.filter';
import { ValidationExceptionFilter } from './exception/validation.exception.filter';
import { NotFoundExceptionFilter } from './exception/found.exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        index: false,
      },
    }),
    PrismaModule,
    ClientModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    TimeService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter
    }
  ],
})
export class AppModule { }

import { NestFactory } from '@nestjs/core';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exception/all.exception.filter';
import { ValidationExceptionFilter } from './exception/validation.exception.filter';
import { NotFoundExceptionFilter } from './exception/found.exception.filter';
import { serverSiteObj, setServerSite } from './config/server.config';
import { formatValidationErrors } from './validator/format.validator';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const hbs = require('hbs');

  setServerSite(port);

  const options = new DocumentBuilder()
    .setTitle('REST API для базы данных клиентов и пользователей')
    .setDescription('API для управления клиентами и пользователями')
    .setVersion('1.0')
    .addTag('clients')
    .addTag('users')
    .addServer(serverSiteObj.url, serverSiteObj.site)
    .build();

  const helpers = {
    setVar: function (varName, varValue, options) {
      if (!options.data.root) {
        options.data.root = {};
      }

      options.data.root[varName] = varValue;
    },

    or: function (firstCondition, secondCondition) {
      return firstCondition || secondCondition;
    },

    and: function (firstCondition, secondCondition) {
      return firstCondition && secondCondition;
    },

    setProps: function (target) {
      const props = {};
      if (Array.isArray(target)) {
        for (const elem of target) {
          props[elem] = true;
        }
      }
      else {
        props[target] = true;
      }

      return props;
    }
  };

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      console.log('Pipe');
      const formattedErrors = formatValidationErrors(errors);

      return new HttpException({
        statusCode: 422,
        message: formattedErrors,
      }, 422);
    }
  }));

  app.useGlobalFilters(new AllExceptionsFilter(), new ValidationExceptionFilter(), new NotFoundExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..', '/views/partials/'));
  hbs.registerHelper(helpers);

  await app.listen(port);
}

bootstrap();

import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConstraintUserValidator } from '../validator/constraint.user.validator';

@Injectable()
export class ValidateUserInterceptor implements NestInterceptor {
  constructor(private readonly validator: ConstraintUserValidator) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    const isValid = this.validator.validate(body, null);
    if (!isValid) {
      throw new HttpException({
        statusCode: 422,
        message: this.validator.defaultMessage(null),
      }, 422);
    }

    return next.handle();
  }
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConstraintClientValidator } from '../validator/constraint.client.validator';

@Injectable()
export class ValidateClientInterceptor implements NestInterceptor {
  constructor(private readonly validator: ConstraintClientValidator) { }

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

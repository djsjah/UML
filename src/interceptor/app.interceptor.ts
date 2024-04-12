import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimeService } from '../app.service';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  constructor(private timeService: TimeService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startLoadTime = Date.now();
    return next.handle().pipe(
      map((data) => {
        const processingTime = parseFloat(((Date.now() - startLoadTime) * 0.001).toFixed(3));
        this.timeService.setTimeData(processingTime);
        return { ...data, processingTime };
      })
    );
  }
}

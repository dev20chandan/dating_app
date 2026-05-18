import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  success: boolean;
  body: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        let message = 'Success';
        let body = data;

        // If the response object already has a message string, use it
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          if (typeof data.message === 'string') {
            message = data.message;
          }

          if ('body' in data) {
            body = data.body;
          } else {
            // Strip out the message property if it exists, use the rest as body
            const { message: _msg, ...rest } = data;
            body = Object.keys(rest).length > 0 ? rest : null;
          }
        }

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message,
          success: true,
          body,
        };
      }),
    );
  }
}

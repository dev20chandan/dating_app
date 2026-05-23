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
  ): Observable<Response<T> | any> {
    const request = context.switchToHttp().getRequest();
    // Skip formatting for swagger docs endpoints
    if (request.url && request.url.startsWith('/api/docs')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        let message = 'Success';
        let body = data;

        let processedData = data;
        // Handle Mongoose documents
        if (processedData && typeof processedData.toJSON === 'function') {
          processedData = processedData.toJSON();
        } else if (Array.isArray(processedData)) {
          processedData = processedData.map(item => 
            (item && typeof item.toJSON === 'function') ? item.toJSON() : item
          );
        }

        // If the response object already has a message string, use it
        if (processedData && typeof processedData === 'object' && !Array.isArray(processedData)) {
          if (typeof processedData.message === 'string') {
            message = processedData.message;
          }

          if ('body' in processedData) {
            body = processedData.body;
          } else {
            // Strip out the message property if it exists, use the rest as body
            const { message: _msg, ...rest } = processedData;
            body = Object.keys(rest).length > 0 ? rest : null;
          }
        } else {
          body = processedData;
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

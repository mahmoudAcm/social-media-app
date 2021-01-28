import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Error } from 'mongoose';

@Catch(Error.ValidationError)
export class CreatePostExceptionFilter implements ExceptionFilter {
  catch(exception: Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const requiredKeys = Object.keys(exception.errors);

    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message:
        requiredKeys.join(', ') +
        ` ${requiredKeys.length === 1 ? 'is' : 'are'} required`,
    });
  }
}

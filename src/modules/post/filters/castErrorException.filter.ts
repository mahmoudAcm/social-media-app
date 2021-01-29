import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Error } from 'mongoose';

@Catch(Error.CastError)
export class CastErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message: `\`${exception.value}\` is Not Valid ObjectId`,
    });
  }
}

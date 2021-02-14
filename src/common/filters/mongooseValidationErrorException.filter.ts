import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Error } from 'mongoose';

@Catch(Error)
export class MongooseValidationErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    let errors = {};
    if (exception instanceof Error.CastError) {
      const { kind, value } = exception;
      errors['id'] = {
        kind,
        value,
      };
    }

    if (exception instanceof Error.ValidationError) {
      errors = exception.errors;
    }

    const ErrorKeys = Object.keys(errors);
    errors = ErrorKeys.reduce((prevState: any, fieldName: string) => {
      switch (errors[fieldName].kind) {
        case 'enum':
          return {
            ...prevState,
            [fieldName]: `allowed values for ${fieldName} are [${(errors[
              fieldName
            ] as any).properties.enumValues.join(' - ')}]`,
          };
        case 'required':
          return { ...prevState, [fieldName]: 'required' };
        case 'ObjectId':
          return {
            ...prevState,
            [fieldName]: `failed to cast \`${errors[fieldName].value}\` to ObjectId`,
          };
        default:
          return {
            ...prevState,
            'Validator Error': `\`${errors[fieldName].message}`,
          };
      }
    }, {});

    const contextType = host.getType();
    switch (contextType) {
      case 'ws':
        const socket = host.switchToWs().getClient();
        socket.emit('exception', errors);
        break;
      case 'http':
        const response = host.switchToHttp().getResponse();
        response.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          errors,
        });
        break;
    }
  }
}

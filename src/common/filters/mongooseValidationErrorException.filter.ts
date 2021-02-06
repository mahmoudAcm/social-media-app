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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let errors = {};
    if (exception instanceof Error.CastError) {
      const { kind, value } = exception;
      errors['ID'] = {
        kind,
        value,
      };
    }

    if (exception instanceof Error.ValidationError) {
      errors = exception.errors;
    }

    const ErrorKeys = Object.keys(errors);

    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      errors: ErrorKeys.reduce((prevState: any, fieldName: string) => {
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
              [fieldName]: `\`${errors[fieldName].value}\` is Not Valid ObjectId`,
            };
        }
      }, {}),
    });
  }
}

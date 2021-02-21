import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ReactWithPipe implements PipeTransform {
  transform(value: any, { type }: ArgumentMetadata) {
    const errors = {};
    switch (type) {
      case 'param':
        const types = ['love', 'hate', 'like', 'sad', 'laugh'];
        if (!types.includes(value)) {
          errors['type'] = `the allowed reaction are [${types.join(' - ')}]`;
        }
        break;
      case 'body':
        const requiredFields = ['owner', 'activity', 'belongsTo'];
        for (const field of requiredFields) {
          if (!(field in value)) {
            errors[field] = 'is a required property';
          }
        }
        break;
    }

    if (Object.keys(errors).length)
      throw new BadRequestException({ status: 400, errors });

    return value;
  }
}

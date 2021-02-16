import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ReactWithPipe implements PipeTransform {
  transform(fields: any) {
    const errors = {};
    const requiredFields = ['owner', 'activity', 'belongsTo', 'chanal', 'type'];
    for (const field of requiredFields) {
      if (!(field in fields)) {
        errors[field] = 'is a required property';
      }
    }

    const types = ['love', 'hate', 'like', 'sad', 'laugh'];
    if (!types.includes(fields.type) && !errors['type']) {
      errors['type'] = `the allowed reaction are [${types.join(' - ')}]`;
    }

    if (Object.keys(errors).length)
      throw new BadRequestException({ status: 400, errors });

    return fields;
  }
}

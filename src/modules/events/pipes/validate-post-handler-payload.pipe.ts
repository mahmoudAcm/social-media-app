import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { PostHandlerPayload } from '../interfaces';

@Injectable()
export class ValidatePostHandlerPayloadPipe implements PipeTransform {
  transform(payload: PostHandlerPayload) {
    const errors = {};
    const requiredFields = ['type', 'room'];
    for (const field of requiredFields) {
      if (!(field in payload)) {
        errors[field] = 'is a required property';
      }
    }

    if (!errors['type']) {
      const allowedFields = ['interaction', 'comment', 'share'];
      if (!allowedFields.includes(payload.type)) {
        errors['type'] = `allowed types are [${allowedFields.join(' - ')}]`;
      }
    }

    if (!errors['room'] && !isValidObjectId(payload.room)) {
      errors['room'] = `failed to cast \`${payload.room}\` to ObjectId`;
    }

    const optionalFields = ['interaction', 'comment', 'share'];
    const length = optionalFields.reduce(function comulate(sum, value) {
      return sum + Number(value in payload);
    }, 0);

    if (!length || length > 1) {
      errors['payload'] = `please provide one of these [${optionalFields.join(
        ' - ',
      )}]`;
    }

    if (Object.keys(errors).length) {
      throw new BadRequestException({ status: 400, errors });
    }

    return payload;
  }
}

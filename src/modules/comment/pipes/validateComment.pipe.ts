import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateCommentPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const requiredFields = ['content', 'owner', 'post'];
    const missedFields = requiredFields.filter(function isFieldMissed(
      field: string,
    ) {
      return !(field in value);
    });

    if (missedFields.length) {
      const isSingular = missedFields.length == 1;
      throw new BadRequestException(
        null,
        missedFields.join(', ') + ` ${isSingular ? 'is' : 'are'} required`,
      );
    }

    return value;
  }
}

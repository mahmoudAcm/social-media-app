import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class GetPostsPipe implements PipeTransform {
  transform(query: any, metadata: ArgumentMetadata) {
    const requiredFields = ['user', 'page'];
    const missedFields = requiredFields.filter(function isFieldMissed(
      field: string,
    ) {
      return !(field in query);
    });

    if (missedFields.length) {
      const isSingular = missedFields.length == 1;
      throw new BadRequestException(
        null,
        missedFields.join(', ') +
          ` ${isSingular ? 'is' : 'are'} required quer${
            isSingular ? 'y' : 'ies'
          }`,
      );
    }

    if (!Number.isInteger(Number(query.page))) {
      throw new BadRequestException(null, 'page should be a number');
    }

    return {
      ...query,
      page: Number(query.page),
    };
  }
}

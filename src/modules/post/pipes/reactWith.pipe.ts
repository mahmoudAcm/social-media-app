import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ReactWithPipe implements PipeTransform {
  transform(fileds: any) {
    const requiredFields = ['owner', 'activity', 'belongsTo'];
    const missedFields = requiredFields.filter(function isFieldMissed(
      field: string,
    ) {
      return !(field in fileds);
    });

    if (missedFields.length) {
      const isSingular = missedFields.length == 1;
      throw new BadRequestException(
        null,
        missedFields.join(', ') +
          ` ${isSingular ? 'is' : 'are'} required field${
            isSingular ? '' : 's'
          }`,
      );
    }

    return fileds;
  }
}

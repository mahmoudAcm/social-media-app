import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class GetPostsPipe implements PipeTransform {
  transform(query: any) {
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

    const keys = Object.keys(query || {});
    // -2 used to exclued user and page query
    if (keys.length - 2 >= 2)
      throw new ForbiddenException(
        null,
        "you can't use more than one filter at a time",
      );

    const filterNames = ['postedAfter', 'postedBefore', 'postedBetween'];
    keys.forEach(function checkFilter(key) {
      if (!filterNames.includes(key) && !requiredFields.includes(key))
        throw new BadRequestException(
          null,
          `this filter \`${key}\` is not applicable`,
        );
    });

    const filter = {};
    filterNames.forEach(function checkFilter(filterName) {
      if (filterName in query) {
        filter['name'] = filterName;
        if (filterName === filterNames[2]) {
          const [start, end] = query[filterName].split(',');

          filter['start'] = Number(start);
          filter['end'] = Number(end);

          if (
            !Number.isInteger(filter['start']) ||
            !Number.isInteger(filter['end'])
          ) {
            throw new BadRequestException(
              null,
              `the interval should be a postive intger`,
            );
          }

          if (filter['start'] > filter['end']) {
            throw new BadRequestException(
              null,
              'the startDate should be less than or equal endDate',
            );
          }
        } else {
          filter[filterName] = Number(query[filterName]);
          if (!Number.isInteger(filter[filterName])) {
            throw new BadRequestException(
              null,
              `${filterName} should be a number`,
            );
          }
        }
      }
    });

    return {
      user: query.user,
      page: Number(query.page),
      filter,
    };
  }
}

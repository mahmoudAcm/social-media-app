import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class GetReactionsPipe implements PipeTransform {
  transform(queries: any) {
    const requiredQueries = ['activity', 'page'];
    const missedQueries = requiredQueries.filter(function isQueryMissed(
      query: string,
    ) {
      return !(query in queries);
    });

    if (missedQueries.length) {
      const isSingular = missedQueries.length == 1;
      throw new BadRequestException(
        null,
        missedQueries.join(', ') +
          ` ${isSingular ? 'is' : 'are'} required quer${
            isSingular ? 'y' : 'ies'
          }`,
      );
    }

    if (!Number.isInteger(Number(queries.page))) {
      throw new BadRequestException(null, 'page should be a number');
    }

    return {
      ...queries,
      page: Number(queries.page),
    };
  }
}

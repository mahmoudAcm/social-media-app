import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class GetConnectionsPipe implements PipeTransform {
  transform(query: any) {
    const errors = {};
    const requiredQueries = ['user', 'page'];
    for (const property of requiredQueries) {
      if (!(property in query)) {
        errors[property] = 'is a required query';
      }
    }

    if (!Number.isInteger(Number(query.page))) {
      errors['page'] = 'should be a number';
    }

    if (Object.keys(errors).length) {
      throw new BadRequestException({ status: 400, errors });
    }

    return {
      ...query,
      page: Number(query.page),
    };
  }
}

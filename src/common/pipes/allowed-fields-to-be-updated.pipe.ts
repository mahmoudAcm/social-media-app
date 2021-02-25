import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AllowedFieldsToBeUpdatedPipe implements PipeTransform {
  constructor(private readonly arrayFilters: Array<string>) {}

  transform(fields: any) {
    const updateFields = Object.keys(fields);
    for (const field of updateFields) {
      if (!this.arrayFilters.includes(field)) {
        throw new ForbiddenException(
          null,
          `you can\'t set this field \`${field}\``,
        );
      }
    }
    return fields;
  }
}

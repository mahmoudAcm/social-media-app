import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AllowedFieldsToBeUpdatedPipe<T> implements PipeTransform {
  private arrayFilters: Array<string>;

  static include(arrayFilters: Array<string>) {
    this.prototype.arrayFilters = arrayFilters;
    return this;
  }

  transform(fields: T) {
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

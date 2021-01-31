import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AllowedFieldsToBeUpdatedPipe<T> implements PipeTransform {
  constructor(private readonly arrayFilters: Array<string>) {
    this.checkField = this.checkField.bind(this);
  }

  transform(fields: T) {
    const upadateFields = Object.keys(fields);
    upadateFields.forEach(this.checkField);
    return fields;
  }

  /** checks if the field can be updated */
  private checkField(field: string) {
    if (!this.arrayFilters.includes(field)) {
      throw new ForbiddenException(
        null,
        `you can\'t set this field \`${field}\``,
      );
    }
  }
}

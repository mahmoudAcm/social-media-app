import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CheckReactionTypePipe implements PipeTransform {
  transform(type: any) {
    const types = ['love', 'hate', 'like', 'sad', 'laugh'];
    if (!types.includes(type)) {
      throw new BadRequestException(
        null,
        `the allowed reaction are [${types.join(' - ')}]`,
      );
    }
    return type;
  }
}

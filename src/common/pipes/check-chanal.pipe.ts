import {
  ArgumentMetadata,
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CheckChanalPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if ('chanal' in value) {
      throw new ForbiddenException(null, "you can't set chanal value!");
    }
    return value;
  }
}

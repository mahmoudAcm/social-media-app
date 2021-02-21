import { Module } from '@nestjs/common';
import { SocialGateway } from './social.gateway';

@Module({
  providers: [SocialGateway],
})
export class EventsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_LINK } from '../../configs';

@Module({
  imports: [
    MongooseModule.forRoot(DB_LINK)
  ],
})
export class AppModule {}

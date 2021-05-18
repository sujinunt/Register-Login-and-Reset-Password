import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot('Your mongodb database'),
    UsersModule,
  ],
  controllers: [AppController]
})
export class AppModule {}

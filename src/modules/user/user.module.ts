import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { userProviders } from './user.provider';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module, DatabaseModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [...userProviders, UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}

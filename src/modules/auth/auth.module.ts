import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    UserModule,
    JwtModule.register({
      signOptions: { expiresIn: '180s' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService, AuthResolver],
})
export class AuthModule {}

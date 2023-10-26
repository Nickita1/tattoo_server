import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { omit } from 'lodash';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../../utils/hash';

const toUserResponse = (user: UserEntity) => omit(user, ['password']);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string) {
    const user: UserEntity = await this.userService.getOneUser(login);

    if (user) {
      const isRightPassword = await comparePassword(password, user.password);

      return isRightPassword ? toUserResponse(user) : null;
    }

    return null;
  }

  async login(user: UserEntity) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        id: user.id,
        role: user.role,
      }),
      user,
    };
  }
}

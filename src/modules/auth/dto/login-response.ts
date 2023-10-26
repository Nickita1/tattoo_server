import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field(() => UserEntity)
  user: UserEntity;
}

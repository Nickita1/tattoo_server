import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserEntity)
  async createUser(
    @Args({ name: 'uploadedFile', type: () => GraphQLUpload })
    uploadedFile: Upload,
    @Args('createUser')
    createUserInput: CreateUserInput,
  ): Promise<UserEntity> {
    const file = await uploadedFile;

    return this.userService.createUser(file, createUserInput);
  }

  @Mutation(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('updateUser') updateUserInput: UpdateUserInput,
    @Args({ name: 'uploadedFile', nullable: true, type: () => GraphQLUpload })
    uploadedFile?: Upload,
  ): Promise<UserEntity> {
    const file = await uploadedFile;

    return this.userService.updateUser(updateUserInput, file);
  }

  @Query(() => [UserEntity])
  async getAllUsers(
    @Args('take') take: number,
    @Args('skip') skip: number,
  ): Promise<UserEntity[]> {
    return this.userService.getAllUsers(take, skip);
  }

  @Query(() => UserEntity)
  async getOneUser(@Args('username') username: string): Promise<UserEntity> {
    return this.userService.getOneUser(username);
  }

  @Mutation(() => UserEntity)
  @UseGuards(JwtAuthGuard)
  async removeUser(@Args('id') id: string): Promise<UserEntity> {
    return this.userService.removeUser(id);
  }
}

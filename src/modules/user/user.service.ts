import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from '../../utils/hash';
import { BrandPartnerProfileEntity } from './entities/brand_partner_profile.entity';
import { UserRole } from './entities/enum';
import { EmployeeProfileEntity } from './entities/employee_profile.entity';
import { pick } from 'lodash';
import { S3Service } from '../s3/s3.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload';
import { UpdateBrandPartnerInput } from './dto/update-brand-partner.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { CreateBrandPartnerInput } from './dto/create-brand-partner.input';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UserRepository } from './user.provider';

const toUserProfileData = (
  input: CreateUserInput | UpdateUserInput,
): {
  brand_partner_profile?: UpdateBrandPartnerInput | CreateBrandPartnerInput;
  employee_profile?: UpdateEmployeeInput | CreateEmployeeInput;
} => pick(input, ['brand_partner_profile', 'employee_profile']);

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    @Inject('BRAND_PARTNER_PROFILE_REPOSITORY')
    private brandPartnerProfileRepository: Repository<BrandPartnerProfileEntity>,
    @Inject('EMPLOYEE_PROFILE_REPOSITORY')
    private employeeProfileRepository: Repository<EmployeeProfileEntity>,
    private s3Service: S3Service,
  ) {}

  private checkUserProfile(userInput: CreateUserInput | UpdateUserInput): {
    brandPartnerProfile: UpdateBrandPartnerInput | CreateBrandPartnerInput;
    employeeProfile: UpdateEmployeeInput | CreateEmployeeInput;
    isBrandPartner: boolean;
  } {
    const {
      brand_partner_profile: brandPartnerProfile,
      employee_profile: employeeProfile,
    } = toUserProfileData(userInput);

    if (
      (!brandPartnerProfile && !employeeProfile) ||
      (brandPartnerProfile && employeeProfile)
    )
      throw new ForbiddenException('User should be with 1 profile.');

    const isBrandPartner = !!brandPartnerProfile;

    return { brandPartnerProfile, employeeProfile, isBrandPartner };
  }

  public async createUser(
    file: GraphQLUpload,
    createUserInput: CreateUserInput,
  ): Promise<UserEntity> {
    const { username, password } = createUserInput;

    const existedUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existedUser)
      throw new ForbiddenException('User with this login already exists.');

    const { brandPartnerProfile, employeeProfile, isBrandPartner } =
      this.checkUserProfile(createUserInput);

    const hashedPassword = await hashPassword(password);

    const fileLink = await this.s3Service.addFile(file);

    const { id: profileId } = isBrandPartner
      ? await this.brandPartnerProfileRepository.save({
          ...brandPartnerProfile,
        })
      : await this.employeeProfileRepository.save({
          ...employeeProfile,
        });

    const userData = {
      password: hashedPassword,
      username,
      picture_link: fileLink,
      role: isBrandPartner ? UserRole.BRAND_PARTNER : UserRole.EMPLOYEE,
      ...(isBrandPartner
        ? { brand_partner_profile_id: profileId }
        : { employee_profile_id: profileId }),
    };

    await this.userRepository.save(userData);

    return this.userRepository.getOneUser(isBrandPartner, profileId);
  }

  public async updateUser(
    updateUserInput: UpdateUserInput,
    file?: GraphQLUpload,
  ): Promise<UserEntity> {
    const { username, password } = updateUserInput;

    const existedUser = username
      ? await this.userRepository.findOne({ where: { username } })
      : null;

    if (existedUser)
      throw new ForbiddenException('User with this login already exists.');

    const user = await this.userRepository.findOne({
      where: { id: updateUserInput.id },
    });

    if (!user) throw new NotFoundException('User not found.');

    const { brandPartnerProfile, employeeProfile, isBrandPartner } =
      this.checkUserProfile(updateUserInput);

    if (
      (brandPartnerProfile && !user.brand_partner_profile_id) ||
      (employeeProfile && !user.employee_profile_id)
    )
      throw new ForbiddenException('Please recheck the role of updating user.');

    const hashedPassword = password && (await hashPassword(password));

    const fileLink = await this.s3Service.addFile(file);

    const { id: profileId } = isBrandPartner
      ? await this.brandPartnerProfileRepository.save({
          id: user.brand_partner_profile_id,
          ...brandPartnerProfile,
          ...(fileLink && { logo_link: fileLink }),
        })
      : await this.employeeProfileRepository.save({
          id: user.employee_profile_id,
          ...employeeProfile,
          ...(fileLink && { avatar_link: fileLink }),
        });

    const userData = {
      ...(hashedPassword && { password: hashedPassword }),
      ...(username && { username }),
    };

    await this.userRepository.update({ id: updateUserInput.id }, userData);

    return this.userRepository.getOneUser(isBrandPartner, profileId);
  }

  async getAllUsers(take: number, skip: number): Promise<UserEntity[]> {
    return this.userRepository.find({ take, skip });
  }

  async getOneUser(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) throw new NotFoundException('User not found.');

    const profileId = user.brand_partner_profile_id || user.employee_profile_id;

    return this.userRepository.getOneUser(
      !!user.brand_partner_profile_id,
      profileId,
    );
  }

  async removeUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new ForbiddenException('User missed.');

    await this.userRepository.delete(id);

    return user;
  }
}

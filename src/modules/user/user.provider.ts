import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BrandPartnerProfileEntity } from './entities/brand_partner_profile.entity';
import { EmployeeProfileEntity } from './entities/employee_profile.entity';

interface UserCustomMethods {
  getOneUser: (
    isBrandPartner: boolean,
    profileId: string,
  ) => Promise<UserEntity>;
}

export type UserRepository = Repository<UserEntity> & UserCustomMethods;

const userCustomMethods: UserCustomMethods = {
  getOneUser(isBrandPartner: boolean, profileId: string): Promise<UserEntity> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect(
        `user.${isBrandPartner ? 'brand_partner_profile' : 'employee_profile'}`,
        'userProfile',
      )
      .where(
        `user.${
          isBrandPartner ? 'brand_partner_profile_id' : 'employee_profile_id'
        } = :profileId`,
        { profileId },
      )
      .getOne();
  },
};

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource): UserRepository =>
      dataSource.getRepository(UserEntity).extend(userCustomMethods),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'BRAND_PARTNER_PROFILE_REPOSITORY',
    useFactory: (
      dataSource: DataSource,
    ): Repository<BrandPartnerProfileEntity> =>
      dataSource.getRepository(BrandPartnerProfileEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'EMPLOYEE_PROFILE_REPOSITORY',
    useFactory: (dataSource: DataSource): Repository<EmployeeProfileEntity> =>
      dataSource.getRepository(EmployeeProfileEntity),
    inject: ['DATA_SOURCE'],
  },
];

import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from './enum';
import { BrandPartnerProfileEntity } from './brand_partner_profile.entity';
import { EmployeeProfileEntity } from './employee_profile.entity';

@ObjectType()
@Entity({ name: 'user' })
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ length: 500 })
  username: string;

  @Field()
  @Column({ enum: UserRole })
  role: UserRole;

  @Field()
  @Column()
  picture_link: string;

  @Field()
  @OneToOne(() => EmployeeProfileEntity)
  @JoinColumn({ name: 'employee_profile_id' })
  employee_profile: EmployeeProfileEntity;

  @Field()
  @Column({ nullable: true })
  employee_profile_id: string;

  @Field()
  @OneToOne(() => BrandPartnerProfileEntity)
  @JoinColumn({ name: 'brand_partner_profile_id' })
  brand_partner_profile: BrandPartnerProfileEntity;

  @Field()
  @Column({ nullable: true })
  brand_partner_profile_id: string;
}

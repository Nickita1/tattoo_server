import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeeGender } from './enum';

@ObjectType()
@Entity({ name: 'employee_profile' })
export class EmployeeProfileEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ enum: EmployeeGender })
  gender: EmployeeGender;

  @Field()
  @Column()
  date_of_birth: Date;

  @Field()
  @Column()
  education: string;

  @Field()
  @Column()
  experience: string;

  @Field()
  @Column()
  contact_number: string;

  @Field()
  @Column()
  contact_email: string;

  @Field()
  @Column()
  style: string;
}

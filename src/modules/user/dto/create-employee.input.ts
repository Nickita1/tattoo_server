import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { EmployeeGender } from '../entities/enum';

registerEnumType(EmployeeGender, {
  name: 'EmployeeGender',
});

@InputType()
export class CreateEmployeeInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => EmployeeGender)
  gender: EmployeeGender;

  @Field()
  date_of_birth: Date;

  @Field()
  education: string;

  @Field()
  experience: string;

  @Field()
  contact_number: string;

  @Field()
  contact_email: string;

  @Field()
  style: string;
}

import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateEmployeeInput } from './create-employee.input';
import { CreateBrandPartnerInput } from './create-brand-partner.input';
import { UpdateBrandPartnerInput } from './update-brand-partner.input';
import { UpdateEmployeeInput } from './update-employee.input';

@InputType()
class UserInput {
  @Field()
  password: string;

  @Field()
  username: string;
}
@InputType()
export class CreateUserInput extends UserInput {
  @Field({ nullable: true })
  brand_partner_profile: CreateBrandPartnerInput;

  @Field({ nullable: true })
  employee_profile: CreateEmployeeInput;
}

@InputType()
export class UpdateUserInput extends PartialType(UserInput) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  brand_partner_profile: UpdateBrandPartnerInput;

  @Field({ nullable: true })
  employee_profile: UpdateEmployeeInput;
}

import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBrandPartnerInput {
  @Field()
  name: string;

  @Field()
  description: string;
}

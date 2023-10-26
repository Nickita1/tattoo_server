import { CreateBrandPartnerInput } from './create-brand-partner.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBrandPartnerInput extends PartialType(
  CreateBrandPartnerInput,
) {}

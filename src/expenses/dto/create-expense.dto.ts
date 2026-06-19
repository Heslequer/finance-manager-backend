import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsUUID()
  @IsOptional()
  subcategory_id?: string;

  @IsUUID()
  @IsOptional()
  credit_card_id?: string;

  @IsNumber()
  @IsOptional()
  installment_number?: number;

  @IsNumber()
  @IsOptional()
  total_installments?: number;
}
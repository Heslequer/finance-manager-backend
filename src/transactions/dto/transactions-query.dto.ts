import { IsIn, IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @IsOptional()
  @IsIn(['expense', 'income'])
  type?: 'expense' | 'income';

  @IsOptional()
  dateFrom?: string;

  @IsOptional()
  dateTo?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  @IsString()
  creditCardId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}


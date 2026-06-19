import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCreditCardDto {
    @IsString()
    @IsNotEmpty()
    card_name: string;

    @IsString()
    @IsNotEmpty()
    bank_name: string;

    @IsString()
    @IsNotEmpty()
    card_gradient: string;

    @IsString()
    @IsNotEmpty()
    card_digits: string;

    @IsString()
    @IsNotEmpty()
    valid_thru: string;

    @IsNumber()
    @IsNotEmpty()
    credit_limit: number;

    @IsNumber()
    @IsNotEmpty()
    closing_day: number;

    @IsNumber()
    @IsNotEmpty()
    due_day: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsNumber()
    @IsOptional()
    current_balance?: number;

    @IsBoolean()
    @IsOptional()
    card_active?: boolean;
}

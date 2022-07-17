import { IsInt, IsNotEmpty } from "class-validator";

export class TransferFundRequestDto {
    @IsNotEmpty()
    from: string;

    @IsNotEmpty()
    to: string;
    
    @IsInt()
    amount: number;
}

export class TransferFundResponseDto {
    id: string;
}
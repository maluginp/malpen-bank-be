import { IsNotEmpty } from "class-validator";

export class ConfirmRequestDto {
  
  @IsNotEmpty()
  code: string
}

export class ConfirmResponseDto {
  id: number;
  token: string;
}
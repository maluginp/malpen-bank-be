import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";

export class SignUpRequestDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @Length(3, 50)
    @Matches(/[a-zA-Z0-9]/)
    nickname: string;
}

export class SignUpResponseDto {
    id: number;
    token: string;
}
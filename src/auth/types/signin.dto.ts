export class SignInRequestDto {
    email: string;
    password: string;
}

export class SignInResponseDto {
    id: number;
    token: string;
}
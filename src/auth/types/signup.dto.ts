export class SignUpRequestDto {
    email: string;
    password: string;
}

export class SignUpResponseDto {
    id: number;
    token: string;
}
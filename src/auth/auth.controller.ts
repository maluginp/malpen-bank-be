import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmRequestDto, ConfirmResponseDto } from './types/confirm.dto';
import { SignInRequestDto, SignInResponseDto } from './types/signin.dto';
import { SignUpRequestDto, SignUpResponseDto } from './types/signup.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post("signin")
    async signIn(@Body() body: SignInRequestDto): Promise<SignInResponseDto> {
        return this.authService.signIn(body.email, body.password)
    }


    @Post("signup")
    async signUp(@Body() body: SignUpRequestDto): Promise<SignUpResponseDto> {
        return this.authService.signUp(body.email, body.password)
    }

    @Post("confirm")
    async confirm(@Body() body: ConfirmRequestDto): Promise<ConfirmResponseDto> {
        return this.authService.confirm(body.code)
    }
}

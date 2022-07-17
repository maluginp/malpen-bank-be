import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmRequestDto, ConfirmResponseDto } from './dtos/confirm.dto';
import { SignInRequestDto, SignInResponseDto } from './dtos/signin.dto';
import { SignUpRequestDto, SignUpResponseDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post("signin")
    async signIn(@Body() body: SignInRequestDto): Promise<SignInResponseDto> {
        const auth = await this.authService.signIn(body.email, body.password)

        return {
            id: auth.id,
            token: auth.token
        }
    }


    @Post("signup")
    async signUp(@Body() body: SignUpRequestDto): Promise<SignUpResponseDto> {
        const auth = await this.authService.signUp(
            body.email, 
            body.password,
            body.nickname
        )

        return {
            id: auth.id,
            token: auth.token
        }
    }

    @Post("confirm")
    async confirm(@Body() body: ConfirmRequestDto): Promise<ConfirmResponseDto> {
        const auth = await this.authService.confirm(body.code)

        return {
            id: auth.id,
            token: auth.token
        }
    }
}

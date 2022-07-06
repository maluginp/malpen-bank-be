import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';
import { SignUpResponseDto } from './types/signup.dto';
import bcrypt from 'bcrypt'
import { TokenService } from '../token/token.service';
import { SignInResponseDto } from './types/signin.dto';
import { ConfirmResponseDto } from './types/confirm.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {

    constructor(
        private walletService: WalletService,
        private userService: UserService,
        private tokenService: TokenService,
        private mailService: MailService,
    ) { }

    async signIn(email: string, password: string): Promise<SignInResponseDto> {
        const user = await this.userService.findByEmail(email)

        if (user == null) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        }

        const token = await this.tokenService.generate(user.id, user.email)

        return {
            id: user.id,
            token: token
        }   
    }

    async signUp(email: string, password: string): Promise<SignUpResponseDto> {
        const foundUser = await this.userService.findByEmail(email)

        if (foundUser != null) {
            throw new HttpException("Already existed", HttpStatus.FORBIDDEN)
        }

        const hash = await bcrypt.hash(password, 10)
        
        const user = await this.userService.create({
            email, 
            password: hash
        })
        
        await this.walletService.create(user.id)
        const token = await this.tokenService.generate(user.id, user.email)

        await this.mailService.sendUserConfirmation(user, user.code)
        
        console.log(`Created token for new user = ${token}`)

        return {
            id: user.id,
            token: token
        }   
    }

    async confirm(code: string): Promise<ConfirmResponseDto> {
        const user = await this.userService.confirm(code)
        const token = await this.tokenService.generate(user.id, user.email)
        return {
            id: user.id,
            token,
        }
    }
    
}

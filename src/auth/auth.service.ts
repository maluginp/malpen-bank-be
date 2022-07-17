import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';
import bcrypt from 'bcrypt'
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { IAuthToken } from './types/auth.type';

@Injectable()
export class AuthService {

    constructor(
        private walletService: WalletService,
        private userService: UserService,
        private tokenService: TokenService,
        private mailService: MailService,
    ) { }

    async signIn(email: string, password: string): Promise<IAuthToken> {
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

    async signUp(
        email: string, 
        password: string,
        nickname: string,
    ): Promise<IAuthToken> {
        const foundUser = await this.userService.findByEmail(email)

        if (foundUser != null) {
            throw new HttpException("Already existed", HttpStatus.FORBIDDEN)
        }

        const isValidNickname = await this.userService.validateNickname(nickname)
        if (!isValidNickname) {
            throw new HttpException("User with this nickname already existed", HttpStatus.FORBIDDEN)
        }

        const hash = await bcrypt.hash(password, 10)
        
        const user = await this.userService.create({
            email, 
            password: hash,
            nickname
        })

        try {
            await this.walletService.create(user.id)
        } catch (e) {
            
        }
        const token = await this.tokenService.generate(user.id, user.email)

        await this.mailService.sendUserConfirmation(user, user.code)
        
        console.log(`Created token for new user = ${token}`)

        return {
            id: user.id,
            token: token
        }   
    }

    async confirm(code: string): Promise<IAuthToken> {
        const user = await this.userService.confirm(code)
        const token = await this.tokenService.generate(user.id, user.email)
        return {
            id: user.id,
            token,
        }
    }
    
}

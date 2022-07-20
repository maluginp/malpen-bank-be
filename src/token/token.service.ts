import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtToken, Token, UserID } from './types/token.type';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    async generate(userId: number, email: string): Promise<string> {
        const token: JwtToken = {
            userId,
            email
        }
        
        return this.jwtService.signAsync(token)
    }

    async verify(jwtToken: string): Promise<boolean> {
        const token = await this.jwtService.verifyAsync<Token>(jwtToken)

        if (token == null) {
            return false
        }

        try {
            await this.userService.findOne(token.userId.unwrap())
            return true
        } catch(e) {
            return false
        }
    }
}

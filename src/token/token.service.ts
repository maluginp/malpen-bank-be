import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Token } from './types/token.type';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    async generate(id: number, email: string): Promise<string> {
        const token: Token = {
            id, email
        }
        
        return this.jwtService.signAsync(token)
    }

    async verify(jwtToken: string): Promise<boolean> {
        const token = await this.jwtService.verifyAsync<Token>(jwtToken)

        if (token == null) {
            return false
        }

        try {
            await this.userService.findOne(token.id)
            return true
        } catch(e) {
            return false
        }
    }
}

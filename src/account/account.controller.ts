import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';
import { Token } from '../token/types/token.type';
import { IProfile } from '../user/types/profile.type';
import { UserService } from '../user/user.service';
import { AccountService } from './account.service';
import { IAccountBalance } from './types/account-balance.dto';

@Controller('account')
export class AccountController {

  constructor(
    private accountService: AccountService,
    private userService: UserService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get("balance")
  async all(@ReqToken() token: Token): Promise<IAccountBalance> {
    const balance = await this.accountService.getBalance(token.id)

    return {
      balance
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@ReqToken() token: Token): Promise<IProfile> {
    const user = await this.userService.findOne(token.id)

    return {
      id: user.id,
      email: user.email
    }
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';
import { Token } from '../token/types/token.type';
import { UserService } from '../user/user.service';
import { AccountService } from './account.service';
import { AccountBalanceResponseDto } from './dtos/balance.dto';
import { ProfileResponseDto } from './dtos/profile.dto';

@Controller('account')
export class AccountController {

  constructor(
    private accountService: AccountService,
    private userService: UserService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get("balance")
  async all(@ReqToken() token: Token): Promise<AccountBalanceResponseDto> {
    const balance = await this.accountService.getBalance(token.userId)

    return {
      balance
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@ReqToken() token: Token): Promise<ProfileResponseDto> {
    const user = await this.userService.findOne(token.userId.unwrap())

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    }
  }
}

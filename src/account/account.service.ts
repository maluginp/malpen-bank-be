import { Injectable } from '@nestjs/common';
import { UserID } from '../token/types/token.type';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class AccountService {
  constructor(
    private walletService: WalletService
  ) { }

  async getBalance(userId: UserID): Promise<number> {
    const wallets = await this.walletService.allByUser(userId)
    
    return wallets
      .map(e => e.balance)
      .reduce((sum, b) => sum + b)
  }
}

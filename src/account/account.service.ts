import { Injectable } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class AccountService {
  constructor(
    private walletService: WalletService
  ) { }

  async getBalance(userId: number): Promise<number> {
    const wallets = await this.walletService.allByUser(userId)
    
    return wallets
      .map(e => e.balance)
      .reduce((sum, b) => sum + b)
  }
}

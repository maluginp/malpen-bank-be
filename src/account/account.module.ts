import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    WalletModule,
    UserModule,
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}

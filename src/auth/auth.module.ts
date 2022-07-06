import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    WalletModule,
    UserModule,
    TokenModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

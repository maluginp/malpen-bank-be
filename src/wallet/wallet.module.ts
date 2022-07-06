import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletEntity } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    TokenModule,
  ],
  providers: [
    WalletService,
  ],
  exports: [WalletService],
  controllers: [WalletController]
})
export class WalletModule {}

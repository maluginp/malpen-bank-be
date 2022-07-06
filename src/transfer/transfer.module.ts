import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { WalletModule } from '../wallet/wallet.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    WalletModule,
    TransactionModule,
  ],
  providers: [TransferService],
  controllers: [TransferController],
})
export class TransferModule {}

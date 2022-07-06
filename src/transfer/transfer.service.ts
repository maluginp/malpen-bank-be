import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { ITransaction } from '../transaction/types/transaction.type';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TransferService {
    constructor(
        private walletService: WalletService,
        private transactionService: TransactionService,
    ) {}

    async transfer(
        userId: number,
        fromWallet: string,
        toWallet: string,
        amount: number,
    ): Promise<ITransaction> {

        const signature = await this.walletService.send(
            userId, fromWallet, toWallet, amount
        )

        return this.transactionService.createTransfer({
            signature,
            senderId: userId,
            senderAddress: fromWallet,
            receiverId: userId,
            receiverAddress: toWallet,
            amount: amount
        })
    }
}

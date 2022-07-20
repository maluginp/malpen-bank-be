import { Injectable } from '@nestjs/common';
import { UserID } from '../token/types/token.type';
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
        userId: UserID,
        fromWallet: string,
        toWallet: string,
        amount: number,
    ): Promise<ITransaction> {

        const signature = await this.walletService.send(
            userId.unwrap(), fromWallet, toWallet, amount
        )

        return this.transactionService.createTransfer({
            signature,
            senderId: userId.unwrap(),
            senderAddress: fromWallet,
            receiverId: userId.unwrap(),
            receiverAddress: toWallet,
            amount: amount
        })
    }
}

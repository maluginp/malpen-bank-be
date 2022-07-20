import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity, TransactionOperationEntity, TransactionStatusEntity } from './entities/transaction.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ICreateTransactionTransfer, ITransaction, TransactionOperation, TransactionStatus } from './types/transaction.type';
import { UserID } from '../token/types/token.type';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TransactionEntity)
        private repository: Repository<TransactionEntity>,
    ) { }

    async createTransfer(input: ICreateTransactionTransfer): Promise<ITransaction> {
        const entity = await this.repository.save<DeepPartial<TransactionEntity>>({
            signature: input.signature,
            senderId: input.senderId,
            senderAddress: input.senderAddress,
            receiverAddress: input.receiverAddress,
            amount: input.amount,
            status: TransactionStatusEntity.PROCESSING,
            operation: TransactionOperationEntity.TRANSFER
        })

        return this.mapEntityToTransaction(entity)
    }

    async allByUserID(userId: UserID): Promise<ITransaction[]> {
        const user = userId.unwrap()

        const entities = await this.repository.find({
            where: [{
                senderId: user
            }, {
                receiverId: user
            }]
        })

        return entities.map(e => this.mapEntityToTransaction(e))
    }

    async getById(id: number): Promise<ITransaction> {
        const entity = await this.repository.findOne({
            where: {
                id
            },
        })
        return this.mapEntityToTransaction(entity)
    }

    private mapEntityToTransaction(entity: TransactionEntity): ITransaction {
        return {
            id: entity.id,
            signature: entity.signature,
            senderId: entity.senderId,
            senderAddress: entity.senderAddress,
            receiverId: entity.receiverId,
            receiverAddress: entity.receiverAddress,
            amount: entity.amount,
            status: this.mapStatusEntityToStatus(entity.status),
            operation: this.mapOperationEntityToStatus(entity.operation),
            createdAt: entity.createdAt
        }
    }

    private mapStatusEntityToStatus(entity: TransactionStatusEntity): TransactionStatus {
        switch(entity) {
            case TransactionStatusEntity.SUCCEED: return TransactionStatus.SUCCEED
            case TransactionStatusEntity.PROCESSING: return TransactionStatus.PROCESSING
            case TransactionStatusEntity.CANCELLED: return TransactionStatus.CANCELLED
        }
    }

    private mapOperationEntityToStatus(entity: TransactionOperationEntity): TransactionOperation {
        switch(entity) {
            case TransactionOperationEntity.TRANSFER: return TransactionOperation.TRANSFER
        }
    }
}

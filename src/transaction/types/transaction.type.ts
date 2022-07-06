export interface ICreateTransactionTransfer {
    signature: string,
    senderId: number,
    senderAddress: string,
    receiverId?: number,
    receiverAddress?: string,
    amount: number,
}

export interface ITransaction {
    id: number,
    signature: string,
    senderId: number,
    senderAddress: string,
    receiverId?: number,
    receiverAddress?: string,
    amount: number,
    status: TransactionStatus,
    operation: TransactionOperation,
    createdAt: string
}

export enum TransactionStatus {
    SUCCEED, CANCELLED, PROCESSING
}

export enum TransactionOperation {
    TRANSFER
}
import { TransactionOperation, TransactionStatus } from "../types/transaction.type"

export class TransactionResponseDto {
  id: number
  signature: string
  senderId: number
  senderAddress: string
  receiverId?: number
  receiverAddress?: string
  amount: number
  status: TransactionStatus
  operation: TransactionOperation
  createdAt: string
}
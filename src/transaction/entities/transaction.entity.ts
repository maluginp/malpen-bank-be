import { UserEntity } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TransactionStatusEntity {
    SUCCEED = 0,
    CANCELLED = 1,
    PROCESSING = 2
}

export enum TransactionOperationEntity {
    TRANSFER = 0
}


@Entity("transactions")
export class TransactionEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    signature: string;


    @Column({
        name: "sender_id"
    })
    senderId: number


    @Column({
        name: "sender_address",
    })
    senderAddress: string


    @Column({
        name: "receiver_id",
    })
    receiverId?: number

    @Column({
        name: "receiver_address",
        nullable: true
    })
    receiverAddress?: string


    @Column({
        name: "amount",
    })
    amount: number

    @Column({
        type: "enum",
        enum: TransactionStatusEntity,
        default: TransactionStatusEntity.PROCESSING
    })
    status: TransactionStatusEntity

    @Column({
        type: "enum",
        enum: TransactionOperationEntity,
        default: TransactionOperationEntity.TRANSFER
    })
    operation: TransactionOperationEntity

    @Column({ name: "created_at" })
    createdAt: string;

    @Column({ name: "updated_at" })
    updatedAt: string;

    @Column({ name: "deleted_at", nullable: true })
    deletedAt?: string;
}
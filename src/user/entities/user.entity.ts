import { WalletEntity } from "../../wallet/entities/wallet.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserStatusEntity {
    ACTIVE = 0,
    BLOCKED = 1,
    WAIT_CONFIRM = 2,
}

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'email' })
    email: string

    @Column({ name: 'password' })
    password: string

    @Column({ name: 'nickname', unique: true })
    nickname: string

    @OneToMany(
        (_) => WalletEntity, 
        (wallet) => wallet.user
    )
    wallets: WalletEntity[]

    @Column({
        type: "enum",
        enum: UserStatusEntity,
        default: UserStatusEntity.ACTIVE
    })
    status: UserStatusEntity

    @Column({ name: 'code' })
    code: string;

    @Column({ name: "created_at" })
    createdAt: string;

    @Column({ name: "updated_at" })
    updatedAt: string;

    @Column({ name: "deleted_at", nullable: true })
    deletedAt?: string;
}
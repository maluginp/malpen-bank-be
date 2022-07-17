import { UserEntity } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum WalletStatusEntity {
    ACTIVE = 0,
    BLOCKED = 1,
}


@Entity("wallets")
export class WalletEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @ManyToOne(
        (_) => UserEntity,
        (user) => user.wallets,
    )
    @JoinColumn({
        name: "user_id"
    })
    user: UserEntity


    @Column({
        name: "address",
    })
    address: string

    @Column({
        name: "private_key",
    })
    //base64
    privateKey: string

    @Column({
        type: "enum",
        enum: WalletStatusEntity,
        default: WalletStatusEntity.ACTIVE
    })
    status: WalletStatusEntity

    @Column({
        name: 'is_default'
    })
    isDefault: boolean

    @Column({ name: "created_at" })
    createdAt: string;

    @Column({ name: "updated_at" })
    updatedAt: string;

    @Column({ name: "deleted_at", nullable: true })
    deletedAt?: string;
}
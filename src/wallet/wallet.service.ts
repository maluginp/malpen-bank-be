import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager'
import { InjectRepository } from '@nestjs/typeorm';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import { DeepPartial, Not, Like, Repository } from 'typeorm';
import { WalletEntity, WalletStatusEntity } from './entities/wallet.entity';
import { IWallet, IBalancedWallet, IUpdateWallet, IFoundWalletWithNickname } from './types/wallet.type';
import * as base64 from "byte-base64";
import { Token, UserID } from '../token/types/token.type';


const MAX_NUMBER_WALLETS = 5

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(WalletEntity)
        private repository: Repository<WalletEntity>,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache
    ) { }

    connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    async create(userId: UserID): Promise<IWallet> {
        const numberWallets = await this.repository.count({
            where: {
                user: {
                    id: userId.unwrap()
                }
            }
        })

        if (numberWallets >= MAX_NUMBER_WALLETS) {
            throw new Error(`Limit in ${MAX_NUMBER_WALLETS} is over`)
        }


        let keyPair = Keypair.generate();

        const publicKey = keyPair.publicKey.toBase58()
        const pkInBase64 = base64.bytesToBase64(keyPair.secretKey)
        let name = 'Дополнительный'
        if (numberWallets == 0) {
            name = 'Основной'
        }
        const isDefault = (numberWallets == 0)

        const entity = await this.repository.save<DeepPartial<WalletEntity>>({
            name,
            user: {
                id: userId.unwrap()
            },
            address: publicKey,
            privateKey: pkInBase64,
            status: WalletStatusEntity.ACTIVE,
            isDefault
        })

        console.log(`New wallet is created with PK: ${publicKey}`)

        const txId = await this.connection.requestAirdrop(
            keyPair.publicKey, LAMPORTS_PER_SOL
        );
        console.log(`Transaction Airdrop = ${txId}`)

        return {
            ...entity
        }
    }

    async allByUser(userId: UserID): Promise<IBalancedWallet[]> {
        const entities = await this.repository.find({
            where: {
                user: {
                    id: userId.unwrap()
                }
            }
        })

        const wallets = entities.map(e => ({ ...e }))

        return Promise.all(
            wallets.map(async (wallet) => {
                const balance = await this.getBalance(wallet.address);
                return {
                    ...wallet,
                    balance
                }
            })
        )
    }

    async getById(userId: UserID, id: number): Promise<IBalancedWallet> {
        const entity = await this.repository.findOne({
            where: {
                id: id,
                user: {
                    id: userId.unwrap()
                }
            }
        })

        const balance = await this.getBalance(entity.address);

        return {
            ...entity,
            balance
        }
    }

    async getBalance(publicKey: string): Promise<number> {
        const cacheKey = this.cacheBalancePk(publicKey)
        const cachedBalance = await this.cacheManager.get<number>(cacheKey)

        if (cachedBalance == null) {
            const pk = new PublicKey(publicKey)

            const balance = await this.connection.getBalance(pk)
            this.cacheManager.set(cacheKey, balance)
            return balance
        }

        return cachedBalance;
    }

    async sendInternal(
        userId: number,
        fromWallet: string,
        toWallet: string,
        amount: number,
    ): Promise<string> {

        const fromEntity = await this.repository.findOne({
            where: {
                user: {
                    id: userId
                },
                address: fromWallet
            }
        })

        const skFrom = base64.base64ToBytes(fromEntity.privateKey)
        const fromKeyPair = Keypair.fromSecretKey(skFrom)

        const toEntity = await this.repository.findOne({
            where: {
                user: {
                    id: userId
                },
                address: toWallet
            }
        })

        const skTo = base64.base64ToBytes(toEntity.privateKey)
        const toKeyPair = Keypair.fromSecretKey(skTo)

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeyPair.publicKey,
                toPubkey: toKeyPair.publicKey,
                lamports: amount,
            }),
        );

        // Sign transaction, broadcast, and confirm
        const signed = await sendAndConfirmTransaction(
            this.connection,
            transaction,
            [fromKeyPair],
        )

        await this.cacheManager.del(this.cacheBalancePk(fromWallet))
        await this.cacheManager.del(this.cacheBalancePk(toWallet))

        return signed
    }

    async sendExternal(
        userId: number,
        fromWallet: string,
        toWallet: string,
        amount: number,
    ): Promise<string> {

        const fromEntity = await this.repository.findOne({
            where: {
                user: {
                    id: userId
                },
                address: fromWallet
            }
        })

        const skFrom = base64.base64ToBytes(fromEntity.privateKey)
        const fromKeyPair = Keypair.fromSecretKey(skFrom)

        const toEntity = await this.repository.findOne({
            where: {
                address: toWallet
            }
        })

        const skTo = base64.base64ToBytes(toEntity.privateKey)
        const toKeyPair = Keypair.fromSecretKey(skTo)

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeyPair.publicKey,
                toPubkey: toKeyPair.publicKey,
                lamports: amount,
            }),
        );

        // Sign transaction, broadcast, and confirm
        const signed = await sendAndConfirmTransaction(
            this.connection,
            transaction,
            [fromKeyPair],
        )

        await this.cacheManager.del(this.cacheBalancePk(fromWallet))
        await this.cacheManager.del(this.cacheBalancePk(toWallet))

        return signed
    }

    async update(id: number, userId: UserID, wallet: Partial<IUpdateWallet>): Promise<IWallet> {
        const entity = await this.repository.update({
            user: {
                id: userId.unwrap(),
            },
            id: id
        }, wallet)

      
        return this.getById(userId, id)
    }

    async findByNickname(
        userId: UserID, 
        nickname: string, 
        take: number, 
        skip: number
    ): Promise<IFoundWalletWithNickname[]> {
        console.log(`Searching wallets for nickname: ${nickname}`)

        const entities = await this.repository.find({
            where: {
                user: {
                    id: Not(userId.unwrap()),
                    nickname: Like(`%${nickname}%`)
                },
                isDefault: true
            },
            relations: ["user"],
            take,
            skip
        })

        return entities.map(e => ({
            userId: e.user.id,
            userNickname: e.user.nickname,
            walletName: e.name,
            walletAddress: e.address
        }))
    }

    private cacheBalancePk(publicKey: string): string {
        return `wallet_balance_${publicKey}`
    }
}

import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';

import { TokenService } from '../token/token.service';
import { Token } from '../token/types/token.type';
import { IBalancedWallet, IWallet, SolanaWallet } from './types/wallet.type';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {

    constructor(
        private walletService: WalletService,
        private tokenService: TokenService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@ReqToken() token: Token): Promise<IWallet> {
        return this.walletService.create(token.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async all(@ReqToken() token: Token): Promise<IWallet[]> {
        return this.walletService.allByUser(token.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getById(@ReqToken() token: Token, @Param("id") id: number): Promise<IBalancedWallet> {
        return this.walletService.getById(token.id, id)
    }
}

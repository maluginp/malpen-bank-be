import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';

import { TokenService } from '../token/token.service';
import { Token } from '../token/types/token.type';
import { WalletResponseDto } from './dtos/wallet.dto';
import { IBalancedWallet, IWallet } from './types/wallet.type';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {

    constructor(
        private walletService: WalletService,
        private tokenService: TokenService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@ReqToken() token: Token): Promise<WalletResponseDto> {
        const model = await this.walletService.create(token.id)

        return this.mapTypeToDto(model, null)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async all(@ReqToken() token: Token): Promise<WalletResponseDto[]> {
        const models = await this.walletService.allByUser(token.id)

        return models.map(m => this.mapTypeToDto(m, null))
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    @ApiBearerAuth()
    @ApiResponse({
        type: WalletResponseDto
    })
    async getById(@ReqToken() token: Token, @Param("id") id: number): Promise<WalletResponseDto> {
        const model = await this.walletService.getById(token.id, id)
        return this.mapTypeToDto(model, model.balance)
    }

    private mapTypeToDto(type: IWallet, balance: number | null): WalletResponseDto {
        return {
            id: type.id,
            name: type.name,
            address: type.address,
            balance
        }  
    }
}

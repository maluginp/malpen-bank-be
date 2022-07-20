import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';
import { Token } from '../token/types/token.type';
import { UpdateWalletRequestDto, WalletResponseDto } from './dtos/wallet.dto';
import { IWallet } from './types/wallet.type';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {

    constructor(
        private walletService: WalletService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@ReqToken() token: Token): Promise<WalletResponseDto> {
        const model = await this.walletService.create(token.userId)

        return this.mapTypeToDto(model, null)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async all(@ReqToken() token: Token): Promise<WalletResponseDto[]> {
        console.log(`Token = `, token.userId)

        const models = await this.walletService.allByUser(token.userId)

        return models.map(m => this.mapTypeToDto(m, null))
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    @ApiBearerAuth()
    @ApiResponse({
        type: WalletResponseDto
    })
    async getById(@ReqToken() token: Token, @Param("id") id: number): Promise<WalletResponseDto> {
        const model = await this.walletService.getById(token.userId, id)
        return this.mapTypeToDto(model, model.balance)
    }

    @ApiOperation({
        description: 'Обновление деталей кошелька',
    })
    @ApiBearerAuth()
    @ApiResponse({ type: WalletResponseDto })
    @ApiBody({ type: UpdateWalletRequestDto })
    @UseGuards(JwtAuthGuard)
    @Post(":id")
    async updateById(
        @ReqToken() token: Token, 
        @Param("id") id: number, 
        @Body() body: UpdateWalletRequestDto
    ): Promise<WalletResponseDto> {
        //NOTE: Поддерживается только обновление имени
        const model = await this.walletService.update(id, token.userId, body)
        return this.mapTypeToDto(model, null)
    }

    private mapTypeToDto(type: IWallet, balance: number | null): WalletResponseDto {
        return {
            id: type.id,
            name: type.name,
            address: type.address,
            balance,
            isDefault: type.isDefault,
        }  
    }
}

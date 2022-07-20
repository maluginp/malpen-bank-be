import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';
import { Token } from '../token/types/token.type';
import { TransactionResponseDto } from '../transaction/dtos/transaction.dto';
import { TransferService } from './transfer.service';
import { TransferFundRequestDto } from './types/transfer-fund.dto';

@Controller('transfer')
export class TransferController {
    constructor(
        private transferService: TransferService
    ) {

    }

    @UseGuards(JwtAuthGuard)
    @Post("internal")
    async transferInternal(@Body() body: TransferFundRequestDto, @ReqToken() token: Token): Promise<TransactionResponseDto> {   
        return this.transferService.transferInternal(
            token.userId, 
            body.from,
            body.to,
            body.amount
        )
    }

    @UseGuards(JwtAuthGuard)
    @Post("external")
    async transferExternal(@Body() body: TransferFundRequestDto, @ReqToken() token: Token): Promise<TransactionResponseDto> {   
        return this.transferService.transferExternal(
            token.userId, 
            body.from,
            body.to,
            body.amount
        )
    }
}

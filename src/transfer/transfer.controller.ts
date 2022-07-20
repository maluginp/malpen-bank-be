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
    @Post()
    async transfer(@Body() body: TransferFundRequestDto, @ReqToken() token: Token): Promise<TransactionResponseDto> {   
        return this.transferService.transfer(
            token.userId, 
            body.from,
            body.to,
            body.amount
        )
    }
}

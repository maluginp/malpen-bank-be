import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';
import { Token } from '../token/types/token.type';
import { ITransaction } from '../transaction/types/transaction.type';
import { TransferService } from './transfer.service';
import { TransferFundRequestDto, TransferFundResponseDto } from './types/transfer-fund.dto';

@Controller('transfer')
export class TransferController {
    constructor(
        private transferService: TransferService
    ) {

    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async transfer(@Body() body: TransferFundRequestDto, @ReqToken() token: Token): Promise<ITransaction> {   
        return this.transferService.transfer(
            token.id, 
            body.from,
            body.to,
            body.amount
        )
    }
}

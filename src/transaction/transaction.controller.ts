import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';
import { Token } from '../token/types/token.type';
import { TransactionResponseDto } from './dtos/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
    constructor(
        private transactionService: TransactionService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@ReqToken() token: Token): Promise<TransactionResponseDto[]> {
        return this.transactionService.allByUserID(token.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getById(@Param("id") id: number): Promise<TransactionResponseDto> {
        return this.transactionService.getById(id)
    }
}

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt.guard';
import { ReqToken } from '../token/token.decorator';
import { Token } from '../token/types/token.type';
import { TransactionService } from './transaction.service';
import { ITransaction } from './types/transaction.type';

@Controller('transactions')
export class TransactionController {
    constructor(
        private transactionService: TransactionService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@ReqToken() token: Token): Promise<ITransaction[]> {
        return this.transactionService.allByUserID(token.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getById(@Param("id") id: number): Promise<ITransaction> {
        return this.transactionService.getById(id)
    }
}

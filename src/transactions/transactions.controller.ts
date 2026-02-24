import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { TransactionsService } from './transactions.service';
import { TransactionsQueryDto } from './dto/transactions-query.dto';

type RequestWithUserId = Request & {
  userId: string;
};

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Req() req: RequestWithUserId, @Query() query: TransactionsQueryDto) {
    return this.transactionsService.findAll(req.userId, query);
  }
}

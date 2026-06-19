import { Controller, Get, Post, Body, Put, Param, Delete, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';

type RequestWithUserId = Request & {
  userId: string;
};

@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  create(
    @Req() req: RequestWithUserId,
    @Body() createCreditCardDto: CreateCreditCardDto
  ) {
    return this.creditCardsService.create(createCreditCardDto, req.userId);
  }

  @Get()
  findAll(
    @Req() req: RequestWithUserId,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    if (page != null && pageSize != null) {
      return this.creditCardsService.findPage(req.userId, Number(page), Number(pageSize));
    }
    return this.creditCardsService.findAll(req.userId);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUserId, @Param('id') id: string) {
    return this.creditCardsService.findOne(id, req.userId);
  }

  @Put(':id')
  update(
    @Req() req: RequestWithUserId,
    @Param('id') id: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto
  ) {
    return this.creditCardsService.update(id, updateCreditCardDto, req.userId);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUserId, @Param('id') id: string) {
    return this.creditCardsService.remove(id, req.userId);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { ExpenseCategoryIdsDto } from './dto/expense-category-ids.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

type RequestWithUserId = Request & {
  userId: string;
};

function parseTransactionId(id: string): bigint {
  try {
    return BigInt(id);
  } catch {
    throw new BadRequestException('Invalid expense id.');
  }
}

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(
    @Req() req: RequestWithUserId,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(createExpenseDto, req.userId);
  }

  @Get()
  async findAll(
    @Req() req: RequestWithUserId,
    @Query() query: PaginationQueryDto,
  ) {
    const { page, pageSize } = query;
    if (page == null && pageSize == null) {
      return this.expensesService.findAll(req.userId);
    }
    const pageNum = page ?? 1;
    const sizeNum = pageSize ?? 10;
    return this.expensesService.findPage(req.userId, pageNum, sizeNum);
  }

  @Get('stats/amount')
  getAmount(@Req() req: RequestWithUserId) {
    return this.expensesService.getAmount(req.userId);
  }

  @Get('stats/category-ids')
  getCategoryIds(@Req() req: RequestWithUserId) {
    return this.expensesService.getCategoryIds(req.userId);
  }

  @Get('stats/amount-by-category/:categoryId')
  getAmountByCategoryId(
    @Req() req: RequestWithUserId,
    @Param('categoryId') categoryId: string,
  ) {
    return this.expensesService.getAmountByCategoryId(req.userId, categoryId);
  }

  @Post('stats/amount-by-categories')
  getAmountByCategoriesIds(
    @Req() req: RequestWithUserId,
    @Body() body: ExpenseCategoryIdsDto,
  ) {
    return this.expensesService.getAmountByCategoriesIds(req.userId, body.categoryIds);
  }

  @Get('stats/amount-by-subcategory/:subcategoryId')
  getAmountBySubcategoryId(
    @Req() req: RequestWithUserId,
    @Param('subcategoryId') subcategoryId: string,
  ) {
    return this.expensesService.getAmountBySubcategoryId(req.userId, subcategoryId);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithUserId, @Param('id') id: string) {
    return this.expensesService.findOne(parseTransactionId(id), req.userId);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUserId,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(
      parseTransactionId(id),
      updateExpenseDto,
      req.userId,
    );
  }

  @Patch(':id/category')
  updateCategory(
    @Req() req: RequestWithUserId,
    @Param('id') id: string,
    @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto,
  ) {
    return this.expensesService.updateCategory(
      parseTransactionId(id),
      updateExpenseCategoryDto,
      req.userId,
    );
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUserId, @Param('id') id: string) {
    return this.expensesService.remove(parseTransactionId(id), req.userId);
  }
}

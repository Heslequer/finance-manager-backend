import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { TransactionsQueryDto } from './dto/transactions-query.dto';

export type TransactionItem = {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  date: string | null;
  description: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  categories: Record<string, unknown> | null;
  subcategories: Record<string, unknown> | null;
};

function toSerializableId<T extends { id?: bigint }>(row: T): Omit<T, 'id'> & { id: string } {
  if (row == null) return row;
  return { ...row, id: String(row.id) };
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: TransactionsQueryDto): Promise<{ data: TransactionItem[]; total: number }> {
    const { page = 1, pageSize = 10, type, dateFrom, dateTo, categoryId } = query;

    const baseDateFilter: { gte?: string; lte?: string } = {};
    if (dateFrom != null && dateFrom !== '') baseDateFilter.gte = dateFrom;
    if (dateTo != null && dateTo !== '') baseDateFilter.lte = dateTo;

    const expenseWhere = {
      user_id: userId,
      ...(categoryId != null && categoryId !== '' ? { category_id: categoryId } : {}),
      ...(Object.keys(baseDateFilter).length > 0 ? { date: baseDateFilter } : {}),
    };

    const incomeWhere = {
      user_id: userId,
      ...(categoryId != null && categoryId !== '' ? { category_id: categoryId } : {}),
      ...(Object.keys(baseDateFilter).length > 0 ? { date: baseDateFilter } : {}),
    };

    const [expenseRows, incomeRows] = await Promise.all([
      type === 'income'
        ? []
        : this.prisma.expenses.findMany({
            where: expenseWhere,
            orderBy: { date: 'desc' },
            include: { categories: true, subcategories: true },
          }),
      type === 'expense'
        ? []
        : this.prisma.incomes.findMany({
            where: incomeWhere,
            orderBy: { date: 'desc' },
            include: { categories: true, subcategories: true },
          }),
    ]);

    const expenseItems: TransactionItem[] = expenseRows.map((row) => {
      const serialized = toSerializableId(row);
      return {
        id: serialized.id,
        type: 'expense' as const,
        amount: Number(row.amount ?? 0),
        date: row.date,
        description: row.description,
        category_id: row.category_id,
        subcategory_id: row.subcategory_id,
        categories: row.categories ? (row.categories as Record<string, unknown>) : null,
        subcategories: row.subcategories ? (row.subcategories as Record<string, unknown>) : null,
      };
    });

    const incomeItems: TransactionItem[] = incomeRows.map((row) => {
      const serialized = toSerializableId(row);
      return {
        id: serialized.id,
        type: 'income' as const,
        amount: Number(row.amount ?? 0),
        date: row.date,
        description: row.description,
        category_id: row.category_id,
        subcategory_id: row.subcategory_id,
        categories: row.categories ? (row.categories as Record<string, unknown>) : null,
        subcategories: row.subcategories ? (row.subcategories as Record<string, unknown>) : null,
      };
    });

    const merged = [...expenseItems, ...incomeItems].sort((a, b) => {
      const dateA = a.date ?? '';
      const dateB = b.date ?? '';
      return dateB.localeCompare(dateA);
    });

    const total = merged.length;
    const skip = (page - 1) * pageSize;
    const take = Math.min(pageSize, 100);
    const data = merged.slice(skip, skip + take);

    return { data, total };
  }
}

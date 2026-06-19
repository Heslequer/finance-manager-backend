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
  credit_card_id: string | null;
  installment_number: number | null;
  total_installments: number | null;
  created_at: Date;
};

function toSerializableId<T extends { id?: bigint }>(row: T): Omit<T, 'id'> & { id: string } {
  if (row == null) return row;
  return { ...row, id: String(row.id) };
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: TransactionsQueryDto): Promise<{ data: TransactionItem[]; total: number }> {
    const { page = 1, pageSize = 10, type, dateFrom, dateTo, categoryId, creditCardId, search } = query;

    const categoryIds =
      categoryId != null && categoryId !== ''
        ? [...new Set(categoryId.split(',').map((s) => s.trim()).filter((s) => s.length > 0))]
        : [];
    const categoryWhere =
      categoryIds.length === 0
        ? {}
        : categoryIds.length === 1
          ? { category_id: categoryIds[0] }
          : { category_id: { in: categoryIds } };

    const baseDateFilter: { gte?: string; lte?: string } = {};
    if (dateFrom != null && dateFrom !== '') baseDateFilter.gte = dateFrom;
    if (dateTo != null && dateTo !== '') baseDateFilter.lte = dateTo;

    const creditCardWhere =
      creditCardId === 'all'
        ? { credit_card_id: { not: null } }
        : creditCardId != null && creditCardId !== ''
          ? { credit_card_id: creditCardId }
          : {};

    const expenseWhere = {
      user_id: userId,
      ...categoryWhere,
      ...creditCardWhere,
      ...(Object.keys(baseDateFilter).length > 0 ? { date: baseDateFilter } : {}),
    };

    const incomeWhere = {
      user_id: userId,
      ...categoryWhere,
      ...creditCardWhere,
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
        credit_card_id: row.credit_card_id,
        installment_number: row.installment_number,
        total_installments: row.total_installments,
        created_at: row.created_at,
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
        credit_card_id: row.credit_card_id,
        installment_number: null,
        total_installments: null,
        created_at: row.created_at,
      };
    });

    const merged = [...expenseItems, ...incomeItems].sort((a, b) => {
      const dateA = a.date ?? '';
      const dateB = b.date ?? '';
      const dateCompare = dateB.localeCompare(dateA);
      if (dateCompare !== 0) return dateCompare;

      const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return createdB - createdA;
    });

    let filtered = merged;
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtered = merged.filter((item) => {
        const descMatch = item.description?.toLowerCase().includes(searchLower);
        const catName =
          item.categories && typeof item.categories === 'object' && 'name' in item.categories && typeof item.categories.name === 'string'
            ? item.categories.name.toLowerCase()
            : '';
        const catMatch = catName.includes(searchLower);
        return descMatch || catMatch;
      });
    }

    const total = filtered.length;
    const skip = (page - 1) * pageSize;
    const take = Math.min(pageSize, 100);
    const data = filtered.slice(skip, skip + take);

    return { data, total };
  }
}

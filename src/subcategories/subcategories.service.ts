import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoriesRepository } from './subcategories.repository';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly subcategoriesRepository: SubcategoriesRepository) {}

  create(createSubcategoryDto: CreateSubcategoryDto, userId: string) {
    return this.subcategoriesRepository.create(createSubcategoryDto, userId);
  }

  findAll(userId: string) {
    return this.subcategoriesRepository.findAllByUserId(userId);
  }

  findOne(id: string, userId: string) {
    return this.subcategoriesRepository.findOneByUserId(id, userId);
  }

  findByCategoryId(categoryId: string, userId: string) {
    return this.subcategoriesRepository.findByCategoryId(categoryId, userId);
  }

  findByCategoryIds(categoryIds: string[], userId: string) {
    return this.subcategoriesRepository.getSubcategoriesByCategoryIds(categoryIds, userId);
  }

  getSubcategoryIdByName(name: string, userId: string) {
    return this.subcategoriesRepository.getSubcategoryIdByName(name, userId);
  }

  getCategoryIdBySubcategoryName(name: string, userId: string) {
    return this.subcategoriesRepository.getCategoryIdBySubcategoryName(name, userId);
  }

  getAmountByCategoryId(categoryId: string, userId: string) {
    return this.subcategoriesRepository.getAmountByCategoryId(categoryId, userId);
  }

  update(id: string, updateSubcategoryDto: UpdateSubcategoryDto, userId: string) {
    return this.subcategoriesRepository.updateByUserId(id, updateSubcategoryDto, userId);
  }

  private isPrismaForeignKeyViolation(e: unknown): boolean {
    return typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2003';
  }

  async remove(id: string, userId: string) {
    const linked = await this.subcategoriesRepository.countLinkedExpensesOrIncomes(id, userId);
    if (linked > 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          code: 'SUBCATEGORY_HAS_LINKED_TRANSACTIONS',
          message: `This subcategory cannot be deleted because there are ${linked} ${linked === 1 ? 'transaction' : 'transactions'} linked to it`,
        },
        HttpStatus.CONFLICT,
      );
    }

    try {
      return await this.subcategoriesRepository.removeByUserId(id, userId);
    } catch (error) {
      throw error;
    }
  }
}

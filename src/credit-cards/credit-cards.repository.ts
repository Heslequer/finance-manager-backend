import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCreditCardDto } from "./dto/create-credit-card.dto";
import { UpdateCreditCardDto } from "./dto/update-credit-card.dto";

@Injectable()
export class CreditCardsRepository{
  constructor(private readonly prisma: PrismaService) {}

  async create(createCreditCardDto: CreateCreditCardDto, userId: string){
    return this.prisma.credit_cards.create({
      data: { ...createCreditCardDto, user_id: userId}
    })
  }

  async findAllByUserId(userId: string) {
    return this.prisma.credit_cards.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findPageByUserId(userId: string, page: number, pageSize: number) {
    const skip = Math.max(0, (page - 1) * pageSize);
    const take = Math.max(1, pageSize);
    const [data, total] = await Promise.all([
      this.prisma.credit_cards.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.credit_cards.count({
        where: { user_id: userId },
      }),
    ]);
    return { data, total };
  }

  async findOneByUserId(id: string, userId: string) {
    return this.prisma.credit_cards.findFirst({
      where: { id, user_id: userId },
    });
  }

  async updateByUserId(id: string, updateCreditCardDto: UpdateCreditCardDto, userId: string) {
    await this.prisma.credit_cards.updateMany({
      where: { id, user_id: userId },
      data: updateCreditCardDto,
    });
    return this.findOneByUserId(id, userId);
  }

  async removeByUserId(id: string, userId: string) {
    const result = await this.prisma.credit_cards.deleteMany({
      where: { id, user_id: userId },
    });
    return result.count > 0;
  }
}  

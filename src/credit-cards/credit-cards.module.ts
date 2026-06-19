import { Module } from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsRepository } from './credit-cards.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CreditCardsController],
  providers: [CreditCardsService, CreditCardsRepository, PrismaService],
})
export class CreditCardsModule {}

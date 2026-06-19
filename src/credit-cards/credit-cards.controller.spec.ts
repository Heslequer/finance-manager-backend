import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsRepository } from './credit-cards.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('CreditCardsController', () => {
  let controller: CreditCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditCardsController],
      providers: [CreditCardsService, CreditCardsRepository, PrismaService],
    }).compile();

    controller = module.get<CreditCardsController>(CreditCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

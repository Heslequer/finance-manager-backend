import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsRepository } from './credit-cards.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('CreditCardsService', () => {
  let service: CreditCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditCardsService, CreditCardsRepository, PrismaService],
    }).compile();

    service = module.get<CreditCardsService>(CreditCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

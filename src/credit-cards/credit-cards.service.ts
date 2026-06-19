import { Injectable } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CreditCardsRepository } from './credit-cards.repository';

@Injectable()
export class CreditCardsService {

  constructor(private readonly creditCardsRepository: CreditCardsRepository) {}
  create(createCreditCardDto: CreateCreditCardDto, userId: string) {
    return this.creditCardsRepository.create(createCreditCardDto, userId);
  }

  findAll(userId: string) {
    return this.creditCardsRepository.findAllByUserId(userId);
  }

  findPage(userId: string, page: number, pageSize: number) {
    return this.creditCardsRepository.findPageByUserId(userId, page, pageSize);
  }

  findOne(id: string, userId: string) {
    return this.creditCardsRepository.findOneByUserId(id, userId);
  }

  update(id: string, updateCreditCardDto: UpdateCreditCardDto, userId: string) {
    return this.creditCardsRepository.updateByUserId(id, updateCreditCardDto, userId);
  }

  remove(id: string, userId: string) {
    return this.creditCardsRepository.removeByUserId(id, userId);
  }
}

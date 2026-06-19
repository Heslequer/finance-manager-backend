export class CreditCard {
  id: string;
  user_id: string;
  card_active: boolean;
  card_name: string;
  bank_name: string;
  card_gradient: string;
  card_digits: string;
  valid_thru: string;
  credit_limit: number;
  closing_day: number;
  due_day: number;
  notes?: string;
  current_balance: number;
  created_at: Date;
  updated_at: Date;
}

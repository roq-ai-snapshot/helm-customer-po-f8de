import { UserInterface } from 'interfaces/user';

export interface MarketTrendInterface {
  id?: string;
  company_id: string;
  user_id: string;
  trend_date: Date;
  trend_data: string;
  created_at?: Date;
  updated_at?: Date;

  user?: UserInterface;
  _count?: {};
}

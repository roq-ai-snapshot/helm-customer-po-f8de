import { OrderInterface } from 'interfaces/order';
import { UserInterface } from 'interfaces/user';

export interface ContractInterface {
  id?: string;
  company_id: string;
  user_id: string;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
  updated_at?: Date;
  order?: OrderInterface[];
  user?: UserInterface;
  _count?: {
    order?: number;
  };
}

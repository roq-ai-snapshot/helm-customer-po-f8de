import { DeliveryInterface } from 'interfaces/delivery';
import { ContractInterface } from 'interfaces/contract';
import { UserInterface } from 'interfaces/user';

export interface OrderInterface {
  id?: string;
  contract_id: string;
  user_id: string;
  order_date: Date;
  status: string;
  created_at?: Date;
  updated_at?: Date;
  delivery?: DeliveryInterface[];
  contract?: ContractInterface;
  user?: UserInterface;
  _count?: {
    delivery?: number;
  };
}

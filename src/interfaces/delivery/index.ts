import { OrderInterface } from 'interfaces/order';
import { UserInterface } from 'interfaces/user';

export interface DeliveryInterface {
  id?: string;
  order_id: string;
  user_id: string;
  delivery_date: Date;
  status: string;
  created_at?: Date;
  updated_at?: Date;

  order?: OrderInterface;
  user?: UserInterface;
  _count?: {};
}

import { UserInterface } from 'interfaces/user';

export interface OrganizationInterface {
  id?: string;
  name: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;

  user?: UserInterface;
  _count?: {};
}

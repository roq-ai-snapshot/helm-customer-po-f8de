import * as yup from 'yup';
import { orderValidationSchema } from 'validationSchema/orders';

export const contractValidationSchema = yup.object().shape({
  company_id: yup.string().required(),
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  user_id: yup.string().nullable().required(),
  order: yup.array().of(orderValidationSchema),
});

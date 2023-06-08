import * as yup from 'yup';
import { deliveryValidationSchema } from 'validationSchema/deliveries';

export const orderValidationSchema = yup.object().shape({
  order_date: yup.date().required(),
  status: yup.string().required(),
  contract_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
  delivery: yup.array().of(deliveryValidationSchema),
});

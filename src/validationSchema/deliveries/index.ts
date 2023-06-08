import * as yup from 'yup';

export const deliveryValidationSchema = yup.object().shape({
  delivery_date: yup.date().required(),
  status: yup.string().required(),
  order_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});

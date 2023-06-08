import * as yup from 'yup';

export const marketTrendValidationSchema = yup.object().shape({
  company_id: yup.string().required(),
  trend_date: yup.date().required(),
  trend_data: yup.string().required(),
  user_id: yup.string().nullable().required(),
});

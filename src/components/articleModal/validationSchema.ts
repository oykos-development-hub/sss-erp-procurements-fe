import * as yup from 'yup';
import {dropdownDataNumberSchema, numberRequiredSchema, stringRequiredSchema} from '../../screens/validationSchema';

export const articleModalConfirmationSchema = yup.object().shape({
  title: stringRequiredSchema,
  description: stringRequiredSchema,
  net_price: stringRequiredSchema,
  vat_percentage: dropdownDataNumberSchema,
  total_price: yup.string().optional(),
  amount: yup.number().optional(),
});

import * as yup from 'yup';
import {
  dropdownDataNumberSchema,
  dropdownDataBooleanSchema,
  stringRequiredSchema,
} from '../../screens/validationSchema';

export const articleModalConfirmationSchema = yup.object().shape({
  budget_indent: dropdownDataNumberSchema,
  title: stringRequiredSchema,
  description: stringRequiredSchema,
  net_price: stringRequiredSchema,
  vat_percentage: dropdownDataNumberSchema,
  total_price: yup.string().optional(),
});

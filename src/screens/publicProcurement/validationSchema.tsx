import * as yup from 'yup';
import {dropdownDataNumberSchema, dropdownDataBooleanSchema} from '../validationSchema';

export const planModalConfirmationSchema = yup.object().shape({
  year: dropdownDataNumberSchema,
  is_pre_budget: dropdownDataBooleanSchema.notRequired(),
  pre_budget_id: dropdownDataNumberSchema.notRequired(),
});

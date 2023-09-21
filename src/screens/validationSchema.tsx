import * as yup from 'yup';

export const dropdownDataNumberSchema = yup
  .object({
    id: yup.number().required(),
    title: yup.string().required(),
  })
  .required('Ovo polje je obavezno')
  .default(undefined);

export const dropdownDataBooleanSchema = yup
  .object({
    id: yup.bool().required(),
    title: yup.string().required(),
  })
  .required('Ovo polje je obavezno')
  .default(undefined);

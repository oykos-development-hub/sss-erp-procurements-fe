import * as yup from 'yup';

export const dropdownNumberSchema = {id: yup.number().required(), title: yup.string().required()};
export const requiredError = 'Ovo polje je obavezno';

export const dropdownDataNumberSchema = yup
  .object({
    id: yup.number().required(),
    title: yup.string().required(),
  })
  .required(requiredError)
  .default(undefined);

export const dropdownDataStringSchema = yup
  .object({
    id: yup.string().required(),
    title: yup.string().required(),
  })
  .required(requiredError)
  .default(undefined);

export const dropdownDataBooleanSchema = yup
  .object({
    id: yup.bool().required(),
    title: yup.string().required(),
  })
  .required(requiredError)
  .default(undefined);

export const stringRequiredSchema = yup.string().required('Ovo polje je obavezno').default(undefined);

export const numberRequiredSchema = yup
  .number()
  .required('Ovo polje je obavezno')
  .typeError('Morate unijeti broj')
  .default(undefined);

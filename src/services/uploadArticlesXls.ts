import {backendFileUrl} from '../constants';
import {UploadBatchArticlesResponse} from '../types/files';

export const uploadArticlesXls = async (
  file: File,
  procurementId: number,
): Promise<UploadBatchArticlesResponse['data']> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('public_procurement_id', procurementId.toString());

  const response = await fetch(`${backendFileUrl}/read-articles`, {
    method: 'POST',
    body: formData,
  });

  const responseData = await response.json();

  return responseData.data;
};

export const uploadContractArticlesXls = async (
  file: File,
  procurementId: number,
  contractId: number,
): Promise<UploadBatchArticlesResponse['data']> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('public_procurement_id', procurementId.toString());
  formData.append('contract_id', contractId.toString());

  const response = await fetch('https://sss-erp-procurements-be.oykos.me/api/read-template-articles', {
    method: 'POST',
    body: formData,
  });

  console.log(response);

  const responseData = await response.json();

  return responseData.data;
};

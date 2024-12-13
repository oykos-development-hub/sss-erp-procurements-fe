import {UploadBatchArticlesResponse} from '../types/files';

export const uploadArticlesXls = async (
  file: File,
  procurementId: number,
  token: string,
  simple?: boolean,
): Promise<UploadBatchArticlesResponse['data']> => {
  console.log(token, 'token');
  const url = simple
    ? `${import.meta.env.VITE_FILES_URL}/read-articles-simple-procurement`
    : `${import.meta.env.VITE_FILES_URL}/read-articles`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('public_procurement_id', procurementId.toString());

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers,
  });

  const responseData = await response.json();

  return responseData;
};

export const uploadContractArticlesXls = async (
  file: File,
  procurementId: number,
  contractId: number,
  token: string,
): Promise<UploadBatchArticlesResponse['data']> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('public_procurement_id', procurementId.toString());
  formData.append('contract_id', contractId.toString());

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${import.meta.env.VITE_FILES_URL}/read-template-articles`, {
    method: 'POST',
    body: formData,
    headers,
  });

  const responseData = await response.json();

  return responseData.data;
};

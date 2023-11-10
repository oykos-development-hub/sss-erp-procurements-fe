import {backendFileUrl} from '../constants';
import {UploadBatchArticlesResponse} from '../types/files';

const uploadArticlesXls = async (file: File, planId: number): Promise<UploadBatchArticlesResponse['data']> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('public_procurement_id', planId.toString());

  const response = await fetch(`${backendFileUrl}/read-articles`, {
    method: 'POST',
    body: formData,
  });

  const responseData = await response.json();

  return responseData.data;
};

export default uploadArticlesXls;

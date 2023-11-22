import {REQUEST_STATUSES} from '../services/constants';
import {PublicProcurementArticleParams} from './graphql/publicProcurementArticlesTypes';

export type FileResponseItem = {
  id: number;
  parent_id: number;
  name: string;
  description: string;
  size: number;
  type: string;
  created_at: string;
  updated_at: string;
};

export type UploadBatchArticlesResponse = {
  message: string;
  data: {
    data: any[];
    status: keyof typeof REQUEST_STATUSES;
  };
};

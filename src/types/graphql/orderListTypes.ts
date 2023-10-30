import {Response} from './utils';

export interface OrderListArticleType {
  id: number;
  title: string;
  description: string;
  manufacturer: string;
  unit: string;
  amount: number;
  total_price: number;
  available?: number;
}

export interface OrderProcurementAvailableArticlesType {
  orderProcurementAvailableList_Overview: Response<OrderListArticleType>;
}

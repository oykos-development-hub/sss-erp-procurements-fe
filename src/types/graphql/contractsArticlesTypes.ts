import {DropdownDataNumber} from '../dropdownData';
import {PublicProcurementArticle} from './publicProcurementArticlesTypes';
import {Response, SingularResponse} from './utils';

export interface ContractArticle {
  id: number;
  public_procurement_article: DropdownDataNumber;
  contract: DropdownDataNumber;
  amount: string;
  net_value: string;
  gross_value: string;
}

export interface ContractArticleGet {
  id?: number;
  public_procurement_article: PublicProcurementArticle;
  contract: DropdownDataNumber;
  amount?: number;
  net_value?: number;
  gross_value?: number;
}

export interface ContractArticleInsert {
  id?: number;
  public_procurement_article_id: number;
  public_procurement_contract_id: number;
  amount: number;
  net_value: number;
  gross_value: number;
}

export interface ContractArticlesInsertResponse {
  publicProcurementContractArticle_Insert: SingularResponse<ContractArticle>;
}

export interface ContractArticlesGetResponse {
  publicProcurementContractArticles_Overview: Response<ContractArticleGet>;
}

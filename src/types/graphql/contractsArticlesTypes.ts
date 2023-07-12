import {DropdownDataNumber} from '../dropdownData';

export interface ContractArticle {
  id: number;
  public_procurement_article: DropdownDataNumber;
  contract: DropdownDataNumber;
  amount: string;
  net_value: string;
  gross_value: string;
}

export interface ContractArticleGet {
  id: number;
  public_procurement_article: {id: number; title: string; vat_percentage: string; description: string};
  contract: DropdownDataNumber;
  amount: string;
  net_value: string;
  gross_value: string;
}

export interface ContractArticleInsert {
  id: number;
  public_procurement_article_id: number;
  public_procurement_contract_id: number;
  amount: string;
  net_value: string;
  gross_value: string;
}

export interface ContractArticlesInsertResponse {
  data: {
    publicProcurementContractArticle_Insert: {
      status?: string;
      message?: string;
      items?: ContractArticle[];
    };
  };
}

export interface ContractArticlesGetResponse {
  data: {
    publicProcurementContractArticles_Overview: {
      status?: string;
      message?: string;
      items?: ContractArticleGet[];
    };
  };
}

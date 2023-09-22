import {Response, SingularResponse} from './utils';

export interface ProcurementOrganizationUnitArticlesItem {
  id: number;
  amount: number;
  status: string;
  is_rejected: boolean;
  rejected_description: string;
  organization_unit: {
    id: number;
    title: string;
  };
  public_procurement_article: {
    id: number;
    title: string;
  };
}

export interface ProcurementOrganizationUnitArticlesInsertParams {
  id: number;
  public_procurement_article_id: number;
  organization_unit_id: number;
  amount: number;
  status: string;
  is_rejected: boolean;
  rejected_description: string;
}

export interface ProcurementOrganizationUnitArticlesInsertResponse {
  publicProcurementOrganizationUnitArticle_Insert: SingularResponse<ProcurementOrganizationUnitArticlesItem>;
}
export interface ProcurementOrganizationUnitArticlesResponse {
  data: {
    publicProcurementOrganizationUnitArticles_Overview: {
      status?: string;
      message?: string;
      items?: ProcurementOrganizationUnitArticlesItem[];
    };
  };
}

import {DropdownDataNumber} from '../dropdownData';
import {SingularResponse} from './utils';

export interface PublicProcurementArticleParams {
  id?: number;
  budget_indent_id: number;
  public_procurement_id: number;
  title: string;
  description: string;
  net_price: number;
  vat_percentage: string;
}

export interface PublicProcurementArticle {
  id: number;
  budget_indent: DropdownDataNumber;
  public_procurement: DropdownDataNumber;
  title: string;
  description: string;
  net_price: string;
  vat_percentage: string;
}

export interface PublicProcurementArticleWithAmount {
  id: number;
  amount: number;
  is_rejected: boolean;
  organization_unit: DropdownDataNumber;
  public_procurement_article: Pick<PublicProcurementArticle, 'id' | 'title' | 'net_price' | 'vat_percentage'>;
  rejected_description: string;
  status: string;
}

export interface OrganizationUnitArticle {
  id: number;
  title: string;
  net_price: string;
  vat_percentage: string;
}

export interface PublicProcurementArticleInsertResponse {
  publicProcurementPlanItemArticle_Insert: SingularResponse<PublicProcurementArticle>;
}

export interface PublicProcurementArticleDeleteResponse {
  publicProcurementPlanItemArticle_Delete: SingularResponse<PublicProcurementArticle>;
}
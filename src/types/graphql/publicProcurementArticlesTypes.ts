import {DropdownDataNumber} from '../dropdownData';
import {SingularResponse} from './utils';

export enum VisibilityType {
  None = 1,
  Accounting = 2,
  Inventory = 3,
}

export function getVisibilityTypeName(visibilityType: VisibilityType) {
  switch (visibilityType) {
    case VisibilityType.Accounting:
      return 'Materijalno knjigovodstvo';
    case VisibilityType.Inventory:
      return 'Osnovna sredstva';
    case VisibilityType.None:
    default:
      return '';
  }
}

export function getVisibilityOptions(): DropdownDataNumber[] {
  return Object.values(VisibilityType)
    .filter((value): value is VisibilityType => typeof value === 'number')
    .map(value => ({
      id: value,
      title: getVisibilityTypeName(value),
    }));
}

export interface PublicProcurementArticleParams {
  id?: number;
  public_procurement_id: number;
  title: string;
  description: string;
  net_price?: number;
  vat_percentage: number;
  manufacturer?: string;
  amount?: number;
  visibility_type: number;
}

export interface PublicProcurementArticle {
  id: number;
  public_procurement?: DropdownDataNumber;
  title: string;
  description: string;
  net_price?: number;
  vat_percentage: string;
  total_amount: number;
  amount: number;
  manufacturer?: string;
  visibility_type: VisibilityType;
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

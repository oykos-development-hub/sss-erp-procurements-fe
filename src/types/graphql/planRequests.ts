import {DropdownDataNumber} from '../dropdownData';
import {OrganizationUnitArticle} from './publicProcurementArticlesTypes';

export interface RequestArticle {
  amount: number;
  id: number;
  is_rejected: boolean;
  organization_unit: DropdownDataNumber;
  public_procurement_article: OrganizationUnitArticle;
  rejected_description: string;
  status: string;
}

export interface PublicProcurementOrganizationUnitArticlesOverviewResponse {
  data: {
    publicProcurementOrganizationUnitArticles_Overview: {
      status?: string;
      message?: string;
      items: RequestArticle[];
    };
  };
}

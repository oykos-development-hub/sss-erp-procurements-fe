import {ProcurementItemForOrganizationUnit} from './publicProcurementPlanItemDetailsTypes';

export interface PublicProcurementOrganizationUnitArticlesResponse {
  data: {
    publicProcurementOrganizationUnitArticles_Details: {
      status?: string;
      message?: string;
      items?: ProcurementItemForOrganizationUnit[];
    };
  };
}

export interface PublicProcurementOrganizationUnitArticlesParams {
  plan_id: number;
  organization_unit_id: number;
}

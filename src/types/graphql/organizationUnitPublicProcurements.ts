import {ProcurementItemForOrganizationUnit} from './publicProcurementPlanItemDetailsTypes';
import {Response} from './utils';

export interface PublicProcurementOrganizationUnitArticlesResponse {
  publicProcurementOrganizationUnitArticles_Details: Response<ProcurementItemForOrganizationUnit>;
}

export interface PublicProcurementOrganizationUnitArticlesParams {
  plan_id: number;
  organization_unit_id: number;
}

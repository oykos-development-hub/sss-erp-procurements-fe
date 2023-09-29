import {DropdownDataNumber} from '../dropdownData';
import {OrganizationUnit} from './organizationUnitsTypes';
import {Response, SingularResponse} from './utils';

export interface ProcurementPlanItemLimit {
  id?: number;
  limit: string;
  organization_unit?: DropdownDataNumber;
  public_procurement?: DropdownDataNumber;
}

export interface ProcurementPlanItemLimitInsert {
  id?: number;
  organization_unit_id: number;
  public_procurement_id: number;
  limit: string;
}

export interface ProcurementPlanItemLimitInsertResponse {
  publicProcurementPlanItemLimit_Insert: SingularResponse<ProcurementPlanItemLimit>;
}

export interface ProcurementPlanItemLimitGetResponse {
  publicProcurementPlanItem_Limits: Response<ProcurementPlanItemLimit>;
}

export interface OrganizationUnitWithLimit extends OrganizationUnit {
  limit: ProcurementPlanItemLimit;
}

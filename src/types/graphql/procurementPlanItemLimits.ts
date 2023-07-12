import {DropdownDataNumber} from '../dropdownData';

export interface ProcurementPlanItemLimit {
  id: number;
  limit: string;
  organization_unit: DropdownDataNumber;
  public_procurement: DropdownDataNumber;
}

export interface ProcurementPlanItemLimitInsert {
  id: number;
  organization_unit_id: number;
  public_procurement_id: number;
  limit: string;
}

export interface ProcurementPlanItemLimitInsertResponse {
  data: {
    publicProcurementPlanItemLimit_Insert: {
      status?: string;
      message?: string;
      items?: ProcurementPlanItemLimit[];
    };
  };
}

export interface ProcurementPlanItemLimitGetResponse {
  data: {
    publicProcurementPlanItem_Limits: {
      status?: string;
      message?: string;
      items?: ProcurementPlanItemLimit;
    };
  };
}

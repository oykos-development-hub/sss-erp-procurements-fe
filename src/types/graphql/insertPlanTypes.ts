import {DropdownDataNumber} from '../dropdownData';
import {ProcurementItem} from './publicProcurementPlanItemDetailsTypes';
import {SingularResponse} from './utils';

export interface PlanItem {
  id: number;
  pre_budget_plan: DropdownDataNumber;
  is_pre_budget: boolean;
  active: boolean;
  year: number;
  title: string;
  serial_number: string;
  date_of_publishing: string;
  date_of_closing: string;
  created_at: string;
  updated_at: string;
  file_id: number;
  items: ProcurementItem[];
}

export interface PlanItemInsert extends Omit<PlanItem, 'pre_budget_plan' | 'plan' | 'items'> {
  pre_budget_id: number;
  plan_id: number;
}

export interface PlanInsertParams {
  id: number;
  pre_budget_id: number;
  is_pre_budget: boolean;
  active: boolean;
  year: string;
  title: string;
  serial_number: string;
  date_of_publishing: string;
  date_of_closing: string;
  file_id: number;
}

export interface PublicProcurementPlanInsertResponse {
  data: {
    publicProcurementPlan_Insert: SingularResponse<PlanItem>;
  };
}

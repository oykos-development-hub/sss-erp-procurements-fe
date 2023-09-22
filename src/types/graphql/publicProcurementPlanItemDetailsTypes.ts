import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {PublicProcurementArticle, PublicProcurementArticleWithAmount} from './publicProcurementArticlesTypes';
import {PublicProcurement} from './publicProcurementTypes';
import {Response, SingularResponse} from './utils';

export interface ProcurementItem {
  id: number;
  budget_indent: DropdownDataNumber;
  plan: DropdownDataNumber;
  is_open_procurement: boolean;
  title: string;
  article_type: string;
  status: string;
  serial_number?: string;
  date_of_publishing?: string;
  date_of_awarding?: string;
  created_at: string;
  updated_at: string;
  file_id: number;
  articles: PublicProcurementArticle[];
}

export interface ProcurementItemForOrganizationUnit extends Omit<ProcurementItem, 'articles'> {
  articles: PublicProcurementArticleWithAmount[];
}
export interface ProcurementItemInsert
  extends Omit<ProcurementItem, 'budget_indent' | 'plan' | 'articles' | 'created_at' | 'updated_at'> {
  budget_indent_id: number | null;
  plan_id: number;
}

export interface ProcurementPlanItemDetailsGetResponse {
  publicProcurementPlanItem_Details: SingularResponse<PublicProcurement>;
}

export interface ProcurementPlanItemInsertResponse {
  publicProcurementPlanItem_Insert: SingularResponse<ProcurementItem>;
}

export interface ProcurementPlanItemDetailsDeleteResponse {
  publicProcurementPlanItem_Delete: SingularResponse<null>;
}

export interface ProcurementPlanDetails {
  id: number;
  pre_budget_plan: DropdownDataNumber;
  is_pre_budget: boolean;
  active: boolean;
  year: string;
  title: string;
  status: string;
  serial_number: string;
  date_of_publishing: string;
  date_of_closing: string;
  created_at: string;
  updated_at: string;
  file_id: number;
  items: ProcurementItem[];
}

export interface ProcurementPlanDetailsGetResponse {
  publicProcurementPlan_Details: SingularResponse<ProcurementPlanDetails>;
}

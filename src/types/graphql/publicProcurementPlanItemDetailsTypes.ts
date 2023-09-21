import {DropdownDataNumber, DropdownDataString} from '../dropdownData';
import {PublicProcurementArticle, PublicProcurementArticleWithAmount} from './publicProcurementArticlesTypes';

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
  data: {
    publicProcurementPlanItem_Details: {
      status?: string;
      message?: string;
      items: ProcurementItem[];
    };
  };
}

export interface ProcurementPlanItemDetailsInsertResponse {
  data: {
    publicProcurementPlanItem_Insert: {
      status?: string;
      message?: string;
      items: ProcurementItem[];
    };
  };
}

export interface ProcurementPlanItemDetailsDeleteResponse {
  data: {
    publicProcurementPlanItem_Delete: {
      status?: string;
      message?: string;
    };
  };
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
  item: ProcurementItem;
}

export interface ProcurementPlanDetailsGetResponse {
  data: {
    publicProcurementPlan_Details: {
      status?: string;
      message?: string;
      item: ProcurementPlanDetails;
    };
  };
}

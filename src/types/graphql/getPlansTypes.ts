import {DropdownDataNumber} from '../dropdownData';
import {Response} from './utils';

export interface PlanOverviewResponse {
  publicProcurementPlans_Overview: Response<PlanItem>;
}

export interface PlanItem {
  id: number;
  requests: number;
  pre_budget_plan: DropdownDataNumber;
  is_pre_budget: boolean;
  year: string;
  title: string;
  serial_number: string;
  date_of_publishing: string;
  date_of_closing: string;
  created_at: string;
  updated_at: string;
  file_id: number;
  status: string;
  items: {
    id: string;
    budget_indent: DropdownDataNumber;
    plan: DropdownDataNumber;
    is_open_procurement: boolean;
    title: string;
    article_type: string;
    status: string;
    serial_number: string;
    date_of_publishing: string;
    date_of_awarding: string;
    created_at: string;
    updated_at: string;
    file_id: number;
    articles: Article[];
  }[];
}

export interface Article {
  id: number;
  budget_indent: DropdownDataNumber;
  public_procurement: DropdownDataNumber;
  title: string;
  description: string;
  net_price: number;
  vat_percentage: number;
}

export interface GetPlansOverviewParams {
  fetch?: any;
  status: string;
  year: string;
  page: number;
  size: number;
  is_pre_budget: boolean;
}

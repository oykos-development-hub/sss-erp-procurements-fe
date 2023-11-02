import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';
import {PlanItem} from '../../types/graphql/getPlansTypes';
import {ProcurementPlanDetails} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';
import {MicroserviceProps} from '../../types/micro-service-props';

export interface ProcurementsPlanPageProps {
  context: MicroserviceProps;
}

export interface ProcurementsPlanModalProps {
  alert: any;
  fetch: () => void;
  selectedItem?: PlanItem;
  open: boolean;
  onClose: () => void;
  availableYearsForPlan: DropdownDataString[];
  navigate: (path: any) => void;
}

export interface PlanDetailsTabProps {
  fetchPlanDetails: () => Promise<void>;
  planDetails?: ProcurementPlanDetails;
  isLoadingPlanDetails: boolean;
  isSimpleProcurement: boolean;
}

export enum RequestStatus {
  Pending = 'Na čekanju',
  Rejected = 'Odbijeno',
  Approved = 'Odobreno',
  Sent = 'Poslat',
}

export type RequestAmountType = {
  totalPrice: number;
  netPrice: number;
};

export type RequestType = {
  id: number;
  organization_unit: string | undefined;
  year: string;
  is_pre_budget: boolean;
  title: string;
  date_of_publishing: string;
  amount: RequestAmountType;
  updated_at: string;
  status: RequestStatus;
}[];

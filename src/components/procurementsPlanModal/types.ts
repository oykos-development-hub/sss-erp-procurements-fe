import {DropdownDataNumber} from '../../types/dropdownData';
import {OrganizationUnit} from '../../types/graphql/organizationUnitsTypes';

export interface LimitsModalProps {
  alert: any;
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  procurementId: number;
  navigate: any;
  organizationUnits: OrganizationUnit[];
}

export interface ProcurementPlanModalFormType {
  year: DropdownDataNumber;
  is_pre_budget: DropdownDataNumber;
  pre_budget_id: DropdownDataNumber | null;
}

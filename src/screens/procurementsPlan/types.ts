import {DropdownDataNumber, DropdownDataString} from '../../types/dropdownData';
import {PlanItem} from '../../types/graphql/getPlansTypes';
import {MicroserviceProps} from '../../types/micro-service-props';

export interface ProcurementsPlanPageProps {
  //add types here
  context: MicroserviceProps;
}

export interface ProcurementsPlanModalProps {
  //add types here
  alert: any;
  fetch: () => void;
  selectedItem?: PlanItem;
  open: boolean;
  onClose: () => void;
  availableYearsForPlan: DropdownDataString[];
  navigate: (path: any) => void;
}

import {DropdownDataNumber} from '../../types/dropdownData';
import {MicroserviceProps} from '../../types/micro-service-props';

export interface ProcurementsPlanPageProps {
  //add types here
  context: MicroserviceProps;
}

export interface ProcurementsPlanModalProps {
  //add types here
  alert: any;
  fetch: () => void;
  selectedItem?: any;
  open: boolean;
  onClose: () => void;
  dropdownData: DropdownDataNumber[];
  navigate: (path: any) => void;
}

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
  dropdownData?: any;
  navigate: (path: any) => void;
}

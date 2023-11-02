import {DropdownDataString} from '../../types/dropdownData';

export interface ConvertModalProps {
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  availableYearsForPlan: DropdownDataString[];
  handleConvert: (e: any) => void;
}

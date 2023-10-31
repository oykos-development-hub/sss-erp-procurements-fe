export interface ModalProps {
  open: boolean;
  onClose: (action?: any) => void;
  alert: any;
  selectedItem: any;
  refetchData: () => void;
  organizationUnitID: number;
}

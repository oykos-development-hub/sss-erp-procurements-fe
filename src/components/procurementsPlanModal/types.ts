import {OrganizationUnit} from '../../types/graphql/organizationUnitsTypes';

export interface LimitsModalProps {
  alert: any;
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  procurementId: number;
  navigate: any;
  organizationUnits: OrganizationUnit[];
}

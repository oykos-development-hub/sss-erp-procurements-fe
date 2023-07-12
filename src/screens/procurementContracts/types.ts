import {MicroserviceProps} from '../../types/micro-service-props';
import {Supplier} from '../../types/graphql/suppliersTypes';

export interface ProcurementContractFiltersProps {
  context?: MicroserviceProps;
  suppliers: Supplier[];
  setFilters: (filters: any) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

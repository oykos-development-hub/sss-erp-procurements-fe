import {DropdownDataNumber} from '../dropdownData';

export interface ProcurementContract {
  id: number;
  public_procurement: DropdownDataNumber;
  supplier: DropdownDataNumber;
  serial_number: string;
  date_of_signing: string;
  date_of_expiry: string;
  net_value: string;
  gross_value: string;
  created_at: string;
  updated_at: string;
  file_id: number;
}

export interface ProcurementContractInsert {
  id: number;
  public_procurement_id: number;
  supplier_id: number;
  serial_number: string;
  date_of_signing: string;
  date_of_expiry: string;
  net_value: string;
  gross_value: string;
  file_id: number;
}

export interface GetProcurementContractParams {
  id: number;
  supplier_id: number;
  procurement_id: number;
}

export interface ProcurementContractsGetResponse {
  data: {
    publicProcurementContracts_Overview: {
      status?: string;
      message?: string;
      total?: string;
      items?: ProcurementContract[];
    };
  };
}

export interface ContractDeleteResponse {
  data: {
    publicProcurementContracts_Delete: {
      status?: string;
      message?: string;
    };
  };
}

export interface ProcurementContractsInsertResponse {
  data: {
    publicProcurementContracts_Insert: {
      status?: string;
      message?: string;
      items?: ProcurementContract[];
    };
  };
}

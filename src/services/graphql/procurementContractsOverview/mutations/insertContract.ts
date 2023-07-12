import {GraphQL} from '../..';
import {
  ProcurementContractInsert,
  ProcurementContractsInsertResponse,
} from '../../../../types/graphql/procurementContractsTypes';

const insertProcurementContract = async (
  data: ProcurementContractInsert,
): Promise<ProcurementContractsInsertResponse['data']['publicProcurementContracts_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    publicProcurementContracts_Insert(data: {
        id: ${data.id},
        public_procurement_id: ${data.public_procurement_id},
        supplier_id: ${data.supplier_id},
        serial_number: "${data.serial_number}",
        date_of_signing: "${data.date_of_signing}",
        date_of_expiry: "${data.date_of_expiry}",
        net_value: "${data.net_value}",
        gross_value: "${data.gross_value}",
        file_id: ${data.file_id},
    }) {
        status 
        message 
        items {
            id
            public_procurement {
                id
                title
            }
            supplier {
                id
                title
            }
            serial_number
            date_of_signing
            date_of_expiry
            net_value
            gross_value
            created_at
            updated_at
            file_id
        }
    }
  }`);

  return response?.data?.publicProcurementContracts_Insert || {};
};

export default insertProcurementContract;

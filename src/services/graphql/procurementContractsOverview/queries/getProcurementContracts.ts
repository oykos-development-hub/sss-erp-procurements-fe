import {GraphQL} from '../..';
import {
  GetProcurementContractParams,
  ProcurementContractsGetResponse,
} from '../../../../types/graphql/procurementContractsTypes';

const getProcurementContracts = async ({
  id,
  procurement_id,
  supplier_id,
}: GetProcurementContractParams): Promise<
  ProcurementContractsGetResponse['data']['publicProcurementContracts_Overview']
> => {
  const response = await GraphQL.fetch(`query {
    publicProcurementContracts_Overview(id: ${id}, procurement_id: ${procurement_id}, supplier_id: ${supplier_id}) {
        status 
        message
        total
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

  return response?.data?.publicProcurementContracts_Overview || {};
};

export default getProcurementContracts;

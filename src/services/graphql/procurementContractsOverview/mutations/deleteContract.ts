import {GraphQL} from '../../index';
import {ContractDeleteResponse} from '../../../../types/graphql/procurementContractsTypes';

const deleteContract = async (
  id: number,
): Promise<ContractDeleteResponse['data']['publicProcurementContracts_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    publicProcurementContracts_Delete(id: ${id}) {
        message
        status         
    }
}`);

  return response?.data?.publicProcurementContracts_Delete || {};
};

export default deleteContract;

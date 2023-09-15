import {GraphQL} from '../..';
import {DeletePlan} from '../../../../types/graphql/deletePlansTypes';

const deletePublicProcurementPlan = async (id: number): Promise<DeletePlan['data']['publicProcurementPlan_Delete']> => {
  const response = await GraphQL.fetch(`mutation {
    publicProcurementPlan_Delete(id: ${id}) {
        message
        status
    }
}`);

  return response?.data?.publicProcurementPlan_Delete || {};
};

export default deletePublicProcurementPlan;

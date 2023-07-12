import {GraphQL} from '../..';
import {ProcurementPlanItemDetailsDeleteResponse} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';

const deletePublicProcurementPlanItem = async (
  id: number,
): Promise<ProcurementPlanItemDetailsDeleteResponse['data']['publicProcurementPlanItem_Delete']> => {
  const response = await GraphQL.fetch(`
    mutation {
        publicProcurementPlanItem_Delete(id: ${id}) {
        message
        status
      }
    }
    `);

  return response?.data?.publicProcurementPlanItem_Delete || {};
};

export default deletePublicProcurementPlanItem;

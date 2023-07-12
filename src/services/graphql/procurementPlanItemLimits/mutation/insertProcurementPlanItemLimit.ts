import {GraphQL} from '../../index';
import {
  ProcurementPlanItemLimitInsert,
  ProcurementPlanItemLimitInsertResponse,
} from '../../../../types/graphql/procurementPlanItemLimits';

const insertProcurementPlanItemLimit = async (
  data: ProcurementPlanItemLimitInsert,
): Promise<ProcurementPlanItemLimitInsertResponse['data']['publicProcurementPlanItemLimit_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    publicProcurementPlanItemLimit_Insert(data: {
      id: ${data.id},
      public_procurement_id: ${data.public_procurement_id},
      organization_unit_id: ${data.organization_unit_id},
      limit: "${data.limit}",
    }) {
        status 
        message 
        items {
            id
            organization_unit {
                id
                title
            }
            public_procurement {
                id
                title
            }
            limit
        }
      }
    }`);

  return response?.data?.publicProcurementPlanItemLimit_Insert || {};
};

export default insertProcurementPlanItemLimit;

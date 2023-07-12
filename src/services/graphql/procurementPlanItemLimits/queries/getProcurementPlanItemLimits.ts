import {GraphQL} from '../../index';
import {ProcurementPlanItemLimitGetResponse} from '../../../../types/graphql/procurementPlanItemLimits';

const getProcurementPlanItemLimits = async (
  procurement_id: number,
): Promise<ProcurementPlanItemLimitGetResponse['data']['publicProcurementPlanItem_Limits']> => {
  const response = await GraphQL.fetch(`query {
    publicProcurementPlanItem_Limits(procurement_id: ${procurement_id}) {
        status 
        message
        items {
            id
            limit
            organization_unit {
                id
                title
            }
            public_procurement {
                id
                title
            }
        }
      }
    }`);

  return response?.data?.publicProcurementPlanItem_Limits || {};
};

export default getProcurementPlanItemLimits;

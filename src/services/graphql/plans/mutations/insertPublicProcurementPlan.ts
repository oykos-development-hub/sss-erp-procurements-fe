import {GraphQL} from '../..';
import {PlanInsertParams, PublicProcurementPlanInsertResponse} from '../../../../types/graphql/insertPlanTypes';

const insertPublicProcurementPlan = async (
  data: PlanInsertParams,
): Promise<PublicProcurementPlanInsertResponse['data']['publicProcurementPlan_Insert']> => {
  const query = `mutation($data: PublicProcurementPlanInsertMutation!) {
    publicProcurementPlan_Insert(data: $data) {
        status 
        message 
        data
        item {
            id
            pre_budget_plan {
                id
                title
            }
            is_pre_budget
            active
            year
            title
            serial_number
            date_of_publishing
            date_of_closing
            created_at
            updated_at
            file_id
            items {
                id
                budget_indent {
                    id
                    title
                }
                plan {
                    id
                    title
                }
                is_open_procurement
                title
                article_type
                status
                serial_number
                date_of_publishing
                date_of_awarding
                created_at
                updated_at
                file_id
                articles {
                    id
                    budget_indent {
                        id
                        title
                    }
                    public_procurement {
                        id
                        title
                    }
                    title
                    description
                    net_price
                    vat_percentage
                }
            }
        }
    }
}`;

  const response = await GraphQL.fetch(query, {data});

  return response?.data?.publicProcurementPlan_Insert || {};
};

export default insertPublicProcurementPlan;

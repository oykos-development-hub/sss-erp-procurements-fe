import {GraphQL} from '../..';
import {ProcurementPlanDetailsGetResponse} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';

const getPublicProcurementPlanDetails = async (
  id: number,
): Promise<ProcurementPlanDetailsGetResponse['data']['publicProcurementPlan_Details']> => {
  const response = await GraphQL.fetch(`query {
    publicProcurementPlan_Details(id: ${id}) {
        status 
        message
        items {
            id
            pre_budget_plan {
                id
                title
            }
            is_pre_budget
            active
            year
            title
            status
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
}`);

  return response?.data?.publicProcurementPlan_Details || {};
};

export default getPublicProcurementPlanDetails;

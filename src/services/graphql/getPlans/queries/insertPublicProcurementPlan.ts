import {GraphQL} from '../..';
import {PlanInsertParams, PublicProcurementPlanInsertResponse} from '../../../../types/graphql/insertPlanTypes';

const insertPublicProcurementPlan = async (
  data: PlanInsertParams,
): Promise<PublicProcurementPlanInsertResponse['data']['publicProcurementPlan_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    publicProcurementPlan_Insert(data: {
        id: ${data.id},
        pre_budget_id: ${data.pre_budget_id},
        is_pre_budget: ${data.is_pre_budget},
        active: ${data.active},
        year: "${data.year}",
        title: "${data.title}",
        serial_number: "${data.serial_number}",
        date_of_publishing: "${data.date_of_publishing}",
        date_of_closing: "${data.date_of_closing}",
        file_id: ${data.file_id}
    }) {
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
    }}`);

  return response?.data?.publicProcurementPlan_Insert || {};
};

export default insertPublicProcurementPlan;

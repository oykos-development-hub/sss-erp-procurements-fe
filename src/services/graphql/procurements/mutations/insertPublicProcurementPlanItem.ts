import {GraphQL} from '../..';
import {
  ProcurementPlanItemDetailsInsertResponse,
  ProcurementItemInsert,
} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';

const insertPublicProcurementPlanItem = async (
  data: ProcurementItemInsert,
): Promise<ProcurementPlanItemDetailsInsertResponse['data']['publicProcurementPlanItem_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    publicProcurementPlanItem_Insert(data: {
        id: ${data.id},
        budget_indent_id: ${data.budget_indent_id},
        plan_id: ${data.plan_id},
        is_open_procurement: ${data.is_open_procurement},
        title: "${data.title}",
        article_type: "${data.article_type}",
        status: "${data.status}",
        serial_number: "${data.serial_number}",
        date_of_publishing: "${data.date_of_publishing}",
        date_of_awarding: "${data.date_of_awarding}",
        file_id: ${data.file_id},
    }) {
        status 
        message
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
    }}`);

  return response?.data?.publicProcurementPlanItem_Insert || {};
};

export default insertPublicProcurementPlanItem;

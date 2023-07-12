import {GraphQL} from '../..';
import {ProcurementPlanItemDetailsGetResponse} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';

const getPublicProcurementPlanItemDetails = async (
  id?: number,
): Promise<ProcurementPlanItemDetailsGetResponse['data']['publicProcurementPlanItem_Details']> => {
  const response = await GraphQL.fetch(`query {
    publicProcurementPlanItem_Details(id: ${id}) {
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
    }
}`);

  return response.data?.publicProcurementPlanItem_Details || {};
};

export default getPublicProcurementPlanItemDetails;

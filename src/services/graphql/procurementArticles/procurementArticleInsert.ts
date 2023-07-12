import {GraphQL} from '..';
import {
  PublicProcurementArticleParams,
  PublicProcurementArticleInsertResponse,
} from '../../../types/graphql/publicProcurementArticlesTypes';

const publicProcurementArticleInsert = async (
  data: PublicProcurementArticleParams,
): Promise<PublicProcurementArticleInsertResponse['data']['publicProcurementPlanItemArticle_Insert']> => {
  const response = await GraphQL.fetch(`mutation {
    publicProcurementPlanItemArticle_Insert(data: {
        id: ${data.id},
        budget_indent_id: ${data.budget_indent_id},
        public_procurement_id: ${data.public_procurement_id},
        title: "${data.title}",
        description: "${data.description}",
        net_price: "${data.net_price}",
        vat_percentage: "${data.vat_percentage}",
      }
      ) {
        status
        message
        items {
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
    }`);
  return response?.data?.publicProcurementPlanItemArticle_Insert || {};
};

export default publicProcurementArticleInsert;

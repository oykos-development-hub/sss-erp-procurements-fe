import {GraphQL} from '..';
import {PublicProcurementArticleDeleteResponse} from '../../../types/graphql/publicProcurementArticlesTypes';

const publicProcurementArticleDelete = async (
  id: number,
): Promise<PublicProcurementArticleDeleteResponse['data']['publicProcurementPlanItemArticle_Delete']> => {
  const response = await GraphQL.fetch(`
    mutation {
        publicProcurementPlanItemArticle_Delete(id: ${id}) {
        message
        status
      }
    }
    `);

  return response?.data?.publicProcurementPlanItemArticle_Delete || {};
};

export default publicProcurementArticleDelete;

import {GraphQL} from '../..';
import {
  ProcurementOrganizationUnitArticlesInsertParams,
  ProcurementOrganizationUnitArticlesInsertResponse,
} from '../../../../types/graphql/procurementOrganizationUnitArticlesOverview';

const publicProcurementOrganizationUnitArticleInsert = async (
  data: ProcurementOrganizationUnitArticlesInsertParams,
): Promise<
  ProcurementOrganizationUnitArticlesInsertResponse['data']['publicProcurementOrganizationUnitArticle_Insert']
> => {
  const query = `
      mutation {
        publicProcurementOrganizationUnitArticle_Insert(data: {
          id: ${data.id}
          public_procurement_article_id: ${data.public_procurement_article_id}
          organization_unit_id: ${data.organization_unit_id}
          amount: ${data.amount}
          status: "${data.status}"
          is_rejected: ${data.is_rejected}
          rejected_description: "${data.rejected_description}"
        }) {
          status
          message
          items {
            id
            public_procurement_article {
              id
              title
            }
            organization_unit {
              id
              title
            }
            amount
            status
            is_rejected
            rejected_description
          }
        }
      }
    `;

  const response = await GraphQL.fetch(query);
  return response?.data?.publicProcurementOrganizationUnitArticle_Insert || {};
};

export default publicProcurementOrganizationUnitArticleInsert;

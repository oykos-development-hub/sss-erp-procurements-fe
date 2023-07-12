import {GraphQL} from '../..';
import {PublicProcurementOrganizationUnitArticlesOverviewResponse} from '../../../../types/graphql/planRequests';

const getPublicProcurementPlanRequests = async (
  id?: number,
): Promise<
  PublicProcurementOrganizationUnitArticlesOverviewResponse['data']['publicProcurementOrganizationUnitArticles_Overview']
> => {
  const response = await GraphQL.fetch(`query {
    publicProcurementOrganizationUnitArticles_Overview(procurement_id: ${id}) {
        status 
        message
        items {
          id
          amount
          status
          is_rejected
          rejected_description
          organization_unit {
              id
              title
          }
          public_procurement_article {
              id
              title
              net_price
              vat_percentage
          }
      }
    }
}`);

  return response.data?.publicProcurementOrganizationUnitArticles_Overview || {};
};

export default getPublicProcurementPlanRequests;

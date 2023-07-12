import {GraphQL} from '..';
import {
  PublicProcurementOrganizationUnitArticlesParams,
  PublicProcurementOrganizationUnitArticlesResponse,
} from '../../../types/graphql/organizationUnitPublicProcurements';

const getOrganizationUnitPublicProcurements = async ({
  plan_id,
  organization_unit_id,
}: PublicProcurementOrganizationUnitArticlesParams): Promise<
  PublicProcurementOrganizationUnitArticlesResponse['data']['publicProcurementOrganizationUnitArticles_Details']
> => {
  const response = await GraphQL.fetch(`query {
    publicProcurementOrganizationUnitArticles_Details(plan_id: ${plan_id}, organization_unit_id: ${organization_unit_id}) {
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
                  description
              }
          }
      }
    }
}`);

  return response.data?.publicProcurementOrganizationUnitArticles_Details || {};
};

export default getOrganizationUnitPublicProcurements;

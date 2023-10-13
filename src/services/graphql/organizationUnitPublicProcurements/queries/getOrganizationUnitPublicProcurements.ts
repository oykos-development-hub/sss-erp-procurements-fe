const organizationUnitArticleDetailsQuery = `query OrganizationUnitPublicProcurementsArticles($plan_id: Int!, $organization_unit_id: Int) {
  publicProcurementOrganizationUnitArticles_Details(plan_id: $plan_id, organization_unit_id: $organization_unit_id) {
      status 
      message
      items {
          id
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
}`;

export default organizationUnitArticleDetailsQuery;

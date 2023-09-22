const getPublicProcurementPlanRequestsQuery = `query OrganizationUnitArticles($procurement_id: Int) {
  publicProcurementOrganizationUnitArticles_Overview(procurement_id: $procurement_id) {
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
}`;

export default getPublicProcurementPlanRequestsQuery;

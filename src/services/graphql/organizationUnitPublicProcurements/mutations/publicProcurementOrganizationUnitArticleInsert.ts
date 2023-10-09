const organizationUnitArticleInsertMutation = `
  mutation($data: PublicProcurementOrganizationUnitArticleInsertMutation!) {
    publicProcurementOrganizationUnitArticle_Insert(data: $data) {
        status 
        data
        message 
        item {
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

export default organizationUnitArticleInsertMutation;

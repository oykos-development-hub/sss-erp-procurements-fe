const organizationUnitArticleInsertMutation = `
      mutation {
        publicProcurementOrganizationUnitArticle_Insert(data: $data) {
          status
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

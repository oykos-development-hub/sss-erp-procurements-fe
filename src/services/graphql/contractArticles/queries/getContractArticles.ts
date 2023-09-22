const contractArticlesOverviewQuery = `query {
  publicProcurementContractArticles_Overview(contract_id: $contract_id) {
      status 
      message
      items {
          id
          public_procurement_article {
              id
              title
              vat_percentage
              description
          }
          contract {
              id
              title
          }
          amount
          net_value
          gross_value
      }
  }
}`;

export default contractArticlesOverviewQuery;

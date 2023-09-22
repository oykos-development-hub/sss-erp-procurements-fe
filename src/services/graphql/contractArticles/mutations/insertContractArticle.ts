const insertContractArticleMutation = `mutation {
  publicProcurementContractArticle_Insert(data: {$data) {
      status 
      message 
      items {
          id
          public_procurement_article {
              id
              title
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

export default insertContractArticleMutation;

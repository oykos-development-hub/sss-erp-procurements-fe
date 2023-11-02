const articleInsertMutation = `mutation($data: PublicProcurementPlanItemArticleInsertMutation!) {
  publicProcurementPlanItemArticle_Insert(data: $data) {
      status
      message
      item {
        id
        public_procurement {
            id
            title
        }
        title
        description
        net_price
        vat_percentage
        manufacturer
      }
    }
  }`;

export default articleInsertMutation;
